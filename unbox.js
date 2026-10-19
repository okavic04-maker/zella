/* Zella Store: Unboxing videos on the homepage (hosted on GitHub, loaded by one line in the head code).
   To add a video: upload <name>.mp4 + <name>.jpg to the repo, add a line to VIDS,
   and set CDN to the new commit (jsDelivr is slow to refresh videos on @main). */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@231a04a985/';
  var VIDS = [
    { f: 'uomo-born-in-roma', n: 'Valentino Uomo Born in Roma', s: 'borninroma', by: 'scentcrazy' },
    { f: 'donna-born-in-roma', n: 'Valentino Donna Born in Roma', s: 'donnapp', by: 'marinaa.lor' },
    { f: 'ysl-y-edp', n: 'YSL Y EDP', s: 'yysl', by: 'juwielli' }
  ];

  var css = ''
    + '#zub{direction:ltr;text-align:center;margin:26px 0 8px}'
    + '#zub .t{font-size:20px;font-weight:700;color:#202227}'
    + '#zub .s{font-size:13px;color:#6b7280;margin:4px 0 12px}'
    + '#zub .row{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:0 16px;scroll-snap-type:x mandatory;justify-content:safe center}'
    + '#zub .row::-webkit-scrollbar{display:none}'
    + '#zub button{position:relative;flex:0 0 140px;height:248px;border:0;padding:0;border-radius:16px;overflow:hidden;background:#111;cursor:pointer;scroll-snap-align:start}'
    + '#zub button img{width:100%;height:100%;object-fit:cover;display:block}'
    + '#zub button:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.7),transparent 35%)}'
    + '#zub .p{position:absolute;top:50%;left:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(0,0,0,.45);border:2px solid #fff;z-index:1}'
    + '#zub .p:before{content:"";position:absolute;left:16px;top:11px;border-style:solid;border-width:9px 0 9px 14px;border-color:transparent transparent transparent #fff}'
    + '#zub .n{position:absolute;left:8px;right:8px;top:10px;z-index:1;color:#fff;font-size:12px;font-weight:700;text-align:left;line-height:1.25}'
    + '.zub-view{direction:ltr;position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center}'
    + '.zub-view video{max-width:100%;max-height:100%;border-radius:12px;background:#000}'
    + '.zub-bar{position:absolute;top:10px;left:10px;right:10px;height:3px;background:rgba(255,255,255,.35);border-radius:2px;z-index:2}'
    + '.zub-bar i{display:block;height:100%;width:0;background:#fff;border-radius:2px}'
    + '.zub-head{position:absolute;top:22px;left:14px;z-index:2;color:#fff;font-size:13px;font-weight:700;text-shadow:0 1px 3px #000}'
    + '.zub-x{position:absolute;top:16px;right:10px;z-index:3;background:none;border:0;color:#fff;font-size:32px;line-height:1;cursor:pointer}'
    + '.zub-a{position:absolute;top:50%;left:8px;z-index:3;width:34px;height:34px;margin-top:-17px;border-radius:50%;background:rgba(255,255,255,.85);color:#000;font:700 26px/30px Arial;text-align:center;cursor:pointer}'
    + '.zub-a.r{left:auto;right:8px}'
    + '.zub-shop{position:absolute;left:16px;right:16px;bottom:22px;z-index:3;display:block;padding:13px;border-radius:14px;background:#fff;color:#000;font-weight:700;font-size:14px;text-align:center;text-decoration:none}';

  function render() {
    var old = document.getElementById('zub');
    if (location.pathname !== '/') { if (old) old.remove(); return; }
    if (old) return;
    var anchor = document.getElementById('zella-reviews');
    if (!anchor) return;
    if (!document.getElementById('zub-css')) {
      var st = document.createElement('style'); st.id = 'zub-css'; st.textContent = css; document.head.appendChild(st);
    }
    var el = document.createElement('div');
    el.id = 'zub';
    el.innerHTML = '<div class="t">Unboxing</div><div class="s">See the real bottle before you order</div><div class="row">'
      + VIDS.map(function (v, i) {
        return '<button type="button" data-zub="' + i + '"><img src="' + CDN + v.f + '.jpg" alt="' + v.n + '" loading="lazy"><span class="p"></span><span class="n">' + v.n + '</span></button>';
      }).join('') + '</div>';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
  }

  var view = null;
  function close() {
    if (!view) return;
    view.remove(); view = null;
    document.body.style.overflow = '';
  }
  function show(i) {
    if (i < 0) i = 0;
    if (i >= VIDS.length) return close();
    var v = VIDS[i];
    if (!view) { view = document.createElement('div'); view.className = 'zub-view'; document.body.appendChild(view); document.body.style.overflow = 'hidden'; }
    view.dataset.i = i;
    view.innerHTML = '<div class="zub-bar"><i></i></div><div class="zub-head">🎥 @' + v.by + '</div>'
      + '<button type="button" class="zub-x" aria-label="Close">×</button>'
      + '<video src="' + CDN + v.f + '.mp4" poster="' + CDN + v.f + '.jpg" playsinline preload="auto"></video>'
      + '<b class="zub-a">‹</b><b class="zub-a r">›</b>'
      + '<a class="zub-shop" href="/products/' + v.s + '">Shop Now · ' + v.n + '</a>';
    var vid = view.querySelector('video'), bar = view.querySelector('.zub-bar i');
    vid.addEventListener('timeupdate', function () { if (vid.duration) bar.style.width = (vid.currentTime / vid.duration * 100) + '%'; });
    vid.addEventListener('ended', function () { show(i + 1); });
    var p = vid.play();
    if (p && p.catch) p.catch(function () { vid.muted = true; vid.play(); }); // لو المتصفح منع الصوت، يشتغل صامت
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-zub]');
    if (b) { show(+b.getAttribute('data-zub')); return; }
    if (!view || !view.contains(e.target)) return;
    if (e.target.closest('.zub-shop')) { close(); return; }
    var a = e.target.closest('.zub-a'), i = +view.dataset.i;
    if (a) return show(a.classList.contains('r') ? i + 1 : i - 1);
    if (e.target.tagName === 'VIDEO') { var v = e.target; v.paused ? v.play() : v.pause(); return; } // دوسة على الفيديو = إيقاف/تشغيل
    close(); // برا الفيديو = قفل
  });

  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(render, 120); }).observe(document.body, { childList: true, subtree: true });
  render();
})();
