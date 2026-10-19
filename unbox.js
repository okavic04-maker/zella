/* Zella Store: Unboxing videos on the homepage (hosted on GitHub, loaded by one line in the head code).
   To add a video: upload <name>.mp4, <name>-card.mp4 and <name>-card.jpg to the repo, add a line to VIDS,
   and set CDN to the new commit (jsDelivr is slow to refresh files on @main). */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@2fa945794e/';
  var API = 'https://api.easy-orders.net/api/v1/';
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
    + '#zub button video{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}'
    + '#zub button:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.7),transparent 32%,transparent 62%,rgba(0,0,0,.8))}'
    + '#zub .p{position:absolute;top:50%;left:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:rgba(0,0,0,.35);border:2px solid #fff;z-index:1}'
    + '#zub .p:before{content:"";position:absolute;left:14px;top:10px;border-style:solid;border-width:8px 0 8px 13px;border-color:transparent transparent transparent #fff}'
    + '#zub .n{position:absolute;left:8px;right:8px;top:10px;z-index:1;color:#fff;font-size:12px;font-weight:700;text-align:left;line-height:1.25}'
    + '#zub .pr{position:absolute;left:8px;bottom:9px;z-index:1;color:#fff;font-size:14px;font-weight:800;text-align:left}'
    + '#zub .pr s{display:block;font-size:11px;font-weight:600;opacity:.75}'
    + '#zub .off{position:absolute;right:8px;bottom:10px;z-index:1;background:#c9a24d;color:#000;font-size:11px;font-weight:800;padding:3px 7px;border-radius:20px}'
    + '.zub-view{direction:ltr;position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center}'
    + '.zub-view video{max-width:100%;max-height:100%;border-radius:12px;background:#000}'
    + '.zub-bar{position:absolute;top:10px;left:10px;right:10px;height:3px;background:rgba(255,255,255,.35);border-radius:2px;z-index:2}'
    + '.zub-bar i{display:block;height:100%;width:0;background:#fff;border-radius:2px}'
    + '.zub-x{position:absolute;top:16px;right:10px;z-index:3;background:none;border:0;color:#fff;font-size:32px;line-height:1;cursor:pointer}'
    + '.zub-a{position:absolute;top:50%;left:8px;z-index:3;width:34px;height:34px;margin-top:-17px;border-radius:50%;background:rgba(255,255,255,.85);color:#000;font:700 26px/30px Arial;text-align:center;cursor:pointer}'
    + '.zub-a.r{left:auto;right:8px}'
    + '.zub-foot{position:absolute;left:16px;right:16px;bottom:22px;z-index:3;display:flex;gap:8px}'
    + '.zub-foot a,.zub-foot button{flex:1;padding:13px 8px;border-radius:14px;font-weight:700;font-size:14px;text-align:center;text-decoration:none;cursor:pointer;font-family:inherit}'
    + '.zub-foot a{flex:0 0 34%;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.6)}'
    + '.zub-add{background:#fff;color:#000;border:0}'
    + '.zub-add.done{background:#16a34a;color:#fff}';

  var info = {}, infoLoading = false;
  function loadInfo() { // price + id of each product, from the store's public API
    if (infoLoading) return; infoLoading = true;
    fetch(API + 'products?limit=20&fields=id,slug,price,sale_price&filter=slug||$in||' + VIDS.map(function (v) { return v.s; }).join(','))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.data || j || []).forEach(function (p) { info[p.slug] = p; }); var el = document.getElementById('zub'); if (el) el.remove(); render(); })
      .catch(function () {});
  }
  function money(x) { return Math.round(x).toLocaleString('en-US'); }
  function priceOf(p) { return p.sale_price && p.sale_price < p.price ? p.sale_price : p.price; }

  function render() {
    var old = document.getElementById('zub');
    if (location.pathname !== '/') { if (old) old.remove(); return; }
    if (old) return;
    var anchor = document.getElementById('zella-reviews');
    if (!anchor) return;
    if (!document.getElementById('zub-css')) {
      var st = document.createElement('style'); st.id = 'zub-css'; st.textContent = css; document.head.appendChild(st);
    }
    loadInfo();
    var el = document.createElement('div');
    el.id = 'zub';
    el.innerHTML = '<div class="t">Unboxing</div><div class="s">See the real bottle before you order</div><div class="row">'
      + VIDS.map(function (v, i) {
        var p = info[v.s], price = '', off = '';
        if (p) {
          var now = priceOf(p);
          price = '<span class="pr">' + (now < p.price ? '<s>' + money(p.price) + ' EGP</s>' : '') + money(now) + ' EGP</span>';
          if (now < p.price) off = '<span class="off">-' + Math.round((1 - now / p.price) * 100) + '%</span>';
        }
        return '<button type="button" data-zub="' + i + '"><video src="' + CDN + v.f + '-card.mp4" poster="' + CDN + v.f + '-card.jpg" muted autoplay loop playsinline preload="metadata"></video>'
          + '<span class="p"></span><span class="n">' + v.n + '</span>' + price + off + '</button>';
      }).join('') + '</div>';
    anchor.parentElement.insertBefore(el, anchor.nextSibling);
    el.querySelectorAll('video').forEach(function (v) { v.muted = true; var q = v.play(); if (q && q.catch) q.catch(function () {}); }); // autoplay needs muted set in code
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
    var v = VIDS[i], p = info[v.s];
    if (!view) { view = document.createElement('div'); view.className = 'zub-view'; document.body.appendChild(view); document.body.style.overflow = 'hidden'; }
    view.dataset.i = i;
    view.innerHTML = '<div class="zub-bar"><i></i></div>'
      + '<button type="button" class="zub-x" aria-label="Close">×</button>'
      + '<video src="' + CDN + v.f + '.mp4" poster="' + CDN + v.f + '-card.jpg" playsinline preload="auto"></video>'
      + '<b class="zub-a">‹</b><b class="zub-a r">›</b>'
      + '<div class="zub-foot"><a href="/products/' + v.s + '">View</a>'
      + '<button type="button" class="zub-add">' + (p ? 'Add to Cart · ' + money(priceOf(p)) + ' EGP' : 'Add to Cart') + '</button></div>';
    var vid = view.querySelector('video'), bar = view.querySelector('.zub-bar i');
    vid.addEventListener('timeupdate', function () { if (vid.duration) bar.style.width = (vid.currentTime / vid.duration * 100) + '%'; });
    vid.addEventListener('ended', function () { show(i + 1); });
    var pl = vid.play();
    if (pl && pl.catch) pl.catch(function () { vid.muted = true; vid.play(); }); // لو المتصفح منع الصوت، يشتغل صامت
  }

  // same cart call the store uses, so the cart drawer updates right away
  var queryClient = null;
  function findQueryClient() {
    if (queryClient) return queryClient;
    var root = document.getElementById('__next');
    if (!root) return null;
    var key = Object.keys(root).filter(function (k) { return k.indexOf('__reactContainer') === 0; })[0];
    var f = key && root[key];
    if (f && f.stateNode && f.stateNode.current) f = f.stateNode.current;
    var stack = [f], n = 0;
    while (stack.length && n < 5000) {
      var x = stack.pop(); n++;
      if (!x) continue;
      var pr = x.memoizedProps;
      if (pr && pr.client && typeof pr.client.invalidateQueries === 'function') { queryClient = pr.client; break; }
      if (x.child) stack.push(x.child);
      if (x.sibling) stack.push(x.sibling);
    }
    return queryClient;
  }
  function openCart() {
    if (document.querySelector('[data-cart="items-section"]')) return;
    var b = [].slice.call(document.querySelectorAll('header button')).filter(function (x) { return /items in cart/.test(x.innerText); })[0];
    if (b) b.click();
  }
  function addToCart(btn, v) {
    var p = info[v.s], g = {};
    try { g = JSON.parse(localStorage.getItem('guest-id')).state || {}; } catch (er) {}
    if (!p || !g.guestId) { location.href = '/products/' + v.s; return; }
    btn.disabled = true; btn.textContent = '...';
    fetch(API + 'cart-items/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*', 'currencyId': g.currencyId, 'Currency-Id': g.currencyId },
      body: JSON.stringify({ product_id: p.id, quantity: 1, guest_id: g.guestId })
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      var qc = findQueryClient();
      if (qc) qc.invalidateQueries({ queryKey: ['cart-items'] });
      try { if (window.fbq) window.fbq('track', 'AddToCart', { content_ids: [p.id], content_type: 'product', value: priceOf(p), currency: 'EGP' }); } catch (er) {}
      try { if (window.ttq) window.ttq.track('AddToCart', { content_id: p.id, value: priceOf(p), currency: 'EGP' }); } catch (er) {}
      btn.textContent = '✓ Added'; btn.classList.add('done');
      setTimeout(function () { close(); openCart(); }, 700);
    }).catch(function () { location.href = '/products/' + v.s; }); // لو فيه مشكلة نفتح صفحة المنتج
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-zub]');
    if (b) { show(+b.getAttribute('data-zub')); return; }
    if (!view || !view.contains(e.target)) return;
    var i = +view.dataset.i;
    if (e.target.closest('.zub-foot a')) { close(); return; }
    var add = e.target.closest('.zub-add');
    if (add) { if (!add.disabled) addToCart(add, VIDS[i]); return; }
    var a = e.target.closest('.zub-a');
    if (a) return show(a.classList.contains('r') ? i + 1 : i - 1);
    if (e.target.tagName === 'VIDEO') { var vd = e.target; vd.paused ? vd.play() : vd.pause(); return; } // دوسة على الفيديو = إيقاف/تشغيل
    if (e.target.closest('.zub-foot')) return;
    close(); // برا الفيديو = قفل
  });

  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(render, 120); }).observe(document.body, { childList: true, subtree: true });
  render();
})();
