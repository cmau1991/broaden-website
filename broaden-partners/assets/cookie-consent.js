/* Broaden Management Partners — cookie consent banner.
   Loaded on every public page. Stores the visitor's choice in localStorage
   (strictly necessary) and re-asks after 12 months.
   Future non-essential scripts should check BroadenConsent.get().nonEssential
   or listen for the "broaden:consent" event before loading. */
(function () {
  var KEY = 'bmp_cookie_consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && typeof v.nonEssential === 'boolean' && Date.now() - v.ts < MAX_AGE) return v;
    } catch (e) {}
    return null;
  }

  function save(nonEssential) {
    var v = { nonEssential: nonEssential, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    document.dispatchEvent(new CustomEvent('broaden:consent', { detail: v }));
    return v;
  }

  var css = '' +
    '.cookie-banner{position:fixed;left:5vw;bottom:24px;z-index:2000;max-width:620px;' +
    'background:var(--forest-deep);border:1px solid var(--panel-line);border-radius:8px;' +
    'box-shadow:var(--shadow);padding:24px 26px;color:var(--cream-dim);font-family:var(--sans);}' +
    '.cookie-banner[hidden]{display:none;}' +
    '.cookie-banner h2{font-family:var(--mono);color:var(--leaf);font-size:12px;font-weight:700;' +
    'letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;}' +
    '.cookie-banner p{font-size:14px;line-height:1.7;margin-bottom:18px;}' +
    '.cookie-banner a{color:var(--leaf);text-underline-offset:3px;}' +
    '.cookie-banner a:hover{color:var(--leaf-bright);}' +
    '.cookie-banner .cookie-actions{display:flex;gap:12px;flex-wrap:wrap;}' +
    '.cookie-banner button{font-family:var(--mono);font-size:12px;font-weight:700;letter-spacing:.08em;' +
    'text-transform:uppercase;padding:12px 22px;border-radius:4px;cursor:pointer;' +
    'border:1px solid var(--leaf);transition:background .2s,color .2s;}' +
    '.cookie-banner .cookie-accept{background:var(--leaf);color:var(--forest-deep);}' +
    '.cookie-banner .cookie-accept:hover{background:var(--leaf-bright);}' +
    '.cookie-banner .cookie-reject{background:transparent;color:var(--leaf);}' +
    '.cookie-banner .cookie-reject:hover{background:var(--leaf);color:var(--forest-deep);}' +
    '.cookie-banner button:focus-visible{outline:2px solid var(--cream);outline-offset:2px;}' +
    '@media (max-width:600px){.cookie-banner{left:16px;right:16px;bottom:16px;padding:20px;}' +
    '.cookie-banner button{flex:1 1 auto;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.hidden = true;
  banner.innerHTML =
    '<h2>Cookies</h2>' +
    '<p>We use strictly necessary cookies to keep this website secure and working. With your permission, ' +
    'we may also use optional cookies to understand how the site is used. We don\'t use any optional cookies ' +
    'today and won\'t set any unless you accept. See our <a href="cookie-policy.html">Cookie Policy</a>.</p>' +
    '<div class="cookie-actions">' +
    '<button type="button" class="cookie-accept">Accept all</button>' +
    '<button type="button" class="cookie-reject">Reject non-essential</button>' +
    '</div>';
  document.body.appendChild(banner);

  function close(nonEssential) {
    save(nonEssential);
    banner.hidden = true;
  }
  function open() {
    banner.hidden = false;
    banner.querySelector('.cookie-accept').focus();
  }

  banner.querySelector('.cookie-accept').addEventListener('click', function () { close(true); });
  banner.querySelector('.cookie-reject').addEventListener('click', function () { close(false); });

  document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  window.BroadenConsent = {
    get: function () { return read() || { nonEssential: false, ts: null }; },
    open: open
  };

  if (!read()) banner.hidden = false;
})();
