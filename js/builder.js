import supabase from './supabase-client.js';
import { requireAuth, signOut } from './auth.js';

const REGIMENTS_INDEX = 'data/regiments/index.json';

let currentUser  = null;
let listId       = null;
let listData     = null;   // { id, name, units: [...], size, cost }
let allRegiments = [];     // regiment objects loaded from JSON
let selectedUnit = null;   // unit object currently shown in detail panel
let saveTimeout  = null;

// ── Bootstrap ─────────────────────────────────────────────────────────────────

async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  const displayName = currentUser.user_metadata?.username || currentUser.email;
  document.getElementById('nav-user').textContent = displayName;

  document.getElementById('btn-logout').addEventListener('click', () => signOut());
  document.getElementById('btn-save').addEventListener('click', saveList);

  const params = new URLSearchParams(window.location.search);
  listId = params.get('id');

  if (!listId) {
    window.location.href = '/home';
    return;
  }

  // Load list data and regiment data in parallel
  await Promise.all([loadList(), loadRegiments()]);
  renderAll();
}

// ── Data loading ──────────────────────────────────────────────────────────────

async function loadList() {
  const { data, error } = await supabase
    .from('army_lists')
    .select('*')
    .eq('id', listId)
    .eq('user_id', currentUser.id)
    .single();

  if (error || !data) {
    alert('Army list not found or access denied.');
    window.location.href = '/home';
    return;
  }

  listData = data;
  if (!Array.isArray(listData.units)) listData.units = [];
  document.getElementById('list-name').textContent = data.name;
  document.title = data.name + ' — Builder';
}

async function loadRegiments() {
  try {
    const indexRes = await fetch(REGIMENTS_INDEX);
    if (!indexRes.ok) throw new Error('Regiment index not found');
    const { regiments } = await indexRes.json();

    const results = await Promise.all(
      (regiments || []).map(r =>
        fetch(`data/regiments/${r.file}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    );

    allRegiments = results.filter(Boolean);

    // Tag each unit with its regiment name for display purposes
    allRegiments.forEach(regiment => {
      regiment.units.forEach(unit => {
        unit._regiment = regiment.regiment;
      });
    });
  } catch (err) {
    console.warn('Could not load regiment data:', err.message);
    allRegiments = [];
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderAll() {
  renderSidebar();
  renderList();
  renderDetail();
  updateTotals();
}

function renderSidebar() {
  const container = document.getElementById('available-units');
  container.innerHTML = '';

  // Filter to only the regiments allowed for this list (if set)
  const allowedRegiments = listData?.allowed_regiments;
  const regimentsToShow = (allowedRegiments && allowedRegiments.length > 0)
    ? allRegiments.filter(r => allowedRegiments.includes(r.regiment))
    : allRegiments;

  if (regimentsToShow.length === 0) {
    container.innerHTML =
      '<p class="text-secondary small p-3">No regiment data found.<br>' +
      'Add JSON files to <code>data/regiments/</code> and list them in <code>index.json</code>.</p>';
    return;
  }

  regimentsToShow.forEach(regiment => {
    const header = document.createElement('div');
    header.className = 'px-3 pt-3 pb-1 text-uppercase fw-bold text-secondary';
    header.style.fontSize = '0.7rem';
    header.style.letterSpacing = '0.05em';
    header.textContent = regiment.regiment;
    container.appendChild(header);

    regiment.units.forEach(unit => {
      const card = document.createElement('div');
      card.className = 'unit-card border border-secondary rounded mx-2 mb-2 p-2';
      card.dataset.unitId = unit.id;
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-semibold" style="font-size:0.85rem">${escapeHtml(unit.name)}</span>
          <span class="badge bg-secondary">${unit.cost} pts</span>
        </div>
        <div class="text-secondary" style="font-size:0.75rem">${escapeHtml(unit.description || '')}</div>`;
      card.addEventListener('click', () => selectUnit(unit, card));
      container.appendChild(card);
    });
  });
}

function renderList() {
  const container = document.getElementById('current-units');
  const units     = listData?.units ?? [];

  if (units.length === 0) {
    container.innerHTML = `
      <div class="text-center text-secondary py-5">
        <i class="bi bi-shield display-5 d-block mb-3 opacity-25"></i>
        <p class="mb-0">No units added yet.</p>
        <p class="small">Select a unit from the left panel and click <strong>Add to List</strong>.</p>
      </div>`;
    return;
  }

  container.innerHTML = '';

  units.forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'card mb-2 bg-body-secondary border-secondary';
    card.innerHTML = `
      <div class="card-body py-2 px-3 d-flex align-items-center gap-3">
        <div class="flex-grow-1">
          <div class="fw-semibold">${escapeHtml(entry.name)}</div>
          <div class="text-secondary small">${escapeHtml(entry.regiment || '')}</div>
        </div>
        <div class="d-flex align-items-center gap-1 flex-shrink-0">
          <button class="btn btn-sm btn-outline-secondary btn-qty-dec px-2 py-0" data-index="${index}" title="Remove one">−</button>
          <span class="fw-semibold px-1">${entry.count}×</span>
          <button class="btn btn-sm btn-outline-secondary btn-qty-inc px-2 py-0" data-index="${index}" title="Add one">+</button>
          <span class="badge bg-secondary ms-2">${entry.count * entry.cost_per_unit} pts</span>
          <button class="btn btn-sm btn-outline-danger btn-remove ms-1 px-2 py-0" data-index="${index}" title="Remove unit">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>`;
    container.appendChild(card);
  });

  container.querySelectorAll('.btn-qty-inc').forEach(btn =>
    btn.addEventListener('click', () => changeQty(+btn.dataset.index, 1))
  );
  container.querySelectorAll('.btn-qty-dec').forEach(btn =>
    btn.addEventListener('click', () => changeQty(+btn.dataset.index, -1))
  );
  container.querySelectorAll('.btn-remove').forEach(btn =>
    btn.addEventListener('click', () => removeUnit(+btn.dataset.index))
  );
}

