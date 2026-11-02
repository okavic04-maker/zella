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
    '#zop .zop-v{position:relative;height:400px;overflow:hidden;background:#111}' +
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
    return '<div class="zop-k"><a href="/products/' + p.slug + '">' +
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
    if (e.target.closest('#zop-go')) { e.preventDefault(); openCart(); }
  });

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

  function tick() {
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
      (slug ? '' : '<button type="button" class="zop-all' + (allAdded ? ' zop-ok' : '') + '"' + (allAdded ? ' disabled' : '') + '>' +
        (allAdded ? '✓ التلاتة في السلة' : '🛒 ضيف التلاتة للسلة بضغطة') + '</button>') +
      '<a id="zop-go" href="/cart"' + (Object.keys(added).length ? ' style="display:block"' : '') + '>كمّل الطلب من السلة ←</a>' +
      '<div class="zop-t">' + TRUST + '</div>';
    if (slug) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    else anchor.parentNode.insertBefore(box, anchor);
  }

  setInterval(tick, 700);
  tick();
})();
