/**
 * tracker.js — lightweight page-view recorder.
 *
 * Import this module on any page you want to track:
 *   <script type="module" src="js/tracker.js"></script>
 *
 * Requires the page_views table in Supabase (see js/admin.js for SQL setup).
 * All errors are silently ignored so tracking never disrupts the user experience.
 */
import supabase from './supabase-client.js';

(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('page_views').insert({
      path:    window.location.pathname,
      user_id: user?.id ?? null,
    });
  } catch {
    // Silently ignore — tracking must never break pages
  }
})();
