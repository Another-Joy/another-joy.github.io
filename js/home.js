import supabase from './supabase-client.js';
import { requireAuth, signOut } from './auth.js';

let currentUser = null;

async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  // Display user in navbar
  const displayName = currentUser.user_metadata?.username || currentUser.email;
  document.getElementById('nav-user').textContent = displayName;

  document.getElementById('btn-logout').addEventListener('click', () => signOut());
  document.getElementById('btn-new-list').addEventListener('click', createNewList);

  await loadLists();
}

// ── Load & render list table ──────────────────────────────────────────────────

async function loadLists() {
  const loadingEl = document.getElementById('lists-loading');
  const tableEl   = document.getElementById('lists-table');
  const emptyEl   = document.getElementById('lists-empty');

  loadingEl.classList.remove('d-none');
  tableEl.classList.add('d-none');
  emptyEl.classList.add('d-none');

  const { data: lists, error } = await supabase
    .from('army_lists')
    .select('id, name, size, cost, updated_at')
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false });

  loadingEl.classList.add('d-none');

  if (error) {
    showToast('Failed to load lists: ' + error.message, 'danger');
    return;
  }

  if (!lists || lists.length === 0) {
    emptyEl.classList.remove('d-none');
    return;
  }

  const tbody = document.getElementById('lists-tbody');
  tbody.innerHTML = '';

  lists.forEach(list => {
    const tr = document.createElement('tr');
    tr.className = 'list-row';
    tr.dataset.id = list.id;
    tr.innerHTML = `
      <td>${escapeHtml(list.name)}</td>
      <td>${formatDate(list.updated_at)}</td>
      <td>${list.size ?? 0}</td>
      <td>${list.cost ?? 0} pts</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-secondary me-1 btn-edit" data-id="${list.id}" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${list.id}" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });

  // Row click opens builder
  tbody.querySelectorAll('.list-row').forEach(row => {
    row.addEventListener('click', () => {
      window.location.href = `builder.html?id=${row.dataset.id}`;
    });
  });

  // Edit button
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      window.location.href = `builder.html?id=${btn.dataset.id}`;
    });
  });

  // Delete button
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation();
      if (!confirm('Delete this army list? This cannot be undone.')) return;
      await deleteList(btn.dataset.id);
    });
  });

  tableEl.classList.remove('d-none');
}

// ── Create new list ───────────────────────────────────────────────────────────

async function createNewList() {
  const name = prompt('Name your army list:');
  if (!name?.trim()) return;

  const { data, error } = await supabase
    .from('army_lists')
    .insert({
      user_id: currentUser.id,
      name: name.trim(),
      size: 0,
      cost: 0,
      units: [],
    })
    .select('id')
    .single();

  if (error) {
    showToast('Could not create list: ' + error.message, 'danger');
    return;
  }

  window.location.href = `builder.html?id=${data.id}`;
}

// ── Delete list ───────────────────────────────────────────────────────────────

async function deleteList(id) {
  const { error } = await supabase.from('army_lists').delete().eq('id', id);
  if (error) {
    showToast('Could not delete list: ' + error.message, 'danger');
    return;
  }
  await loadLists();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const id  = 'toast-' + Date.now();
  const div = document.createElement('div');
  div.id        = id;
  div.className = `toast align-items-center text-bg-${type} border-0`;
  div.setAttribute('role', 'alert');
  div.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(div);
  bootstrap.Toast.getOrCreateInstance(div).show();
  div.addEventListener('hidden.bs.toast', () => div.remove());
}

init();
