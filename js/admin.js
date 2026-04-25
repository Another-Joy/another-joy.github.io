import supabase from './supabase-client.js';
import { requireAuth, signOut } from './auth.js';

// ── Required Supabase setup ───────────────────────────────────────────────────
//
//  Run the following SQL in your Supabase SQL Editor to enable the admin page.
//
//  ① Profiles table — mirrors auth.users for cross-user queries
//
//    create table public.profiles (
//      id         uuid primary key references auth.users on delete cascade,
//      username   text,
//      is_admin   boolean not null default false,
//      created_at timestamptz not null default now()
//    );
//    alter table public.profiles enable row level security;
//
//    -- Each user can read their own profile
//    create policy "Users read own profile"
//      on public.profiles for select
//      using (auth.uid() = id);
//
//    -- Admins can read all profiles
//    create policy "Admins read all profiles"
//      on public.profiles for select
//      using (exists (
//        select 1 from public.profiles where id = auth.uid() and is_admin
//      ));
//
//    -- Auto-create a profile row whenever a new user signs up
//    create or replace function public.handle_new_user()
//    returns trigger language plpgsql security definer as $$
//    begin
//      insert into public.profiles (id, username)
//      values (new.id, new.raw_user_meta_data->>'username');
//      return new;
//    end;
//    $$;
//    create trigger on_auth_user_created
//      after insert on auth.users
//      for each row execute procedure public.handle_new_user();
//
//  ② Allow admins to read all army lists
//
//    create policy "Admins read all lists"
//      on public.army_lists for select
//      using (exists (
//        select 1 from public.profiles where id = auth.uid() and is_admin
//      ));
//
//    -- Optional: add a created_at column if not present
//    alter table public.army_lists
//      add column if not exists created_at timestamptz not null default now();
//
//  ③ Page views table — lightweight visit tracking
//
//    create table public.page_views (
//      id         bigserial primary key,
//      path       text not null,
//      user_id    uuid references auth.users,
//      visited_at timestamptz not null default now()
//    );
//    alter table public.page_views enable row level security;
//
//    create policy "Anyone inserts page views"
//      on public.page_views for insert
//      with check (true);
//
//    create policy "Admins read all page views"
//      on public.page_views for select
//      using (exists (
//        select 1 from public.profiles where id = auth.uid() and is_admin
//      ));
//
//  ④ To grant admin access to a user:
//
//    update public.profiles set is_admin = true where id = '<user-uuid>';
//
// ─────────────────────────────────────────────────────────────────────────────

let currentUser = null;

const WEEK_AGO  = () => new Date(Date.now() - 7  * 24 * 60 * 60 * 1000).toISOString();
const MONTH_AGO = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
const TODAY     = () => new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  // Verify admin status via profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin, username')
    .eq('id', currentUser.id)
    .single();

  if (error || !profile?.is_admin) {
    window.location.href = '/lists';
    return;
  }

  document.getElementById('nav-user').textContent = profile.username || currentUser.email;
  document.getElementById('btn-logout').addEventListener('click', () => signOut());
  document.getElementById('btn-refresh').addEventListener('click', () => window.location.reload());

  await loadAll();

  document.getElementById('admin-loading').classList.add('d-none');
  document.getElementById('admin-content').classList.remove('d-none');
}

async function loadAll() {
  await Promise.all([
    loadUserStats(),
    loadListStats(),
    loadPageViewStats(),
    loadRecentUsers(),
    loadTopUsers(),
  ]);
}

// ── User stats ────────────────────────────────────────────────────────────────

async function loadUserStats() {
  const weekAgo  = WEEK_AGO();
  const monthAgo = MONTH_AGO();

  const [
    { count: total },
    { count: newWeek },
    { count: newMonth },
    { data: activeData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo),
    // Users active this week = distinct user_ids in army_lists updated this week
    supabase.from('army_lists').select('user_id').gte('updated_at', weekAgo),
  ]);

  setStat('stat-users-total',  total);
  setStat('stat-users-week',   newWeek);
  setStat('stat-users-month',  newMonth);

  if (activeData) {
    const unique = new Set(activeData.map(r => r.user_id)).size;
    setStat('stat-users-active', unique);
  }
}

// ── List stats ────────────────────────────────────────────────────────────────

