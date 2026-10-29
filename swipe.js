/* Zella Store: touch polish for the Reviews and Unboxing viewers (loaded by one line in the head code).
   - Swipe left / right inside a viewer = next / previous (it presses the viewer's own arrow buttons).
   - A hand hint shows how to swipe the first time a viewer opens on a touch screen.
   - A swipe on the review circles or unboxing cards row scrolls the row only, it doesn't open anything.
   - The Reviews viewer leaves a see-through gap above and below like the Unboxing one (tap it to close).
   - Unboxing card videos play only while they are on screen, so the homepage scrolls smoothly. */
(function () {
  var css = ''
    + '.zrv-view,.zub-view{touch-action:none;overscroll-behavior:contain}'
    + '.zrv-view img,.zrv-view video{max-width:min(100%,460px)!important;max-height:calc(100% - 200px)!important}'
    + '.zsw-hint{position:absolute;left:50%;top:50%;z-index:5;width:150px;margin:-55px 0 0 -75px;padding:14px 0 12px;border-radius:18px;background:rgba(0,0,0,.6);color:#fff;text-align:center;font:700 13px/1.4 inherit;pointer-events:none;animation:zsw-fade 2.6s ease forwards}'
    + '.zsw-hint i{display:block;font-style:normal;font-size:34px;animation:zsw-swipe 1.1s ease-in-out 2}'
    + '@keyframes zsw-swipe{0%,100%{transform:translateX(26px)}50%{transform:translateX(-26px)}}'
    + '@keyframes zsw-fade{0%,80%{opacity:1}100%{opacity:0}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function viewer(el) { return el && el.closest && el.closest('.zrv-view, .zub-view'); }
  var x0 = 0, y0 = 0, moved = false, swallow = false;
  document.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; moved = false; swallow = false; // a new touch: forget a click that never came
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    if (Math.abs(t.clientX - x0) > 10 || Math.abs(t.clientY - y0) > 10) moved = true;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    var v = viewer(e.target);
    if (v && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      var arrow = v.querySelector(dx < 0 ? '.zrv-a.r, .zub-a.r' : '.zrv-a:not(.r), .zub-a:not(.r)');
      swallow = true; // the browser still sends a click after this touch: drop it
      if (arrow) arrow.click();
    } else if (moved) swallow = true; // a scroll / drag is not a tap
  }, { passive: true });
  document.addEventListener('click', function (e) {
    if (!swallow) return;
    swallow = false;
    if (e.isTrusted && (viewer(e.target) || (e.target.closest && e.target.closest('[data-zrv], [data-zub]')))) { e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);

  // first time a viewer opens on a touch screen: show the swipe hint once
  var hinted = false;
  try { hinted = localStorage.getItem('zella-swipe-hint') === '1'; } catch (er) {}
  function hint(v) {
    if (hinted || !('ontouchstart' in window)) return;
    hinted = true;
    try { localStorage.setItem('zella-swipe-hint', '1'); } catch (er) {}
    var h = document.createElement('div');
    h.className = 'zsw-hint';
    h.innerHTML = '<i>👆</i>اسحب يمين وشمال';
    v.appendChild(h);
    setTimeout(function () { if (h.parentElement) h.remove(); }, 2700);
  }

  // card videos: play only what's on screen
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (list) {
    list.forEach(function (x) {
      var vd = x.target;
      if (x.isIntersecting) { var p = vd.play(); if (p && p.catch) p.catch(function () {}); } else vd.pause();
    });
  }, { threshold: 0.25 }) : null;

  function tick() {
    var v = document.querySelector('.zrv-view, .zub-view');
    if (v && !v.dataset.zsw) { v.dataset.zsw = '1'; hint(v); }
    if (io) document.querySelectorAll('#zub button video, #zub-pp video').forEach(function (vd) {
      if (vd.dataset.zio) return;
      vd.dataset.zio = '1'; vd.autoplay = false; vd.pause(); io.observe(vd);
    });
  }
  var t;
  function start() {
    new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; tick(); }, 150); }).observe(document.body, { childList: true, subtree: true });
    tick();
  }
  var gone;
  function go() { // start as soon as React has taken over the page (or at load), so its first render isn't disturbed
    if (gone) return;
    var m = document.querySelector('main');
    if (document.readyState === 'complete' || (m && Object.keys(m).some(function (k) { return k.indexOf('__reactFiber') === 0; }))) { gone = 1; setTimeout(start, 30); }
    else setTimeout(go, 50);
  }
  go();
})();
