import supabase from './supabase-client.js';
import { requireAuth, signOut } from './auth.js';

let currentUser = null;

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  currentUser = await requireAuth();
  if (!currentUser) return;

  const displayName = currentUser.user_metadata?.username || currentUser.email;
  document.getElementById('nav-user').textContent = displayName;

  document.getElementById('btn-logout').addEventListener('click', () => signOut());

  // Pre-fill form fields
  document.getElementById('input-username').value = currentUser.user_metadata?.username || '';
  document.getElementById('input-email').value    = currentUser.email || '';

  document.getElementById('form-profile').addEventListener('submit', updateProfile);
  document.getElementById('form-password').addEventListener('submit', updatePassword);
  document.getElementById('btn-delete').addEventListener('click', handleDeleteAccount);
}

// ── Profile ───────────────────────────────────────────────────────────────────

async function updateProfile(e) {
  e.preventDefault();
  clearErrors();

  const username = document.getElementById('input-username').value.trim();
  if (!username) {
    showFieldError('input-username', 'Username cannot be empty.');
    return;
  }

  const btn     = e.submitter;
  btn.disabled  = true;

  const { error } = await supabase.auth.updateUser({ data: { username } });

  btn.disabled = false;

  if (error) {
    showToast('Update failed: ' + error.message, 'danger');
  } else {
    document.getElementById('nav-user').textContent = username;
    showToast('Profile updated.', 'success');
  }
}

// ── Password ──────────────────────────────────────────────────────────────────

async function updatePassword(e) {
  e.preventDefault();
  clearErrors();

  const currentPw = document.getElementById('input-current-pw').value;
  const newPw     = document.getElementById('input-new-pw').value;
  const confirmPw = document.getElementById('input-confirm-pw').value;

  if (newPw.length < 8) {
    showFieldError('input-new-pw', 'Password must be at least 8 characters.');
    return;
  }
  if (newPw !== confirmPw) {
    showFieldError('input-confirm-pw', 'Passwords do not match.');
    return;
  }

  const btn    = e.submitter;
  btn.disabled = true;

  // Re-authenticate to verify the current password before allowing a change
  const { error: reAuthError } = await supabase.auth.signInWithPassword({
    email:    currentUser.email,
    password: currentPw,
  });

  if (reAuthError) {
    btn.disabled = false;
    showFieldError('input-current-pw', 'Current password is incorrect.');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPw });
  btn.disabled = false;

  if (error) {
    showToast('Password update failed: ' + error.message, 'danger');
  } else {
    e.target.reset();
    showToast('Password changed successfully.', 'success');
  }
}

// ── Delete account ────────────────────────────────────────────────────────────

async function handleDeleteAccount() {
  const confirmed = confirm(
    'Are you sure you want to delete your account?\n\n' +
    'All your army lists will be permanently deleted. This cannot be undone.'
  );
  if (!confirmed) return;

  const btn    = document.getElementById('btn-delete');
  btn.disabled = true;

  // Step 1: Delete all the user's army lists (permitted by RLS policy)
  const { error: listsError } = await supabase
    .from('army_lists')
    .delete()
    .eq('user_id', currentUser.id);

  if (listsError) {
    btn.disabled = false;
    showToast('Could not delete your data: ' + listsError.message, 'danger');
    return;
  }

  // Step 2: Sign the user out.
  //
  // NOTE: Full account deletion (removing the auth record) requires a
  // Supabase Edge Function with the service_role key because
  // auth.admin.deleteUser() cannot be called from the browser.
  // The user's data has been removed above. To add full deletion later:
  //   1. Create an Edge Function at supabase/functions/delete-account/index.ts
  //   2. Call supabase.functions.invoke('delete-account') here before signOut.
  //
  await supabase.auth.signOut();
  window.location.href = 'auth.html?deleted=1';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  input.classList.add('is-invalid');
  let fb = input.parentElement.querySelector('.invalid-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'invalid-feedback';
    input.parentElement.appendChild(fb);
  }
  fb.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const div       = document.createElement('div');
  div.className   = `toast align-items-center text-bg-${type} border-0`;
  div.setAttribute('role', 'alert');
  div.innerHTML   = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  container.appendChild(div);
  bootstrap.Toast.getOrCreateInstance(div).show();
  div.addEventListener('hidden.bs.toast', () => div.remove());
}

init();