async function loadListStats() {
  const weekAgo = WEEK_AGO();

  const [
    { count: total },
    { count: createdWeek },
    { count: updatedWeek },
    { count: totalForAvg },
    { count: usersTotal },
  ] = await Promise.all([
    supabase.from('army_lists').select('*', { count: 'exact', head: true }),
    supabase.from('army_lists').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('army_lists').select('*', { count: 'exact', head: true }).gte('updated_at', weekAgo),
    supabase.from('army_lists').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  setStat('stat-lists-total',        total);
  setStat('stat-lists-created-week', createdWeek);
  setStat('stat-lists-updated-week', updatedWeek);

  const avg = usersTotal > 0 ? (totalForAvg / usersTotal).toFixed(1) : '—';
  setStat('stat-lists-avg', avg);
}

// ── Page view stats ───────────────────────────────────────────────────────────

async function loadPageViewStats() {
  const weekAgo = WEEK_AGO();
  const today   = TODAY();

  const [
    { count: viewsWeek },
    { data: viewsData },
    { count: viewsToday },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('visited_at', weekAgo),
    supabase.from('page_views').select('path, user_id').gte('visited_at', weekAgo),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('visited_at', today),
  ]);

  setStat('stat-views-week',  viewsWeek);
  setStat('stat-views-today', viewsToday);

  if (viewsData) {
    const uniqueUsers = new Set(viewsData.filter(r => r.user_id).map(r => r.user_id)).size;
    const anonCount   = viewsData.filter(r => !r.user_id).length;
    setStat('stat-views-unique', uniqueUsers);
    setStat('stat-views-anon',   anonCount);

    // Top pages table
    const pageCounts = {};
    viewsData.forEach(r => { pageCounts[r.path] = (pageCounts[r.path] || 0) + 1; });
    const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const tbody = document.getElementById('top-pages-tbody');
    tbody.innerHTML = sorted.length
      ? sorted.map(([path, count]) => `<tr><td class="text-truncate" style="max-width:160px">${path}</td><td>${count}</td></tr>`).join('')
      : '<tr><td colspan="2" class="text-secondary small p-3">No data yet.</td></tr>';
  }
}

// ── Recent sign-ups ───────────────────────────────────────────────────────────

async function loadRecentUsers() {
  const { data } = await supabase
    .from('profiles')
    .select('username, created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  const tbody = document.getElementById('recent-users-tbody');
  if (!data || !data.length) {
    tbody.innerHTML = '<tr><td colspan="2" class="text-secondary small p-3">No users found.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(u => `
    <tr>
      <td>${u.username ? escHtml(u.username) : '<em class="text-secondary">—</em>'}</td>
      <td class="text-secondary small">${fmtDate(u.created_at)}</td>
    </tr>`).join('');
}

// ── Top users by list count ───────────────────────────────────────────────────

async function loadTopUsers() {
  const [{ data: profiles }, { data: lists }] = await Promise.all([
    supabase.from('profiles').select('id, username'),
    supabase.from('army_lists').select('user_id'),
  ]);

  const tbody = document.getElementById('top-users-tbody');

  if (!profiles || !lists) {
    tbody.innerHTML = '<tr><td colspan="2" class="text-secondary small p-3">No data.</td></tr>';
    return;
  }

  const counts     = {};
  lists.forEach(l => { counts[l.user_id] = (counts[l.user_id] || 0) + 1; });
  const profileMap = Object.fromEntries(profiles.map(p => [p.id, p.username]));

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  tbody.innerHTML = sorted.length
    ? sorted.map(([uid, count]) => `
        <tr>
          <td>${profileMap[uid] ? escHtml(profileMap[uid]) : '<em class="text-secondary">unknown</em>'}</td>
          <td>${count}</td>
        </tr>`).join('')
    : '<tr><td colspan="2" class="text-secondary small p-3">No lists yet.</td></tr>';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '—';
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const div       = document.createElement('div');
  div.className   = `toast align-items-center text-bg-${type} border-0`;
  div.setAttribute('role', 'alert');
  div.innerHTML   = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(div);
  bootstrap.Toast.getOrCreateInstance(div).show();
  div.addEventListener('hidden.bs.toast', () => div.remove());
}

init();
