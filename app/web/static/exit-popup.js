/**
 * Exit-intent popup: trigger on mouse leave (close page) or after 45s.
 * One email field, submit to newsletter. Never show again after signup (localStorage).
 */
(function () {
  var STORAGE_KEY = 'newsletter_popup_signed_up';
  var SESSION_KEY = 'newsletter_popup_shown';
  var DELAY_MS = 45000; // 45s

  var popup = document.getElementById('exit-popup');
  var form = document.getElementById('exit-popup-form');
  var emailInput = document.getElementById('exit-popup-email');
  var successEl = document.getElementById('exit-popup-success');
  var closeBtn = popup && popup.querySelector('.exit-popup-close');
  var backdrop = popup && popup.querySelector('.exit-popup-backdrop');

  function shouldShow() {
    if (!popup) return false;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return false;
      if (sessionStorage.getItem(SESSION_KEY)) return false;
    } catch (e) { /* no storage */ }
    return true;
  }

  function show() {
    if (!shouldShow()) return;
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    popup.hidden = false;
    popup.removeAttribute('aria-hidden');
    emailInput.focus();
  }

  function hide() {
    if (!popup) return;
    popup.hidden = true;
    popup.setAttribute('aria-hidden', 'true');
  }

  function neverShowAgain() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  function onExitIntent(e) {
    if (!shouldShow()) return;
    if (e.clientY <= 5 && e.relatedTarget === null) show();
  }

  function setupClose() {
    if (closeBtn) closeBtn.addEventListener('click', hide);
    if (backdrop) backdrop.addEventListener('click', hide);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup && !popup.hidden) hide();
    });
  }

  function setupForm() {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (emailInput.value || '').trim();
      if (!email) return;

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          source: 'popup',
          preferences: { weekly_report: true, price_alerts: true, big_price_drops: true }
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.status === 'subscribed' || data.status === 'already_subscribed') {
            neverShowAgain();
            form.hidden = true;
            if (successEl) successEl.hidden = false;
            setTimeout(hide, 2000);
          } else {
            if (btn) { btn.disabled = false; btn.textContent = 'Send me weekly savings'; }
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Send me weekly savings'; }
        });
    });
  }

  function init() {
    if (!popup) return;
    setupClose();
    setupForm();

    document.addEventListener('mouseout', function (e) {
      if (e.clientY <= 5 && !e.relatedTarget) onExitIntent(e);
    });

    setTimeout(function () {
      if (shouldShow()) show();
    }, DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
