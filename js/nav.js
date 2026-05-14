import { getUser, signOut } from './auth.js';

// ── Site-wide navigation ───────────────────────────────────────────────────────
// The four permanent top-bar tabs. Order here is the rendered order.
const NAV_LINKS = [
  { id: 'home',    label: 'Home',    href: '/'        },
  { id: 'lists',   label: 'Lists',   href: '/lists'   },
  { id: 'rules',   label: 'Rules',   href: '/rules'  },
  { id: 'account', label: 'Account', href: '/account' },
];

function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

/**
 * Inject the shared site navbar as the first element of <body>.
 *
 * @param {'home'|'lists'|'rules'|'account'} activePage
 *   The id of the currently active tab. Pass null for pages with no active tab.
 */
export async function initNav(activePage) {
  const linkItems = NAV_LINKS.map(p => {
    const isActive = p.id === activePage;
    return `<li class="nav-item">
        <a class="nav-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}
           href="${p.href}">${escapeHtml(p.label)}</a>
      </li>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.id = 'site-navbar';
  nav.className = 'navbar navbar-expand-lg bg-body-secondary border-bottom sticky-top';
  nav.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand" href="/">Lead Ledger</a>
      <button class="navbar-toggler" type="button"
        data-bs-toggle="collapse" data-bs-target="#navMenu"
        aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto">
          ${linkItems}
        </ul>
        <div class="d-flex align-items-center gap-2" id="nav-auth-area">
          <!-- populated below -->
        </div>
      </div>
    </div>`;

  document.body.insertBefore(nav, document.body.firstChild);

  // Populate auth area (non-blocking — page still works if this is slow)
  try {
    const user = await getUser();
    const authArea = document.getElementById('nav-auth-area');
    if (!authArea) return;
    if (user) {
      const name = user.user_metadata?.username || user.email;
      authArea.innerHTML = `
        <span class="text-secondary small">${escapeHtml(name)}</span>
        <button class="btn btn-sm btn-outline-secondary" id="btn-logout">Sign Out</button>`;
      document.getElementById('btn-logout').addEventListener('click', () => signOut());
    } else {
      authArea.innerHTML = `<a href="/auth" class="btn btn-sm btn-accent">Sign In</a>`;
    }
  } catch {
    // Non-critical — silently skip
  }
}
