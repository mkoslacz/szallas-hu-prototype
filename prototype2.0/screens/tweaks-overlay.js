/*
 * Shared tweaks panel + view toggle for ALL secondary screens (homepage, listing,
 * checkout, payment, thank you). Mirrors the PDP TweaksPanel structure.
 *
 * Strategy: vanilla DOM (no React) so it works regardless of host page setup.
 * Toggles write to localStorage 'szallas_tweaks' and force window.location.reload()
 * — secondary pages read the localStorage on load via their own `const tw = ...`
 * and apply visual effects (price formatting, VIP discount, etc.).
 */
(function () {
  const KEY = 'szallas_tweaks';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (t) => { try { localStorage.setItem(KEY, JSON.stringify(t)); } catch (e) {} };
  const setKey = (k, v) => { const t = read(); t[k] = v; write(t); location.reload(); };
  const toggle = (k) => { const t = read(); setKey(k, !t[k]); };

  const tweaks = read();

  // --- CSS ---
  const css = `
.tweaks-fab{position:fixed;right:20px;bottom:20px;z-index:90;background:#1F2A36;color:#fff;border:0;border-radius:999px;padding:12px 18px;font-size:13px;font-weight:700;display:inline-flex;gap:8px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.25);font-family:'Inter',sans-serif;cursor:pointer}
.tweaks-fab:hover{background:#000}
.tweaks-panel{position:fixed;right:20px;bottom:72px;width:340px;max-height:78vh;overflow:auto;background:#fff;border:1px solid #E1E4EA;border-radius:14px;box-shadow:0 12px 36px rgba(0,0,0,.18);z-index:90;padding:16px 18px;display:none;font-family:'Inter',sans-serif}
.tweaks-panel.open{display:block}
.tweaks-panel h4{margin:0 0 4px;font-size:14px;font-weight:800;color:#1F2A36}
.tweaks-panel .sub{font-size:12px;color:#6B7683;margin-bottom:14px;line-height:1.45}
.tw-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid #E1E4EA;font-size:13px;gap:12px}
.tw-row:first-of-type{border-top:0}
.tw-lbl{font-weight:600;color:#1F2A36;line-height:1.25}
.tw-sub{font-size:11.5px;color:#6B7683;margin-top:1px;max-width:180px;line-height:1.4}
.tw-row-group{padding-top:12px;margin-top:4px;border-top:2px solid #C9CED6}
.tw-row-group .tw-lbl{text-transform:uppercase;font-size:11px;letter-spacing:.06em;color:#6B7683;font-weight:800}
.tw-switch{width:38px;height:22px;background:#A1A8B3;border-radius:999px;position:relative;cursor:pointer;border:0;padding:0;flex-shrink:0;transition:background .15s}
.tw-switch::after{content:"";position:absolute;left:2px;top:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:all .15s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.tw-switch.on{background:#E30613}
.tw-switch.on::after{left:18px}
.tw-seg{display:inline-flex;border:1px solid #C9CED6;border-radius:999px;padding:2px;background:#fff;flex-shrink:0}
.tw-seg button{border:0;background:transparent;padding:4px 10px;font-size:12px;border-radius:999px;color:#394654;cursor:pointer;font-family:inherit;font-weight:600}
.tw-seg button.on{background:#E30613;color:#fff}

.view-toggle{position:fixed;left:20px;bottom:20px;z-index:90;background:#fff;border:1px solid #C9CED6;border-radius:999px;padding:4px;box-shadow:0 4px 12px rgba(0,0,0,.08);display:flex;gap:2px;font-family:'Inter',sans-serif}
.view-toggle button{background:transparent;border:0;padding:8px 14px;border-radius:999px;font-size:12.5px;color:#394654;font-weight:600;display:inline-flex;gap:6px;align-items:center;cursor:pointer;font-family:inherit}
.view-toggle button.on{background:#E30613;color:#fff}

/* Forced mobile preview wrap — light gray surround like a phone in a soft frame.
   Matches PDP mobile body bg (--surface-2 #F5F6F8) for visual consistency between screens. */
html[data-view="mobile"] body{background:#F5F6F8;min-height:100vh;padding-top:20px;padding-bottom:80px}
html[data-view="mobile"] body > *:not(.tweaks-fab):not(.tweaks-panel):not(.view-toggle):not(.tweaks-indicator):not(.map-fullscreen):not(.mobile-filters-drawer){max-width:375px;margin-left:auto;margin-right:auto;box-shadow:0 0 0 1px #c9ced6}
html[data-view="mobile"] body{display:block}

/* === Mobile brandbar (compact: hide call-center text, hide account text, icons only) === */
html[data-view="mobile"] .brandbar{height:52px}
html[data-view="mobile"] .brandbar-inner{padding:0 10px;gap:6px;height:52px}
html[data-view="mobile"] .logo-brand{height:52px;gap:6px}
html[data-view="mobile"] .logo-word{font-size:19px}
html[data-view="mobile"] .logo-tag{font-size:8px;padding:3px 6px 4px;line-height:1.02;transform:rotate(-6deg) translateY(1px)}
html[data-view="mobile"] .brandbar .brand-right{gap:4px}
html[data-view="mobile"] .brandbar .callcenter-trigger,
html[data-view="mobile"] .brandbar .account-btn{padding:3px;gap:0}
html[data-view="mobile"] .brandbar .callcenter-trigger .cc-text,
html[data-view="mobile"] .brandbar .account-btn .cc-text,
html[data-view="mobile"] .brandbar .account-btn .cc-chev{display:none}
html[data-view="mobile"] .brandbar .callcenter-trigger .cc-ring,
html[data-view="mobile"] .brandbar .account-btn .cc-ring{width:32px;height:32px;font-size:14px}
html[data-view="mobile"] .brandbar .hamburger-trigger{width:34px;height:34px;font-size:16px}

/* === Mobile footer (2 columns, smaller) === */
html[data-view="mobile"] .footer{padding:24px 14px 16px;margin-top:28px}
html[data-view="mobile"] .footer-inner{grid-template-columns:1fr 1fr;gap:14px}
html[data-view="mobile"] .footer h5{font-size:11.5px;margin-bottom:8px}
html[data-view="mobile"] .footer ul{font-size:12.5px;gap:5px}
html[data-view="mobile"] .footer-bottom{flex-direction:column;text-align:center;gap:10px;align-items:center;margin-top:20px;padding-top:14px}
html[data-view="mobile"] .footer-trust{gap:8px;justify-content:center}
html[data-view="mobile"] .footer-trust-badge{font-size:10.5px;padding:4px 8px}

/* Hide PDP-tweaks indicator on mobile — overlaps view-toggle + clutters small screen */
html[data-view="mobile"] .tweaks-indicator{display:none}

/* Shift Tweaks FAB and view-toggle inwards a bit so they don't hug the very edge */
html[data-view="mobile"] .tweaks-fab{padding:9px 14px;font-size:12px}
html[data-view="mobile"] .view-toggle{padding:3px}
html[data-view="mobile"] .view-toggle button{padding:6px 12px;font-size:11.5px}
`;
  const styleEl = document.createElement('style');
  styleEl.id = 'tweaks-overlay-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // --- Switch / Seg renderers ---
  const swHTML = (k) => `<button class="tw-switch${tweaks[k]?' on':''}" data-toggle="${k}" aria-pressed="${!!tweaks[k]}"></button>`;
  const segHTML = (k, opts, defaultV) => {
    const cur = tweaks[k] != null ? tweaks[k] : defaultV;
    return `<div class="tw-seg" data-seg="${k}">` +
      opts.map(o => `<button class="${cur===o.v?'on':''}" data-val="${o.v}">${o.l}</button>`).join('') +
      `</div>`;
  };

  // --- Panel content ---
  const panel = document.createElement('div');
  panel.className = 'tweaks-panel';
  panel.id = 'tweaks-panel';
  panel.innerHTML = `
    <h4>Conversion levers</h4>
    <div class="sub">Elements that may improve booking conversion. Changes propagate across all screens (saved in localStorage).</div>

    <div class="tw-row">
      <div><div class="tw-lbl">Has dates selected</div><div class="tw-sub">OFF = show 90-day lowest forecast price</div></div>
      ${swHTML('hasDates')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Urgency indicators</div><div class="tw-sub">"Only 2 rooms left" badges</div></div>
      ${swHTML('showUrgency')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Social proof</div><div class="tw-sub">"134 people viewed in last 24h"</div></div>
      ${swHTML('showSocialProof')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Price anchoring</div><div class="tw-sub">Strikethrough original, savings</div></div>
      ${swHTML('showPriceAnchor')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">VIP / Club teaser</div><div class="tw-sub">"Extra discount for VIP" banner</div></div>
      ${swHTML('showVipTeaser')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Price display</div><div class="tw-sub">Per night / total / per person</div></div>
      ${segHTML('priceMode', [{v:'total',l:'Total'},{v:'nightly',l:'/éj'},{v:'per-person',l:'/fő/éj'}], 'total')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Score badge position</div><div class="tw-sub">A: inline · B: hero · C: side</div></div>
      ${segHTML('scoreBadgePos', [{v:'inline',l:'A'},{v:'overlay',l:'B'},{v:'sidebar',l:'C'}], 'inline')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Search bar</div><div class="tw-sub">Persistent search bar visible</div></div>
      ${swHTML('showSearchBar')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Logged-in state</div><div class="tw-sub">Show VIP −15% pricing + avatar</div></div>
      ${swHTML('loggedIn')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Sticky booking bar</div><div class="tw-sub">Default vs red variant</div></div>
      ${segHTML('bookingBarStyle', [{v:'default',l:'Default'},{v:'red',l:'Red'}], 'default')}
    </div>

    <div class="tw-row tw-row-group">
      <div><div class="tw-lbl">Edge states</div><div class="tw-sub">Scenarios for prototype audit</div></div>
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Sold out</div><div class="tw-sub">All rooms unavailable</div></div>
      ${swHTML('forceSoldOut')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Some rates unavailable</div><div class="tw-sub">First rate dimmed "Sold"</div></div>
      ${swHTML('forceFewRates')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">No reviews</div><div class="tw-sub">Empty state "Be the first"</div></div>
      ${swHTML('forceNoReviews')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">No photos in category</div><div class="tw-sub">Placeholder for category</div></div>
      ${swHTML('forceNoPhotosCat')}
    </div>
    <div class="tw-row">
      <div><div class="tw-lbl">Loading state (skeletons)</div><div class="tw-sub">All photos shimmer</div></div>
      ${swHTML('forceLoading')}
    </div>

    <div class="tw-row" style="border-top-color:#C9CED6;border-top-width:2px;padding-top:14px;margin-top:4px">
      <button onclick="localStorage.removeItem('szallas_tweaks');location.reload();" style="background:transparent;border:1px solid #C9CED6;border-radius:8px;padding:6px 12px;font-size:12px;color:#394654;cursor:pointer;font-family:inherit;font-weight:600">↺ Reset all tweaks</button>
    </div>
  `;
  document.body.appendChild(panel);

  // --- FAB ---
  const fab = document.createElement('button');
  fab.className = 'tweaks-fab';
  fab.id = 'tweaks-fab';
  fab.innerHTML = '⚙ Tweaks';
  fab.onclick = () => panel.classList.toggle('open');
  document.body.appendChild(fab);

  // --- ViewToggle (desktop / mobile) ---
  const initialView = tweaks.viewMode || 'desktop';
  if (initialView === 'mobile') document.documentElement.setAttribute('data-view', 'mobile');
  const vt = document.createElement('div');
  vt.className = 'view-toggle';
  vt.id = 'view-toggle';
  vt.innerHTML = `
    <button class="${initialView==='desktop'?'on':''}" data-vmode="desktop">🖥 Desktop</button>
    <button class="${initialView==='mobile'?'on':''}" data-vmode="mobile">📱 Mobile</button>
  `;
  vt.querySelectorAll('button').forEach(b => b.onclick = () => setKey('viewMode', b.dataset.vmode));
  document.body.appendChild(vt);

  // --- Wire toggles ---
  panel.querySelectorAll('button.tw-switch').forEach(btn => {
    btn.onclick = () => toggle(btn.dataset.toggle);
  });
  panel.querySelectorAll('.tw-seg').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => setKey(seg.dataset.seg, btn.dataset.val);
    });
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    panel.classList.remove('open');
  });
})();
