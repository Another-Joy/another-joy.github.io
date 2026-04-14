import supabase from './supabase-client.js';
import { requireAuth, signOut } from './auth.js';
import { SIZE_LIMITS } from './config.js';

const REGIMENTS_INDEX = 'data/regiments/index.json';

let currentUser   = null;
let regimentsList = [];  // [{ file, name }]

async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  const displayName = currentUser.user_metadata?.username || currentUser.email;
  document.getElementById('nav-user').textContent = displayName;

  document.getElementById('btn-logout').addEventListener('click', () => signOut());
  document.getElementById('btn-new-list').addEventListener('click', openNewListModal);
  document.getElementById('btn-create-list').addEventListener('click', submitNewList);

  // Populate size-limit <select> from config
  const sizeSelect = document.getElementById('new-list-size');
  SIZE_LIMITS.forEach(s => {
    const opt = document.createElement('option');
    opt.value       = s.points;
    opt.textContent = `${s.label} — ${s.points} pts`;
    sizeSelect.appendChild(opt);
  });

  await Promise.all([loadLists(), loadRegimentsIndex()]);
}

// ── Regiment index (names only, for the modal checkboxes) ────────────────────

async function loadRegimentsIndex() {
  try {
    const res = await fetch(REGIMENTS_INDEX);
    if (!res.ok) throw new Error();
    const { regiments } = await res.json();
    regimentsList = regiments || [];
  } catch {
    regimentsList = [];
  }
}

// ── New-list modal ─────────────────────────────────────────────────────────────

function openNewListModal() {
  // Populate regiment checkboxes
  const container = document.getElementById('new-list-regiments');
  container.innerHTML = '';
  if (regimentsList.length === 0) {
    container.innerHTML = '<p class="text-secondary small mb-0">No regiments found in index.json.</p>';
  } else {
    regimentsList.forEach((r, i) => {
      const id  = `reg-check-${i}`;
      const div = document.createElement('div');
      div.className = 'form-check';
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${escapeHtml(r.name)}" id="${id}" checked>
        <label class="form-check-label" for="${id}">${escapeHtml(r.name)}</label>`;
      container.appendChild(div);
    });
  }

  // Reset name input
  const nameInput = document.getElementById('new-list-name');
  nameInput.value = '';
  nameInput.classList.remove('is-invalid');

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-new-list')).show();
}

async function submitNewList() {
  const nameInput = document.getElementById('new-list-name');
  const name      = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('is-invalid');
    return;
  }
  nameInput.classList.remove('is-invalid');

  const sizeLimit = parseInt(document.getElementById('new-list-size').value, 10);
  const allowedRegiments = Array.from(
    document.querySelectorAll('#new-list-regiments .form-check-input:checked')
  ).map(cb => cb.value);

  const btn    = document.getElementById('btn-create-list');
  btn.disabled = true;

  const { data, error } = await supabase
    .from('army_lists')
    .insert({
      user_id:           currentUser.id,
      name,
      size:              0,
      cost:              0,
      size_limit:        sizeLimit,
      allowed_regiments: allowedRegiments,
      units:             [],
    })
    .select('id')
    .single();

  btn.disabled = false;

  if (error) {
    showToast('Could not create list: ' + error.message, 'danger');
    return;
  }

  bootstrap.Modal.getInstance(document.getElementById('modal-new-list')).hide();
  window.location.href = `/builder?id=${data.id}`;
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
    .select('id, name, size, cost, size_limit, updated_at')
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
    const overLimit = list.size_limit && list.cost > list.size_limit;
    const tr = document.createElement('tr');
    tr.className = 'list-row';
    tr.dataset.id = list.id;
    tr.innerHTML = `
      <td>${escapeHtml(list.name)}</td>
      <td>${formatDate(list.updated_at)}</td>
      <td>${list.size ?? 0}</td>
      <td class="${overLimit ? 'text-danger fw-semibold' : ''}">${list.cost ?? 0}${list.size_limit ? ' / ' + list.size_limit : ''} pts</td>
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
      window.location.href = `/builder?id=${row.dataset.id}`;
    });
  });

  // Edit button
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      window.location.href = `/builder?id=${btn.dataset.id}`;
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
