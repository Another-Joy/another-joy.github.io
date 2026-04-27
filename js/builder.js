import supabase from './supabase-client.js';
import { requireAuth, signOut, navigate } from './auth.js';
import { MAIN_TAGS, KEYWORDS, TAG_DESCRIPTIONS, BASE_COMMANDS } from './config.js';
import { openPdfPreview } from './pdf-export.js';

const REGIMENTS_INDEX = 'data/regiments/index.json';

let currentUser  = null;
let listId       = null;
let listData     = null;   // { id, name, units: [...], size, mp_cost, mats_cost, mp_limit, mats_limit }
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
  document.getElementById('btn-export-pdf').addEventListener('click', () => openPdfPreview(listId));

  const params = new URLSearchParams(window.location.search);
  listId = params.get('id');

  if (!listId) {
    navigate('/lists');
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
    navigate('/lists');
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

    // Tag each unit with its regiment and main tag for grouping
    allRegiments.forEach(regiment => {
      regiment.units.forEach(unit => {
        unit._regiment = regiment.regiment;
        unit._main_tag = MAIN_TAGS.find(t => unit.tags?.includes(t)) ?? MAIN_TAGS[0];
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
    // Regiment header
    const regHeader = document.createElement('div');
    regHeader.className = 'px-3 pt-3 pb-1 fw-bold text-secondary border-bottom mb-1';
    regHeader.style.cssText = 'font-size:0.7rem;text-transform:uppercase;letter-spacing:0.05em';
    regHeader.textContent = regiment.regiment;
    container.appendChild(regHeader);

    // Group units by main tag
    const byTag = {};
    MAIN_TAGS.forEach(t => { byTag[t] = []; });
    regiment.units.forEach(unit => {
      const t = unit._main_tag ?? MAIN_TAGS[0];
      byTag[t].push(unit);
    });

    MAIN_TAGS.forEach(tag => {
      const tagUnits = byTag[tag];
      if (!tagUnits || tagUnits.length === 0) return;

      // Tag sub-header
      const tagHeader = document.createElement('div');
      tagHeader.className = 'px-3 pt-2 text-secondary';
      tagHeader.style.cssText = 'font-size:0.65rem;text-transform:uppercase;letter-spacing:0.05em;opacity:0.6';
      tagHeader.textContent = tag;
      container.appendChild(tagHeader);

      tagUnits.forEach(unit => {
        const card = document.createElement('div');
        card.className = 'unit-card border border-secondary rounded mx-2 mb-1 p-2';
        card.dataset.unitId = unit.id;
        card.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-semibold" style="font-size:0.85rem">${escapeHtml(unit.name)}</span>
            <span class="text-secondary" style="font-size:0.75rem">${unit.cost?.mp ?? 0} MP / ${unit.cost?.mats ?? 0} Mats</span>
          </div>`;
        card.addEventListener('click', () => selectUnit(unit, card));
        container.appendChild(card);
      });
    });
  });
}

function makeCollapsibleSection(label, startCollapsed = false) {
  const header = document.createElement('div');
  header.className = 'list-section-header';
  header.innerHTML = `<span>${escapeHtml(label)}</span><i class="bi bi-chevron-down collapse-arrow${startCollapsed ? ' collapsed' : ''}"></i>`;

  const body = document.createElement('div');
  if (startCollapsed) body.classList.add('d-none');

  header.addEventListener('click', () => {
    const isNowHidden = body.classList.toggle('d-none');
    header.querySelector('.collapse-arrow').classList.toggle('collapsed', isNowHidden);
  });

  return { header, body };
}

function renderList() {
  const container = document.getElementById('current-units');
  const units     = listData?.units ?? [];

  container.innerHTML = '';

  // ── Allowed regiments for this list ──────────────────────────────────────
  const allowedRegs = listData?.allowed_regiments;
  const activeRegiments = (allowedRegs && allowedRegs.length > 0)
    ? allRegiments.filter(r => allowedRegs.includes(r.regiment))
    : allRegiments;

  // ── Commands slot (single section, grouped by source) ────────────────────
  const regimentCommands = activeRegiments
    .filter(r => Array.isArray(r.commands) && r.commands.length > 0)
    .map(r => ({ regiment: r.regiment, commands: r.commands }));

  const hasAnyCommands = BASE_COMMANDS.length > 0 || regimentCommands.length > 0;

  if (hasAnyCommands) {
    const { header, body } = makeCollapsibleSection('Commands', true);

    const commandsCard = document.createElement('div');
    commandsCard.className = 'card bg-body-secondary border-secondary mb-2';
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body p-0';

    // Base commands
    if (BASE_COMMANDS.length > 0) {
      const subHdr = document.createElement('div');
      subHdr.className = 'command-group-header';
      subHdr.textContent = 'Base';
      cardBody.appendChild(subHdr);
      BASE_COMMANDS.forEach(cmd => {
        const row = makeCommandRow({ ...cmd, _source: 'Base', _type: 'command' });
        cardBody.appendChild(row);
      });
    }

    // Regiment commands
    regimentCommands.forEach(({ regiment, commands }) => {
      const subHdr = document.createElement('div');
      subHdr.className = 'command-group-header';
      subHdr.textContent = regiment;
      cardBody.appendChild(subHdr);
      commands.forEach(cmd => {
        const row = makeCommandRow({ ...cmd, _source: regiment, _type: 'command' });
        cardBody.appendChild(row);
      });
    });

    commandsCard.appendChild(cardBody);
    body.appendChild(commandsCard);
    container.appendChild(header);
    container.appendChild(body);
  }

  // ── Rules & Schemes (auto-included from allowed regiments) ────────────────
  const rules   = activeRegiments.filter(r => r.rule)
    .map(r => ({ ...r.rule,   regiment: r.regiment, _type: 'rule' }));
  const schemes = activeRegiments.filter(r => r.scheme)
    .map(r => ({ ...r.scheme, regiment: r.regiment, _type: 'scheme' }));

  if (rules.length > 0) {
    const { header, body } = makeCollapsibleSection('Rules', true);

    rules.forEach(rule => {
      const card = document.createElement('div');
      card.className = 'card mb-2 bg-body-secondary border-secondary rule-scheme-card';
      card.innerHTML = `
        <div class="card-body py-2 px-3">
          <div class="fw-semibold" style="font-size:0.9rem">${escapeHtml(rule.name)}</div>
          <div class="text-secondary small">${escapeHtml(rule.regiment)} · ${escapeHtml(rule.type || '')}</div>
        </div>`;
      card.addEventListener('click', () => selectRuleOrScheme(rule, card));
      body.appendChild(card);
    });

    container.appendChild(header);
    container.appendChild(body);
  }

  if (schemes.length > 0) {
    const { header, body } = makeCollapsibleSection('Schemes', true);

    schemes.forEach(scheme => {
      const card = document.createElement('div');
      card.className = 'card mb-2 bg-body-secondary border-secondary rule-scheme-card';
      card.innerHTML = `
        <div class="card-body py-2 px-3">
          <div class="fw-semibold" style="font-size:0.9rem">${escapeHtml(scheme.name)}</div>
          <div class="text-secondary small">${escapeHtml(scheme.regiment)} · ${escapeHtml(scheme.timing || '')}</div>
        </div>`;
      card.addEventListener('click', () => selectRuleOrScheme(scheme, card));
      body.appendChild(card);
    });

    container.appendChild(header);
    container.appendChild(body);
  }

  // ── Created / Token units ─────────────────────────────────────────────────
  const tokens = activeRegiments
    .filter(r => Array.isArray(r.tokens) && r.tokens.length > 0)
    .flatMap(r => r.tokens.map(t => ({ ...t, _regiment: r.regiment, _type: 'token' })));

  if (tokens.length > 0) {
    const { header, body } = makeCollapsibleSection('Created', true);

    tokens.forEach(token => {
      const card = document.createElement('div');
      card.className = 'card mb-2 bg-body-secondary border-secondary rule-scheme-card';
      card.innerHTML = `
        <div class="card-body py-2 px-3">
          <div class="fw-semibold" style="font-size:0.9rem">${escapeHtml(token.name)}</div>
          <div class="text-secondary small">${escapeHtml(token._regiment)} · Created</div>
        </div>`;
      card.addEventListener('click', () => selectRuleOrScheme(token, card));
      body.appendChild(card);
    });

    container.appendChild(header);
    container.appendChild(body);
  }

  // ── Units ─────────────────────────────────────────────────────────────────
  if (units.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center text-secondary py-5';
    empty.innerHTML = `
      <i class="bi bi-shield display-5 d-block mb-3 opacity-25"></i>
      <p class="mb-0">No units added yet.</p>
      <p class="small">Select a unit from the left panel and click <strong>Add to List</strong>.</p>`;
    container.appendChild(empty);
    return;
  }

  // Group by main tag, preserving original indexes for qty/remove buttons
  const byTag = {};
  MAIN_TAGS.forEach(t => { byTag[t] = []; });
  units.forEach((entry, index) => {
    const tag = entry.main_tag ?? MAIN_TAGS[0];
    if (!byTag[tag]) byTag[tag] = [];
    byTag[tag].push({ entry, index });
  });

  MAIN_TAGS.forEach(tag => {
    const group = byTag[tag];
    if (!group || group.length === 0) return;

    // Sort within group: regiment name, then unit name
    group.sort((a, b) => {
      const regCmp = (a.entry.regiment || '').localeCompare(b.entry.regiment || '');
      return regCmp !== 0 ? regCmp : a.entry.name.localeCompare(b.entry.name);
    });

    const { header, body } = makeCollapsibleSection(tag, false);

    group.forEach(({ entry, index }) => {
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
            <span class="ms-2 text-secondary small">${entry.count * (entry.mp_per_unit ?? 0)} MP / ${entry.count * (entry.mats_per_unit ?? 0)} Mats</span>
            <button class="btn btn-sm btn-outline-danger btn-remove ms-1 px-2 py-0" data-index="${index}" title="Remove unit">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>`;
      body.appendChild(card);
    });

    container.appendChild(header);
    container.appendChild(body);
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

  // ── Rule / Scheme display ──────────────────────────────────────────────────
  if (selectedUnit._type === 'rule' || selectedUnit._type === 'scheme') {
    const item     = selectedUnit;
    const isScheme = item._type === 'scheme';
    const metaLabel = isScheme ? 'Timing' : 'Type';
    const metaValue = isScheme ? (item.timing || '—') : (item.type || '—');
    panel.innerHTML = `
      <div class="p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="fw-bold mb-0">${escapeHtml(item.name)}</h6>
          <span class="badge bg-secondary">${isScheme ? 'Scheme' : 'Rule'}</span>
        </div>
        <div class="text-secondary small mb-3">${escapeHtml(item.regiment)}</div>
        <div class="mb-2">
          <span class="fw-semibold small">${metaLabel}:</span>
          <span class="text-secondary small ms-1">${escapeHtml(metaValue)}</span>
        </div>
        <p class="detail-desc small mb-0" style="line-height:1.6">${escapeHtml(item.description || '')}</p>
      </div>`;
    return;
  }

  // ── Command display ────────────────────────────────────────────────────────
  if (selectedUnit._type === 'command') {
    const cmd = selectedUnit;
    const sourceLabel = cmd._source === 'Base' ? 'Base Command' : `${escapeHtml(cmd._source || '')} Command`;
    panel.innerHTML = `
      <div class="p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="fw-bold mb-0">${escapeHtml(cmd.name)}</h6>
          <span class="badge bg-accent">${escapeHtml(cmd.cost || '')}</span>
        </div>
        <div class="text-secondary small mb-3">${sourceLabel}</div>
        <table class="table table-sm table-dark table-bordered mb-0 command-detail-table">
          <tbody>
            <tr><th style="width:5rem">When</th><td>${escapeHtml(cmd.when || '—')}</td></tr>
            <tr><th>Targets</th><td>${escapeHtml(cmd.targets || '—')}</td></tr>
            <tr><th>Effects</th><td style="white-space:pre-line">${escapeHtml(cmd.effects || '—')}</td></tr>
          </tbody>
        </table>
      </div>`;
    return;
  }

  // ── Unit display ───────────────────────────────────────────────────────────
  const u = selectedUnit;

  // Tags
  const tagsHtml = u.tags?.length
    ? `<div class="mb-3">${u.tags.map(t => `<span class="badge bg-secondary me-1 mb-1">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  // MACH stat block — layout depends on unit type
  const mach = u.mach ?? {};
  const isFort    = u.tags?.includes('Fortification');
  const isSupport = u.tags?.includes('Support');
  let machHtml = '';
  if (isSupport) {
    // Support units have no MACH block
    machHtml = '';
  } else if (isFort) {
    // Fortifications only show HP
    machHtml = `
      <div class="mach-row mb-3">
        <div class="mach-cell"><div class="mach-label">HP</div><div class="mach-value">${mach.health ?? '—'}</div></div>
      </div>`;
  } else {
    machHtml = `
      <div class="mach-row mb-3">
        <div class="mach-cell"><div class="mach-label">MOV</div><div class="mach-value">${mach.movement ?? '—'}</div></div>
        <div class="mach-cell"><div class="mach-label">ARM</div><div class="mach-value">${mach.armor ?? '—'}</div></div>
        <div class="mach-cell"><div class="mach-label">CON</div><div class="mach-value">${mach.control ?? '—'}</div></div>
        <div class="mach-cell"><div class="mach-label">HP</div><div class="mach-value">${mach.health ?? '—'}</div></div>
      </div>`;
  }

  // Weapons table
  let weaponsHtml = '';
  if (u.weapons?.length) {
    const rows = u.weapons.map(w => {
      const pen = w.penetration ?? {};
      const kws = w.keywords?.length
        ? w.keywords.map(k => `<span class="badge bg-secondary me-1">${escapeHtml(k)}</span>`).join('')
        : '<span class="text-secondary">—</span>';
      return `<tr>
        <td>${escapeHtml(w.name)}</td>
        <td class="text-center">${w.range}</td>
        <td class="text-center">${pen.N ?? 'NA'}</td>
        <td class="text-center">${pen.L ?? 'NA'}</td>
        <td class="text-center">${pen.M ?? 'NA'}</td>
        <td class="text-center">${pen.H ?? 'NA'}</td>
        <td class="text-center">${w.fortification_damage ?? 'NA'}</td>
        <td>${kws}</td>
      </tr>`;
    }).join('');
    weaponsHtml = `
      <div class="section-label mb-1">Weapons</div>
      <div class="table-responsive mb-3">
        <table class="table table-sm table-dark table-bordered mb-0 weapons-table">
          <thead><tr><th>Name</th><th>Rng</th><th>N</th><th>L</th><th>M</th><th>H</th><th>Fort</th><th>Keywords</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  // Abilities
  let abilitiesHtml = '';
  if (u.abilities?.length) {
    const items = u.abilities.map(a =>
      `<div class="mb-1"><span class="fw-semibold small">${escapeHtml(a.name)}:</span> <span class="detail-desc small">${escapeHtml(a.description)}</span></div>`
    ).join('');
    abilitiesHtml = `<div class="section-label mb-1">Abilities</div><div class="mb-3">${items}</div>`;
  }

  // Keyword glossary — collect unique keywords from all weapons
  // Supports parameterised keywords like "Loading 3" by stripping the trailing number.
  function getKeywordDesc(kw) {
    if (KEYWORDS[kw] !== undefined) return KEYWORDS[kw];
    const base = kw.replace(/\s+\d+$/, '');
    return base !== kw ? KEYWORDS[base] : undefined;
  }

  const allKeywords = [...new Set((u.weapons ?? []).flatMap(w => w.keywords ?? []))];
  const kwGlossaryItems = allKeywords
    .map(kw => {
      const desc = getKeywordDesc(kw);
      return desc
        ? `<div class="mb-1"><span class="fw-semibold small">${escapeHtml(kw)}</span><span class="detail-desc small"> — ${escapeHtml(desc)}</span></div>`
        : null;
    })
    .filter(Boolean);

  // Tag descriptions — only tags that have an entry in TAG_DESCRIPTIONS
  const tagGlossaryItems = (u.tags ?? [])
    .filter(t => TAG_DESCRIPTIONS[t])
    .map(t => `<div class="mb-1"><span class="fw-semibold small">${escapeHtml(t)}</span><span class="detail-desc small"> — ${escapeHtml(TAG_DESCRIPTIONS[t])}</span></div>`);

  const allGlossaryItems = [...tagGlossaryItems, ...kwGlossaryItems].join('');
  const keywordGlossaryHtml = allGlossaryItems
    ? `<div class="border-top pt-2 mt-1"><div class="section-label mb-1">Keywords</div>${allGlossaryItems}</div>`
    : '';

  panel.innerHTML = `
    <div class="p-3">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="fw-bold mb-0">${escapeHtml(u.name)}</h6>
        <span class="badge bg-accent">${u.cost?.mp ?? 0} MP / ${u.cost?.mats ?? 0} Mats</span>
      </div>
      ${tagsHtml}
      ${machHtml}
      ${weaponsHtml}
      ${abilitiesHtml}
      ${keywordGlossaryHtml}
      ${u._type === 'token' ? '<div class="text-center text-secondary small mt-2"><i class="bi bi-info-circle me-1"></i>Created unit — not added to list costs</div>' : '<button class="btn btn-accent w-100 mt-2" id="btn-add-unit"><i class="bi bi-plus-lg me-1"></i>Add to List</button>'}
    </div>`;

  if (u._type !== 'token') {
    document.getElementById('btn-add-unit').addEventListener('click', () => addUnit(u));
  }
}

function updateTotals() {
  const units     = listData?.units ?? [];
  const mpLimit   = listData?.mp_limit ?? null;
  const matsLimit = listData?.mats_limit ?? null;
  const totalUnits = units.reduce((s, e) => s + e.count, 0);
  const totalMp    = units.reduce((s, e) => s + e.count * (e.mp_per_unit ?? 0), 0);
  const totalMats  = units.reduce((s, e) => s + e.count * (e.mats_per_unit ?? 0), 0);

  document.getElementById('total-units').textContent = totalUnits;

  const mpEl   = document.getElementById('total-mp');
  const matsEl = document.getElementById('total-mats');

  const overMp   = mpLimit !== null && totalMp > mpLimit;
  const overMats = matsLimit !== null && totalMats > matsLimit;

  mpEl.textContent = mpLimit !== null ? `${totalMp} / ${mpLimit}` : String(totalMp);
  mpEl.className   = `fw-semibold ${overMp ? 'text-danger' : 'text-body'}`;

  matsEl.textContent = matsLimit !== null ? `${totalMats} / ${matsLimit}` : String(totalMats);
  matsEl.className   = `fw-semibold ${overMats ? 'text-danger' : 'text-body'}`;
}

// ── List mutations ────────────────────────────────────────────────────────────

function makeCommandRow(cmd) {
  const row = document.createElement('div');
  row.className = 'command-row';
  row.innerHTML = `
    <span class="command-row-name">${escapeHtml(cmd.name)}</span>
    <span class="badge bg-secondary command-row-cost">${escapeHtml(cmd.cost || '')}</span>`;
  row.addEventListener('click', () => selectCommand(cmd, row));
  return row;
}

function selectUnit(unit, cardEl) {
  document.querySelectorAll('.unit-card.selected, .rule-scheme-card.selected, .command-row.selected').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedUnit = unit;
  renderDetail();
}

function selectRuleOrScheme(item, cardEl) {
  document.querySelectorAll('.unit-card.selected, .rule-scheme-card.selected, .command-row.selected').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
  selectedUnit = item;
  renderDetail();
}

function selectCommand(cmd, rowEl) {
  document.querySelectorAll('.unit-card.selected, .rule-scheme-card.selected, .command-row.selected').forEach(c => c.classList.remove('selected'));
  rowEl.classList.add('selected');
  selectedUnit = cmd;
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
      main_tag:      unit._main_tag || MAIN_TAGS[0],
      mp_per_unit:   unit.cost?.mp ?? 0,
      mats_per_unit: unit.cost?.mats ?? 0,
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

  const units     = listData.units;
  const size      = units.reduce((s, e) => s + e.count, 0);
  const mp_cost   = units.reduce((s, e) => s + e.count * (e.mp_per_unit ?? 0), 0);
  const mats_cost = units.reduce((s, e) => s + e.count * (e.mats_per_unit ?? 0), 0);

  const { error } = await supabase
    .from('army_lists')
    .update({ units, size, mp_cost, mats_cost, updated_at: new Date().toISOString() })
    .eq('id', listId);

  if (error) {
    setSaveStatus('error');
    showToast('Save failed: ' + error.message, 'danger');
  } else {
    listData.size      = size;
    listData.mp_cost   = mp_cost;
    listData.mats_cost = mats_cost;
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
