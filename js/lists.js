import supabase from './supabase-client.js';
import { requireAuth, signOut, navigate } from './auth.js';
import { GAME_SIZES } from './config.js';

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
  document.getElementById('btn-save-edit-list').addEventListener('click', submitEditList);

  // Populate game size selects from config
  [document.getElementById('new-list-size'), document.getElementById('edit-list-size')].forEach(sel => {
    GAME_SIZES.forEach(s => {
      const opt = document.createElement('option');
      opt.value       = JSON.stringify({ mp: s.mp, mats: s.mats });
      opt.textContent = `${s.label} — ${s.mp} MP / ${s.mats} Mats`;
      sel.appendChild(opt);
    });
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
        <input class="form-check-input" type="checkbox" value="${escapeHtml(r.name)}" id="${id}">
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

  const { mp: mpLimit, mats: matsLimit } = JSON.parse(document.getElementById('new-list-size').value);
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
      mp_cost:           0,
      mats_cost:         0,
      mp_limit:          mpLimit,
      mats_limit:        matsLimit,
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
  navigate(`/builder?id=${data.id}`);
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
    .select('id, name, size, mp_cost, mats_cost, mp_limit, mats_limit, updated_at')
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
    const overMp   = list.mp_limit   && list.mp_cost   > list.mp_limit;
    const overMats = list.mats_limit && list.mats_cost > list.mats_limit;
    const tr = document.createElement('tr');
    tr.className = 'list-row';
    tr.dataset.id = list.id;
    tr.innerHTML = `
      <td>${escapeHtml(list.name)}</td>
      <td>${formatDate(list.updated_at)}</td>
      <td>${list.size ?? 0}</td>
      <td class="${overMp ? 'text-danger fw-semibold' : ''}">${list.mp_cost ?? 0}${list.mp_limit ? ' / ' + list.mp_limit : ''}</td>
      <td class="${overMats ? 'text-danger fw-semibold' : ''}">${list.mats_cost ?? 0}${list.mats_limit ? ' / ' + list.mats_limit : ''}</td>
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
      navigate(`/builder?id=${row.dataset.id}`);
    });
  });

  // Edit button — opens settings modal
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openEditModal(btn.dataset.id);
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
// ── Edit list settings modal ───────────────────────────────────────────────────────────

let editingList = null;  // full list object currently being edited

async function openEditModal(id) {
  // Fetch full list data (need units + allowed_regiments + limits)
  const { data, error } = await supabase
    .from('army_lists')
    .select('id, name, mp_limit, mats_limit, allowed_regiments, units')
    .eq('id', id)
    .eq('user_id', currentUser.id)
    .single();

  if (error || !data) {
    showToast('Could not load list settings.', 'danger');
    return;
  }

  editingList = data;
  if (!Array.isArray(editingList.units)) editingList.units = [];
  if (!Array.isArray(editingList.allowed_regiments)) editingList.allowed_regiments = [];

  // Pre-select current size
  const sizeSelect = document.getElementById('edit-list-size');
  const matchIdx = GAME_SIZES.findIndex(s => s.mp === data.mp_limit && s.mats === data.mats_limit);
  sizeSelect.value = matchIdx >= 0
    ? JSON.stringify({ mp: GAME_SIZES[matchIdx].mp, mats: GAME_SIZES[matchIdx].mats })
    : sizeSelect.options[0]?.value;

  // Populate regiment checkboxes, pre-ticking current selection
  const container = document.getElementById('edit-list-regiments');
  container.innerHTML = '';
  if (regimentsList.length === 0) {
    container.innerHTML = '<p class="text-secondary small mb-0">No regiments found.</p>';
  } else {
    regimentsList.forEach((r, i) => {
      const checkId = `edit-reg-check-${i}`;
      const checked = editingList.allowed_regiments.includes(r.name);
      const div = document.createElement('div');
      div.className = 'form-check';
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${escapeHtml(r.name)}" id="${checkId}"${checked ? ' checked' : ''}>
        <label class="form-check-label" for="${checkId}">${escapeHtml(r.name)}</label>`;
      container.appendChild(div);
    });
  }

  // Hide any previous warning
  const warningEl = document.getElementById('edit-list-warning');
  warningEl.classList.add('d-none');
  const saveBtn = document.getElementById('btn-save-edit-list');
  saveBtn.dataset.confirmed = '';
  saveBtn.innerHTML = '<i class="bi bi-floppy me-1"></i>Save';

  bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-edit-list')).show();
}

async function submitEditList() {
  if (!editingList) return;

  const { mp: mpLimit, mats: matsLimit } =
    JSON.parse(document.getElementById('edit-list-size').value);

  const newRegiments = Array.from(
    document.querySelectorAll('#edit-list-regiments .form-check-input:checked')
  ).map(cb => cb.value);

  // Find units that belong to regiments being removed
  const removed = editingList.allowed_regiments.filter(r => !newRegiments.includes(r));
  const orphaned = (editingList.units || []).filter(u => removed.includes(u.regiment));

  const saveBtn   = document.getElementById('btn-save-edit-list');
  const warningEl = document.getElementById('edit-list-warning');

  if (orphaned.length > 0 && saveBtn.dataset.confirmed !== 'yes') {
    // Show warning and ask for confirmation
    const names = [...new Set(orphaned.map(u => u.name))].join(', ');
    document.getElementById('edit-list-warning-text').textContent =
      `${orphaned.length} unit${orphaned.length > 1 ? 's' : ''} will be removed because their regiment is no longer allowed: ${names}. Click Save again to confirm.`;
    warningEl.classList.remove('d-none');
    saveBtn.dataset.confirmed = 'yes';
    return;
  }

  // Filter out orphaned units
  const updatedUnits = (editingList.units || []).filter(u => !removed.includes(u.regiment));

  // Recompute costs from remaining units
  const mpCost   = updatedUnits.reduce((s, e) => s + e.count * (e.mp_per_unit   ?? 0), 0);
  const matsCost = updatedUnits.reduce((s, e) => s + e.count * (e.mats_per_unit ?? 0), 0);

  saveBtn.disabled = true;

  const { error } = await supabase
    .from('army_lists')
    .update({
      mp_limit:          mpLimit,
      mats_limit:        matsLimit,
      allowed_regiments: newRegiments,
      units:             updatedUnits,
      mp_cost:           mpCost,
      mats_cost:         matsCost,
    })
    .eq('id', editingList.id);

  saveBtn.disabled = false;

  if (error) {
    showToast('Could not save settings: ' + error.message, 'danger');
    return;
  }

  bootstrap.Modal.getInstance(document.getElementById('modal-edit-list')).hide();
  showToast('Settings saved.', 'success');
  await loadLists();
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