function renderDetail() {
  const panel = document.getElementById('unit-detail');

  if (!selectedUnit) {
    panel.innerHTML =
      '<p class="text-secondary small p-3">Click a unit on the left to see its details here.</p>';
    return;
  }

  const statsHtml = selectedUnit.stats
    ? Object.entries(selectedUnit.stats)
        .map(([k, v]) =>
          `<div class="stat-item"><span class="stat-label">${escapeHtml(k)}</span>${v}</div>`
        )
        .join('')
    : '';

  const keywordsHtml = selectedUnit.keywords?.length
    ? selectedUnit.keywords
        .map(kw => `<span class="badge bg-secondary me-1 mb-1">${escapeHtml(kw)}</span>`)
        .join('')
    : '';

  panel.innerHTML = `
    <div class="p-3">
      <h6 class="fw-bold mb-1">${escapeHtml(selectedUnit.name)}</h6>
      <p class="text-secondary small mb-2">${escapeHtml(selectedUnit.description || '')}</p>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="small text-secondary">Cost per unit</span>
        <span class="badge fs-6" style="background-color:var(--wg-accent)">${selectedUnit.cost} pts</span>
      </div>
      ${statsHtml ? `<div class="stat-grid mb-3">${statsHtml}</div>` : ''}
      ${keywordsHtml ? `<div class="mb-3">${keywordsHtml}</div>` : ''}
      <button class="btn btn-accent w-100" id="btn-add-unit">
        <i class="bi bi-plus-lg me-1"></i>Add to List
      </button>
    </div>`;

  document.getElementById('btn-add-unit')
    .addEventListener('click', () => addUnit(selectedUnit));
}

function updateTotals() {
  const units      = listData?.units ?? [];
  const sizeLimit  = listData?.size_limit ?? null;
  const totalUnits = units.reduce((s, e) => s + e.count, 0);
  const totalCost  = units.reduce((s, e) => s + e.count * e.cost_per_unit, 0);

  document.getElementById('total-units').textContent = totalUnits;

  const costEl    = document.getElementById('total-cost');
  const overLimit = sizeLimit !== null && totalCost > sizeLimit;
  costEl.textContent = sizeLimit !== null
    ? `${totalCost} / ${sizeLimit} pts`
    : `${totalCost} pts`;
  costEl.className = `fw-semibold ${overLimit ? 'text-danger' : 'text-body'}`;
}

// ── List mutations ────────────────────────────────────────────────────────────

function selectUnit(unit, cardEl) {
  document.querySelectorAll('.unit-card.selected').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedUnit = unit;
  renderDetail();
}

function addUnit(unit) {
  const units    = listData.units;
  const existing = units.find(e => e.unit_id === unit.id);

  if (existing) {
    existing.count += 1;
  } else {
    units.push({
      unit_id:       unit.id,
      name:          unit.name,
      regiment:      unit._regiment || '',
      cost_per_unit: unit.cost,
      count:         1,
    });
  }

  renderList();
  updateTotals();
  scheduleSave();
}

function changeQty(index, delta) {
  const entry = listData.units[index];
  if (!entry) return;
  entry.count = Math.max(1, entry.count + delta);
  renderList();
  updateTotals();
  scheduleSave();
}

function removeUnit(index) {
  listData.units.splice(index, 1);
  renderList();
  updateTotals();
  scheduleSave();
}

// ── Save ──────────────────────────────────────────────────────────────────────

function scheduleSave() {
  clearTimeout(saveTimeout);
  setSaveStatus('unsaved');
  saveTimeout = setTimeout(saveList, 2000);
}

async function saveList() {
  clearTimeout(saveTimeout);
  setSaveStatus('saving');

  const units = listData.units;
  const size  = units.reduce((s, e) => s + e.count, 0);
  const cost  = units.reduce((s, e) => s + e.count * e.cost_per_unit, 0);

  const { error } = await supabase
    .from('army_lists')
    .update({ units, size, cost, updated_at: new Date().toISOString() })
    .eq('id', listId);

  if (error) {
    setSaveStatus('error');
    showToast('Save failed: ' + error.message, 'danger');
  } else {
    listData.size = size;
    listData.cost = cost;
    setSaveStatus('saved');
  }
}

function setSaveStatus(status) {
  const el  = document.getElementById('save-status');
  const map = {
    saved:   ['text-success',   '✓ Saved'],
    saving:  ['text-secondary', 'Saving…'],
    unsaved: ['text-warning',   '● Unsaved changes'],
    error:   ['text-danger',    '✕ Save failed'],
  };
  const [cls, txt] = map[status] ?? map.saved;
  el.className  = `small ${cls}`;
  el.textContent = txt;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const div       = document.createElement('div');
  div.className   = `toast align-items-center text-bg-${type} border-0`;
  div.setAttribute('role', 'alert');
  div.innerHTML   = `
    <div class="d-flex">
      <div class="toast-body">${escapeHtml(message)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(div);
  bootstrap.Toast.getOrCreateInstance(div).show();
  div.addEventListener('hidden.bs.toast', () => div.remove());
}

init();
