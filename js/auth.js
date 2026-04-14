import supabase from './supabase-client.js';

// Users interact with a username + password only.
// Supabase requires an email internally, so we derive a fake one from the
// username using a local domain that never receives mail.
// NOTE: password reset via email is not available with this approach.
const EMAIL_DOMAIN = 'army-builder.local';

const AUTH_PAGE = '/auth';
const HOME_PAGE = '/home';

function usernameToEmail(username) {
  return `${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}@${EMAIL_DOMAIN}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function signUp(username, password) {
  const email = usernameToEmail(username);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(username, password) {
  const email = usernameToEmail(username);
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
