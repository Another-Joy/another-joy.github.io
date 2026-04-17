import { getUser, signOut } from './auth.js';

const REGIMENTS_INDEX = '/data/regiments/index.json';

// ── Archetypes ─────────────────────────────────────────────────────────────────
// Edit this array to update the Archetypes section on the landing page.
// For each archetype, set `image` to a path like '/img/archetypes/aggro.png'.
// If image is null or the file doesn't exist, a placeholder box is shown instead.
const ARCHETYPES = [
  {
    icon: '🔫',
    name: 'Aggro',
    subtext: 'Hit fast, hit hard',
    description: 'Aggro regiments are built around overwhelming firepower and relentless forward pressure. They trade durability for raw damage output, closing the distance before the enemy can react.',
    image: null, // e.g. '/img/archetypes/aggro.png'
  },
  {
    icon: '👢',
    name: 'Blitz',
    subtext: 'Speed is the weapon',
    description: 'Blitz regiments sacrifice staying power for exceptional mobility. They strike where the enemy is weakest, then reposition before a counter-attack can land.',
    image: null,
  },
  {
    icon: '🛡️',
    name: 'Attrition',
    subtext: 'Every inch is paid for',
    description: 'Attrition regiments excel in prolonged engagements, wearing down opponents over time. High Health totals and defensive abilities keep them fighting long after others have collapsed.',
    image: null,
  },
  {
    icon: '🧱',
    name: 'Control',
    subtext: 'Shape the battlefield',
    description: 'Control regiments dictate the pace and space of every engagement. Through suppression, area denial and superior positioning, they ensure the enemy never fights on even terms.',
    image: null,
  },
  {
    icon: '🚫',
    name: 'Disruption',
    subtext: 'Deny. Disrupt. Dismantle.',
    description: 'Disruption regiments specialise in degrading enemy effectiveness before the main clash. Jamming Control, removing keywords and interfering with activations leave opponents unable to execute their plans.',
    image: null,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ── Tab-panel builder ──────────────────────────────────────────────────────────
// items: array of objects, each must have a `_tabLabel` string.
// renderPanel: function(item) that writes HTML into panelEl.
function buildTabPanel(tabsEl, panelEl, items, renderPanel) {
  tabsEl.innerHTML = '';
  items.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'lp-tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = item._tabLabel;
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.lp-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPanel(panelEl, item);
    });
    tabsEl.appendChild(btn);
  });
  if (items.length) renderPanel(panelEl, items[0]);
}

function renderArchetypePanel(panelEl, item) {
  const imgHtml = item.image
    ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="lp-archetype-img">`
    : `<div class="lp-archetype-img-placeholder">No image set</div>`;

  panelEl.innerHTML = `
    <div class="d-flex align-items-start gap-4 flex-wrap">
      ${imgHtml}
      <div>
        <div class="lp-panel-icon">${item.icon}</div>
        <div class="lp-panel-title">${escapeHtml(item.name)}</div>
        <div class="lp-panel-subtext">${escapeHtml(item.subtext)}</div>
        <div class="lp-panel-desc">${escapeHtml(item.description)}</div>
      </div>
    </div>`;
}

function renderRegimentPanel(panelEl, item) {
  const units = item.units ?? [];
  const tagCounts = {};
  units.forEach(u => (u.tags ?? []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const tagBadges = Object.entries(tagCounts)
    .map(([t, n]) => `<span class="badge bg-secondary me-1">${escapeHtml(t)} ×${n}</span>`)
    .join('');

  const subtext     = item.subtext ?? `${units.length} unit${units.length !== 1 ? 's' : ''}`;
  const description = item.description ?? '';

  panelEl.innerHTML = `
    <div class="lp-panel-title">${escapeHtml(item.regiment)}</div>
    <div class="lp-panel-subtext">${escapeHtml(subtext)}</div>
    ${description ? `<div class="lp-panel-desc mb-3">${escapeHtml(description)}</div>` : ''}
    <div class="mt-2">${tagBadges}</div>`;
}

// ── Init ───────────────────────────────────────────────────────────────────────
async function init() {
  // Auth area (non-blocking)
  const user = await getUser();
  const authArea = document.getElementById('nav-auth-area');
  if (user) {
    const name = user.user_metadata?.username || user.email;
    authArea.innerHTML = `
      <span class="text-secondary small">${escapeHtml(name)}</span>
      <button class="btn btn-sm btn-outline-secondary" id="btn-logout">Sign Out</button>`;
    document.getElementById('btn-logout').addEventListener('click', () => signOut());
  } else {
    authArea.innerHTML = `<a href="/auth" class="btn btn-sm btn-accent">Sign In</a>`;
  }

  // Archetypes
  const archetypeItems = ARCHETYPES.map(a => ({ ...a, _tabLabel: `${a.icon} ${a.name}` }));
  buildTabPanel(
    document.getElementById('archetype-tabs'),
    document.getElementById('archetype-panel'),
    archetypeItems,
    renderArchetypePanel
  );

  // Regiments
  try {
    const res = await fetch(REGIMENTS_INDEX);
    if (!res.ok) throw new Error();
    const { regiments } = await res.json();

    const details = await Promise.all(
      (regiments || []).map(r =>
        fetch(`/data/regiments/${r.file}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    );

    const valid = details.filter(Boolean);
    document.getElementById('regiments-loading').classList.add('d-none');
    const content = document.getElementById('regiments-content');
    content.classList.remove('d-none');

    if (!valid.length) {
      content.innerHTML = '<p class="text-secondary small">No regiments available yet.</p>';
      return;
    }

    const regimentItems = valid.map(d => ({ ...d, _tabLabel: d.regiment }));
    buildTabPanel(
      document.getElementById('regiment-tabs'),
      document.getElementById('regiment-panel'),
      regimentItems,
      renderRegimentPanel
    );
  } catch {
    document.getElementById('regiments-loading').textContent = 'Could not load regiments.';
  }
}

init();

