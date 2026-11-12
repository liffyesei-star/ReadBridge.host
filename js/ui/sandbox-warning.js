/**
 * ReadBridge — Production Environment Helper
 * Ensures legacy sandbox/prototype banners or modals are never rendered.
 */
export function clearLegacySandboxBanners() {
  const warningStyles = document.getElementById('rb-warning-styles');
  if (warningStyles) warningStyles.remove();
  document.querySelectorAll('.rb-warning-banner, .rb-warning-modal-overlay').forEach((el) => el.remove());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', clearLegacySandboxBanners);
} else {
  clearLegacySandboxBanners();
}
