import supabase from './supabase-client.js';

// On Live Server (localhost) there is no URL rewriting, so we need the .html
// extension. On the real site (GitHub Pages / custom domain) clean URLs work.
const IS_LOCAL  = ['localhost', '127.0.0.1'].includes(location.hostname);
const ext       = IS_LOCAL ? '.html' : '';

const AUTH_PAGE = '/auth'  + ext;
const HOME_PAGE = '/lists' + ext;

/**
 * Navigate to a path, automatically appending .html on localhost.
 * Use this instead of setting window.location.href directly.
 *   navigate('/lists')           → /lists  (prod) or /lists.html  (local)
 *   navigate('/auth?deleted=1')  → /auth?deleted=1  or /auth.html?deleted=1
 *   navigate('/builder?id=abc')  → /builder?id=abc  or /builder.html?id=abc
 */
export function navigate(path) {
  if (!IS_LOCAL) { window.location.href = path; return; }
  // Insert .html before any ? or # if there's no extension already
  window.location.href = path.replace(/^([^?#]+?)(\.html)?([?#]|$)/, (_, p, _ext, rest) => p + '.html' + rest);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function signUp(username, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
  navigate(AUTH_PAGE);
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

// ── Auth Guards ───────────────────────────────────────────────────────────────

/**
 * Call at the top of every protected page.
 * Redirects to /auth if the user is not signed in.
 * Returns the user object if authenticated.
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    const next = encodeURIComponent(window.location.pathname);
    navigate(AUTH_PAGE + '?next=' + next);
    return null;
  }
  return user;
}

/**
 * Call at the top of auth.html.
 * Redirects to /lists (or ?next path) if the user is already signed in.
 */
export async function redirectIfAuthenticated() {
  const user = await getUser();
  if (user) {
    const next = new URLSearchParams(window.location.search).get('next');
    navigate(next || HOME_PAGE);
  }
}
