import { RULES } from '../rules/rules-data.js';
import { initNav } from './nav.js';

// ── Helpers ────────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// ── Sidebar: one link per section ─────────────────────────────────────────────
function buildSidebar(sidenav) {
  const sections = RULES.filter(r => r.type === 'section');
  sidenav.innerHTML = sections.map(s =>
    `<a href="#s-${s.id}" class="rules-nav-link">${escapeHtml(s.id + '. ' + s.title)}</a>`
  ).join('');
}

// ── Main content ───────────────────────────────────────────────────────────────
function buildContent(main) {
  const html = RULES.map(r => {
    switch (r.type) {
      case 'section':
        return `<h2 class="rules-section" id="s-${r.id}">${escapeHtml(r.id + '. ' + r.title)}</h2>`;

      case 'subsection':
        return `<h3 class="rules-subsection" id="s-${r.id}">${escapeHtml(r.id + '. ' + r.title)}</h3>`;

      case 'rule':
        return `<p class="rules-rule" id="r-${r.id}"><span class="rules-id">${escapeHtml(r.id)}</span>${escapeHtml(r.text)}</p>`;

      case 'subrule':
        return `<p class="rules-subrule" id="r-${r.id}"><span class="rules-id">${escapeHtml(r.id)}</span>${escapeHtml(r.text)}</p>`;

      default:
        return '';
    }
  }).join('\n');
  main.innerHTML = html;
}

// ── Scroll spy: highlight active section in sidebar ───────────────────────────
function initScrollSpy(sidenav) {
  const headings = document.querySelectorAll('h2.rules-section');
  if (!headings.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        sidenav.querySelectorAll('.rules-nav-link').forEach(l => l.classList.remove('active'));
        const active = sidenav.querySelector(`a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

// ── Init ───────────────────────────────────────────────────────────────────────
initNav('rules');

const sidenav = document.getElementById('rules-nav');
const main    = document.getElementById('rules-main');

buildSidebar(sidenav);
buildContent(main);
initScrollSpy(sidenav);
