/* Zella — offer picks: ?v=offer on /collections/men pins the ad-video perfumes on top */
(function () {
  var SLUGS = ['sauvagehigh', 'borninroma', 'intensely'];
  var CAT = 'eed6365c-4905-402f-8821-db78741bd33f';
  var KEY = 'zella_offer_pick';
  // Ad video shown at the top of the box; leave empty to hide it. Upload the mp4 to the repo and put its jsDelivr URL here.
  var VIDEO = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@883cf02a2a/offer-video.mp4.mp4';
  // The deadline line disappears once this passes (Cairo time).
  var END = new Date('2026-12-01T00:00:00+02:00');
  var END_TEXT = '⏳ العرض ساري لحد 30 نوفمبر بس';
  var TRUST = '💵 الدفع عند الاستلام • 🔄 استبدال واسترجاع مضمون • 🚚 توصيل خلال 2-3 أيام عمل';
  // Card that gets the "best seller" badge.
  var BEST = 'borninroma';
  // Customer review screenshots about the video perfumes (files in the repo's reviews/ folder).
  var REV_BASE = 'https://cdn.jsdelivr.net/gh/okavic04-maker/zella@5dbe4acdd43f0bd162f8e026635b31c312b41639/reviews/';
  var REVIEWS = ['r1.jpg', 'r2.jpg', 'r3.jpg', 'r4.jpg', 'r5.jpg'];

  function isMen() { return /^\/collections\/men\/?$/.test(location.pathname); }
  try {
    if (/[?&]v=offer\b/.test(location.search)) sessionStorage.setItem(KEY, '1');
  } catch (e) {}
  function fromAd() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function active() {
    if (!isMen()) return false;
    return /[?&]v=offer\b/.test(location.search) || fromAd();
  }
  // Slug of the video perfume whose page this is, for visitors who came from the ad link.
  function pageSlug() {
    var m = location.pathname.match(/^\/products\/([^\/?#]+)/);
    if (!m || SLUGS.indexOf(m[1]) < 0) return null;
    return fromAd() ? m[1] : null;
  }

  var css = '#zop{margin:0 0 18px;border-radius:16px;overflow:hidden;border:2px solid #14b8a6;background:#f0fdfa}' +
    '#zop .zop-h{background:#14b8a6;color:#fff;font-weight:800;font-size:17px;text-align:center;padding:10px 8px}' +
    '#zop .zop-h small{display:block;font-weight:600;font-size:13px;opacity:.95;margin-top:2px}' +
    '#zop .zop-end{background:#f97316;color:#fff;font-weight:800;font-size:13px;text-align:center;padding:5px 8px}' +
    // The whole vertical ad video in the middle, with a blurred copy of it filling the sides instead of black bars.
    '#zop .zop-v{position:relative;height:230px;overflow:hidden;background:#111}' +
    '#zop .zop-v video{position:relative;display:block;height:100%;width:auto;max-width:100%;margin:0 auto;object-fit:contain}' +
    '#zop .zop-v .zop-vb{position:absolute;inset:0;width:100%;max-width:none;height:100%;object-fit:cover;filter:blur(14px) brightness(.85);transform:scale(1.3)}' +
    '#zop .zop-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px}' +
    '#zop .zop-k{display:flex;flex-direction:column;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '#zop .zop-k a{display:flex;flex:1;flex-direction:column;background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '#zop img{width:100%;aspect-ratio:1/1;object-fit:contain;background:#fff}' +
    '#zop .zop-n{font-size:12px;font-weight:700;line-height:1.3;padding:6px 6px 0;min-height:32px;text-align:center}' +
    '#zop .zop-p{text-align:center;padding:4px 4px 8px}' +
    '#zop .zop-p b{color:#f97316;font-size:17px;font-weight:900}' +
    '#zop .zop-p s{color:#999;font-size:11px;margin-inline-start:4px}' +
    '#zop .zop-c{display:block;margin:0 6px 8px;background:#000;color:#fff;font-size:12px;font-weight:800;text-align:center;border:0;border-radius:8px;padding:8px 0;cursor:pointer;font-family:inherit}' +
    '#zop .zop-c.zop-ok{background:#16a34a}' +
    '#zop .zop-all{display:block;width:calc(100% - 20px);margin:0 10px 10px;background:#f97316;color:#fff;font-size:15px;font-weight:900;border:0;border-radius:10px;padding:11px 0;cursor:pointer;font-family:inherit}' +
    '#zop .zop-all.zop-ok{background:#16a34a}' +
    '#zop #zop-go{display:none;text-align:center;color:#f97316;font-weight:800;font-size:14px;padding:0 0 10px;text-decoration:underline}' +
    '#zop .zop-t{text-align:center;color:#475569;font-size:11.5px;line-height:1.6;padding:0 8px 10px}' +
    '#zop.zop-pp{margin:18px 0 0}#zop.zop-pp .zop-g{grid-template-columns:repeat(2,1fr)}' +
    '#zop-cs{margin:12px 0;border:2px dashed #f97316;border-radius:12px;background:#fff7ed;padding:10px;display:flex;gap:10px;align-items:center}' +
    '#zop-cs img{width:58px;height:58px;object-fit:contain;border-radius:8px;background:#fff;flex:none}' +
    '#zop-cs div{flex:1;font-size:13px;font-weight:700;line-height:1.4;color:#111}' +
    '#zop-cs button{flex:none;background:#f97316;color:#fff;border:0;border-radius:8px;padding:8px 10px;font-weight:800;font-size:12px;cursor:pointer;font-family:inherit}' +
    '#zop .zop-k{position:relative}' +
    '#zop .zop-best{position:absolute;top:6px;inset-inline-start:6px;z-index:1;background:#f97316;color:#fff;font-size:11px;font-weight:900;border-radius:20px;padding:3px 8px;box-shadow:0 2px 6px rgba(249,115,22,.4)}' +
    '#zop .zop-k.zop-isbest{outline:2px solid #f97316}' +
    '#zop .zop-save{margin:0 10px 10px;background:#fff;border:2px dashed #14b8a6;border-radius:10px;text-align:center;padding:8px 6px;font-size:14px;font-weight:800;color:#111;line-height:1.6}' +
    '#zop .zop-save{background:#fff7ed;border-color:#f97316;font-size:16px}' +
    '#zop .zop-save em{display:block;font-style:normal;color:#14b8a6;font-size:13px}' +
    '#zop .zop-save .zs-l{display:block;font-size:15px}' +
    '#zop .zop-save .zs-p{display:flex;justify-content:center;align-items:baseline;gap:8px;line-height:1.2}' +
    '#zop .zop-save b{color:#f97316;font-size:34px;font-weight:900}#zop .zop-save s{color:#999;font-size:16px}' +
    '#zop .zop-save .zs-c{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px}' +
    '#zop .zop-save .zs-c u{text-decoration:none;background:#dcfce7;color:#15803d;font-size:12.5px;border-radius:20px;padding:2px 10px}' +
    '#zop .zop-rh{font-weight:900;font-size:16px;text-align:center;padding:4px 8px 8px;color:#111}' +
    '#zop .zop-r{display:flex;gap:8px;overflow-x:auto;padding:0 10px 12px;scroll-snap-type:x mandatory}' +
    '#zop .zop-r img{cursor:pointer;flex:none;width:44%;aspect-ratio:3/4;object-fit:cover;object-position:top;border-radius:12px;scroll-snap-align:start;border:2px solid #14b8a6;background:#000}' +
    '#zop-bar{position:fixed;left:10px;right:10px;z-index:40;background:#fff;border:2px solid #14b8a6;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.18);padding:8px 10px;display:flex;align-items:center;gap:10px;font-family:inherit;direction:rtl}' +
    '#zop-bar .zb-d{display:flex;gap:4px;flex:none}#zop-bar .zb-d span{width:26px;height:26px;border-radius:50%;background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:14px}' +
    '#zop-bar .zb-d span.on{background:#14b8a6;color:#fff}#zop-bar .zb-d span.gift{background:#fff7ed;border:2px dashed #f97316}#zop-bar .zb-d span.gift.on{background:#f97316;border-color:#f97316}' +
    '#zop-bar .zb-t{flex:1;font-size:13px;font-weight:800;line-height:1.35;color:#111}#zop-bar .zb-t small{display:block;color:#f97316;font-size:12px}' +
    '#zop-bar button{flex:none;background:#f97316;color:#fff;border:0;border-radius:9px;padding:8px 10px;font-weight:900;font-size:12px;font-family:inherit}' +
    '@media(min-width:768px){#zop-bar{left:auto;right:20px;width:380px}#zop .zop-r img{width:22%}}' +
    '@media(min-width:768px){#zop .zop-n{font-size:15px}#zop .zop-p b{font-size:22px}#zop .zop-g{gap:16px;padding:16px}}';

  var products = null, loading = false;
  function load() {
    if (products || loading) return;
    loading = true;
    fetch('https://api.easy-orders.net/api/v1/products?limit=500&page=1&fields=id,name,thumb,price,sale_price,slug&category_id=' + CAT + '&theme_key=sphinx')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var all = (j && j.data) || [];
        products = SLUGS.map(function (s) {
          return all.filter(function (p) { return p.slug === s; })[0];
        }).filter(Boolean);
        tick();
      })
      .catch(function () { loading = false; });
  }

  function card(p) {
    var price = p.sale_price || p.price;
    var best = p.slug === BEST;
    return '<div class="zop-k' + (best ? ' zop-isbest' : '') + '">' + (best ? '<span class="zop-best">الأكثر طلباً 🔥</span>' : '') +
      '<a href="/products/' + p.slug + '">' +
      '<img src="' + p.thumb + '" alt="" loading="eager">' +
      '<div class="zop-n">' + p.name + '</div>' +
      '<div class="zop-p"><b>' + price + ' ج.م</b>' + (p.sale_price && p.price > p.sale_price ? '<s>' + p.price + '</s>' : '') + '</div></a>' +
      (added[p.id]
        ? '<button type="button" class="zop-c zop-ok" data-id="' + p.id + '">✓ اتضاف للسلة</button></div>'
        : '<button type="button" class="zop-c" data-id="' + p.id + '">أضف للسلة</button></div>');
  }

  // The theme re-renders the grid after a cart change, which rebuilds the box; keep what was added.
  var added = {};

  function guestId() {
    try { return JSON.parse(localStorage.getItem('guest-id')).state.guestId; } catch (e) { return null; }
  }

  // The theme keeps the cart in React Query under ['cart-items']; refetching it updates the header count.
  function queryClient() {
    try {
      var el = document.querySelector('header') || document.querySelector('.category_products_grid_container');
      var fk = el && Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; })[0];
      for (var f = fk && el[fk]; f; f = f.return) {
        var c = f.memoizedProps && f.memoizedProps.client;
        if (c && c.invalidateQueries) return c;
      }
    } catch (e) {}
    return null;
  }
  function refreshCart() {
    var c = queryClient();
    if (c) c.invalidateQueries({ queryKey: ['cart-items'] });
  }
  function cartItems() {
    var c = queryClient();
    var d = c && c.getQueryData(['cart-items']);
    return Array.isArray(d) ? d : [];
  }

  // Same call the theme's own "add to cart" makes; the cart page reads it from the server.
  function post(id) {
    return fetch('https://api.easy-orders.net/api/v1/cart-items/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: id, quantity: 1, guest_id: guestId() })
    }).then(function (r) {
      if (!r.ok) throw 0;
      added[id] = 1;
    });
  }

  function done() {
    refreshCart();
    var go = document.getElementById('zop-go');
    if (go) go.style.display = 'block';
    // Like the theme's own button: open the side cart once the refreshed items are in.
    setTimeout(openCart, 700);
  }

  function addToCart(btn) {
    if (!guestId()) { location.href = btn.parentNode.querySelector('a').getAttribute('href'); return; }
    btn.disabled = true;
    btn.textContent = '...';
    post(btn.getAttribute('data-id')).then(function () {
      btn.textContent = '✓ اتضاف للسلة';
      btn.className = 'zop-c zop-ok';
      done();
    }).catch(function () {
      btn.textContent = 'أضف للسلة';
    }).then(function () {
      setTimeout(function () { btn.disabled = false; }, 600);
    });
  }

  // "Add all three": adds the ones not added yet, one after another, then opens the cart once.
  function addAll(btn) {
    if (!guestId()) return;
    btn.disabled = true;
    btn.textContent = '...';
    var todo = products.filter(function (p) { return !added[p.id]; });
    todo.reduce(function (chain, p) {
      return chain.then(function () { return post(p.id); });
    }, Promise.resolve()).then(function () {
      [].forEach.call(document.querySelectorAll('#zop .zop-c'), function (b) {
        b.textContent = '✓ اتضاف للسلة';
        b.className = 'zop-c zop-ok';
      });
      btn.textContent = '✓ التلاتة في السلة';
      btn.className = 'zop-all zop-ok';
      done();
    }).catch(function () {
      btn.textContent = '🛒 ضيف التلاتة للسلة بضغطة';
      btn.disabled = false;
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest('#zop .zop-c');
    if (btn) { e.preventDefault(); addToCart(btn); return; }
    var all = e.target.closest('#zop .zop-all');
    if (all) { e.preventDefault(); addAll(all); return; }
    var cs = e.target.closest('#zop-cs button');
    if (cs) {
      e.preventDefault();
      cs.disabled = true;
      cs.textContent = '...';
      post(cs.getAttribute('data-id')).then(refreshCart).catch(function () { cs.disabled = false; cs.textContent = 'أضف'; });
      return;
    }
    var rv = e.target.closest('#zop .zop-r img');
    if (rv) { e.preventDefault(); showReview(+rv.getAttribute('data-i')); return; }
    if (view && view.contains(e.target)) {
      e.preventDefault();
      var i = +view.getAttribute('data-i'), ar = e.target.closest('.zrv-a');
      if (ar) return showReview(ar.classList.contains('r') ? i + 1 : i - 1);
      if (e.target.closest('.zrv-close') || e.target.tagName !== 'IMG') return closeReview();
      return showReview(e.clientX > innerWidth / 2 ? i + 1 : i - 1);
    }
    if (e.target.closest('#zop-bar button')) { e.preventDefault(); openCart(); return; }
    if (e.target.closest('#zop-go')) { e.preventDefault(); openCart(); }
  });

  // Review viewer: same look and swipe as the homepage reviews (bogo.js styles .zrv-view, swipe.js presses .zrv-a).
  var view = null;
  function closeReview() {
    if (!view) return;
    clearTimeout(view.t); view.remove(); view = null;
    document.body.style.overflow = '';
  }
  function showReview(i) {
    if (i < 0) i = 0;
    if (i >= REVIEWS.length) return closeReview();
    if (!view) {
      view = document.createElement('div');
      view.className = 'zrv-view';
      document.body.appendChild(view);
      document.body.style.overflow = 'hidden';
    }
    clearTimeout(view.t);
    view.setAttribute('data-i', i);
    view.innerHTML = '<div class="zrv-bars">' + REVIEWS.map(function (f, j) { return '<i><b style="width:' + (j < i ? 100 : 0) + '%"></b></i>'; }).join('') + '</div>' +
      '<div class="zrv-head">⭐ آراء عملاءنا</div><button type="button" class="zrv-close" aria-label="Close">×</button><b class="zrv-a">‹</b><b class="zrv-a r">›</b>' +
      '<img src="' + REV_BASE + REVIEWS[i] + '" alt="">';
    var bar = view.querySelectorAll('.zrv-bars b')[i];
    void bar.offsetWidth;
    bar.style.transition = 'width 5s linear'; bar.style.width = '100%';
    view.t = setTimeout(function () { showReview(i + 1); }, 5000);
  }

  // A full load of /cart 404s on this theme, so open it through the header cart button.
  function openCart() {
    var cart = [].filter.call(document.querySelectorAll('header button, button'), function (b) {
      return /items in cart/i.test(b.textContent);
    })[0];
    if (cart) cart.click(); else location.href = '/';
  }

  function ensureCss() {
    if (document.getElementById('zop-css')) return;
    var st = document.createElement('style');
    st.id = 'zop-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // In the side cart: when some of the video perfumes are in, suggest the missing ones next to the BOGO bar.
  function cartTick() {
    var cs = document.getElementById('zop-cs');
    var bar = document.getElementById('zella-bogo-bar');
    var items = bar && fromAd() && products ? cartItems() : [];
    var inCart = {}, pieces = 0;
    items.forEach(function (it) { inCart[it.product_id] = 1; pieces += it.quantity || 0; });
    var have = products ? products.filter(function (p) { return inCart[p.id]; }) : [];
    var miss = products ? products.filter(function (p) { return !inCart[p.id]; }) : [];
    if (!bar || !have.length || !miss.length) { if (cs) cs.remove(); return; }
    var p = miss[0];
    // One more piece completes a set of three, so the next one is the free one.
    var text = pieces % 3 === 2 ? 'ضيف ' + p.name + ' وخده هدية 🎁' : 'كمّل أنواع الفيديو: ' + p.name;
    var html = '<img src="' + p.thumb + '" alt=""><div>' + text + '</div><button type="button" data-id="' + p.id + '">أضف</button>';
    if (cs && cs.previousElementSibling === bar && cs.getAttribute('data-k') === p.id + text) return;
    if (cs) cs.remove();
    ensureCss();
    cs = document.createElement('div');
    cs.id = 'zop-cs';
    cs.setAttribute('data-k', p.id + text);
    cs.innerHTML = html;
    bar.parentNode.insertBefore(cs, bar.nextSibling);
  }

  function price(p) { return +(p.sale_price || p.price) || 0; }

  // The three together: the cheapest one is the free one.
  function saving() {
    if (products.length < 3) return '';
    var ps = products.map(price);
    var sum = ps.reduce(function (a, b) { return a + b; }, 0), free = Math.min.apply(null, ps);
    // Lead with the price per piece when taking all three, next to the highest single price.
    // One idea per line so it stays tidy on narrow phones.
    return '<div class="zop-save"><em>لما تاخد التلاتة 👇</em>' +
      '<span class="zs-l">كل برفيوم يطلع عليك بـ</span>' +
      '<span class="zs-p"><b>' + Math.round((sum - free) / 3) + ' ج.م</b><s>بدل ' + Math.max.apply(null, ps) + '</s></span>' +
      '<span class="zs-c"><u>التلاتة بـ ' + (sum - free) + ' بدل ' + sum + '</u><u>وفّرت ' + free + ' ج.م + شحن مجاني 🚚</u></span></div>';
  }

  // Sticky progress bar for ad visitors: how many pieces until the free one. Hidden while the side cart is open.
  function barTick() {
    var bar = document.getElementById('zop-bar');
    var cartOpen = document.getElementById('zella-bogo-bar');
    var show = fromAd() && products && !cartOpen && !document.querySelector('.zrv-view, .zub-view') && !/^\/(checkout|thank)/.test(location.pathname);
    if (!show) { if (bar) bar.remove(); return; }
    // The server can keep two rows for one product; the theme shows them as one line, so count each product once.
    var q = {};
    cartItems().forEach(function (it) { q[it.product_id] = Math.max(q[it.product_id] || 0, +it.quantity || 0); });
    var pieces = Object.keys(q).reduce(function (n, k) { return n + q[k]; }, 0);
    var n = pieces % 3, sets = Math.floor(pieces / 3);
    var dots = [1, 2, 3].map(function (i) {
      return '<span class="' + (i === 3 ? 'gift' : '') + (i <= n || (n === 0 && sets) ? ' on' : '') + '">' + (i === 3 ? '🎁' : (i <= n || (n === 0 && sets) ? '✓' : '')) + '</span>';
    }).join('');
    var text = n === 0 && sets ? 'مبروك! التالتة علينا هدية 🎁<small>كمّل الطلب أو ضيف 2 كمان وخد هدية تانية</small>'
      : n === 0 ? 'اختار 2 برفيوم والتالتة هدية 🎁<small>والشحن مجاني 🚚</small>'
      : n === 1 ? 'ضفت 1 – ضيف 1 كمان<small>وبعدها التالتة علينا هدية 🎁</small>'
      : 'فاضل خطوة! ضيف التالتة ببلاش 🎁<small>البرفيوم التالت هدية مننا</small>';
    var key = pieces + '';
    if (bar && bar.getAttribute('data-k') === key) { place(bar); return; }
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'zop-bar';
      document.body.appendChild(bar);
    }
    bar.setAttribute('data-k', key);
    bar.innerHTML = '<div class="zb-d">' + dots + '</div><div class="zb-t">' + text + '</div>' +
      (pieces ? '<button type="button">السلة 🛒</button>' : '');
    place(bar);
  }
  // Sit just above the theme's bottom nav.
  function place(bar) {
    var nav = document.querySelector('section.fixed.inset-x-5');
    var top = nav ? nav.getBoundingClientRect().top : innerHeight;
    if (top <= 0 || top > innerHeight) top = innerHeight;
    bar.style.bottom = (innerHeight - top + 8) + 'px';
  }

  function tick() {
    if (fromAd()) { ensureCss(); barTick(); }
    var box = document.getElementById('zop');
    var slug = pageSlug();
    if (fromAd()) { load(); cartTick(); }
    if (!active() && !slug) { if (box) box.remove(); return; }
    load();
    if (!products || !products.length) return;
    var anchor, list, title;
    if (slug) {
      // Product page of one of the video perfumes: offer the other two under the order buttons.
      var buy = [].filter.call(document.querySelectorAll('.p_details_container button'), function (b) {
        return b.textContent.trim() === 'أضف للسلة';
      })[0];
      anchor = buy && buy.parentNode;
      if (!anchor) return;
      if (box && box.previousElementSibling === anchor) return;
      list = products.filter(function (p) { return p.slug !== slug; });
      title = '🎬 كمّل أنواع الفيديو';
    } else {
      anchor = document.querySelector('.category_products_grid_container');
      if (!anchor) return;
      if (box && box.nextElementSibling === anchor) return;
      list = products;
      title = '🎬 الأنواع اللي في الفيديو';
    }
    if (box) box.remove();
    ensureCss();
    var allAdded = products.every(function (p) { return added[p.id]; });
    box = document.createElement('div');
    box.id = 'zop';
    if (slug) box.className = 'zop-pp';
    box.innerHTML = '<div class="zop-h">' + title + '<small>اشتري 2 والتالتة هدية 🎁 والشحن مجاني 🚚</small></div>' +
      (new Date() < END ? '<div class="zop-end">' + END_TEXT + '</div>' : '') +
      (VIDEO && !slug ? '<div class="zop-v">' +
        '<video class="zop-vb" src="' + VIDEO + '" autoplay muted loop playsinline aria-hidden="true"></video>' +
        '<video src="' + VIDEO + '" autoplay muted loop playsinline></video></div>' : '') +
      '<div class="zop-g">' + list.map(card).join('') + '</div>' +
      (slug ? '' : saving()) +
      (slug ? '' : '<button type="button" class="zop-all' + (allAdded ? ' zop-ok' : '') + '"' + (allAdded ? ' disabled' : '') + '>' +
        (allAdded ? '✓ التلاتة في السلة' : '🛒 ضيف التلاتة للسلة بضغطة') + '</button>') +
      '<a id="zop-go" href="/cart"' + (Object.keys(added).length ? ' style="display:block"' : '') + '>كمّل الطلب من السلة ←</a>' +
      '<div class="zop-t">' + TRUST + '</div>' +
      (REVIEWS.length ? '<div class="zop-rh">⭐ آراء عملاءنا في الأنواع دي</div><div class="zop-r">' +
        REVIEWS.map(function (f, i) { return '<img src="' + REV_BASE + f + '" data-i="' + i + '" alt="" loading="lazy">'; }).join('') + '</div>' : '');
    if (slug) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    else anchor.parentNode.insertBefore(box, anchor);
  }

  setInterval(tick, 700);
  tick();
})();
