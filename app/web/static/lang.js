/**
 * Language switch: LV | EN in header.
 * - Switch is done via direct links (/lv/..., /en/...) so no JS needed for navigation.
 * - On load: sync localStorage from URL path so other scripts can read current lang.
 */
(function() {
    var VALID_LANGS = ['lv', 'en'];

    function getLangFromPath() {
        var path = window.location.pathname || '';
        if (path.indexOf('/lv/') === 0 || path === '/lv') return 'lv';
        if (path.indexOf('/en/') === 0 || path === '/en') return 'en';
        return null;
    }

    function init() {
        var lang = getLangFromPath();
        if (lang) {
            try {
                localStorage.setItem('lang', lang);
            } catch (e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
