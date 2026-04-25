import supabase from './supabase-client.js';

const AUTH_PAGE = '/auth';
const HOME_PAGE = '/lists';

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
  window.location.href = AUTH_PAGE;
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
    window.location.href = AUTH_PAGE;
    return null;
  }
  return user;
}

/**
 * Call at the top of auth.html.
 * Redirects to /home if the user is already signed in.
 */
export async function redirectIfAuthenticated() {
  const user = await getUser();
  if (user) window.location.href = HOME_PAGE;
}
