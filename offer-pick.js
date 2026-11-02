/* Zella — offer picks: ?v=offer on /collections/men pins the ad-video perfumes on top */
(function () {
  var SLUGS = ['sauvagehigh', 'borninroma', 'intensely'];
  var CAT = 'eed6365c-4905-402f-8821-db78741bd33f';
  var KEY = 'zella_offer_pick';

  function isMen() { return /^\/collections\/men\/?$/.test(location.pathname); }
  try {
    if (/[?&]v=offer\b/.test(location.search)) sessionStorage.setItem(KEY, '1');
  } catch (e) {}
  function active() {
    if (!isMen()) return false;
    if (/[?&]v=offer\b/.test(location.search)) return true;
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  // Slug of the video perfume whose page this is, for visitors who came from the ad link.
  function pageSlug() {
    var m = location.pathname.match(/^\/products\/([^\/?#]+)/);
    if (!m || SLUGS.indexOf(m[1]) < 0) return null;
    try { return sessionStorage.getItem(KEY) === '1' ? m[1] : null; } catch (e) { return null; }
  }

  var css = '#zop{margin:0 0 18px;border-radius:16px;overflow:hidden;border:2px solid #14b8a6;background:#f0fdfa}' +
    '#zop .zop-h{background:#14b8a6;color:#fff;font-weight:800;font-size:17px;text-align:center;padding:10px 8px}' +
    '#zop .zop-h small{display:block;font-weight:600;font-size:13px;opacity:.95;margin-top:2px}' +
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
    '#zop #zop-go{display:none;text-align:center;color:#f97316;font-weight:800;font-size:14px;padding:0 0 12px;text-decoration:underline}' +
    '#zop.zop-pp{margin:18px 0 0}#zop.zop-pp .zop-g{grid-template-columns:repeat(2,1fr)}' +
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
  function refreshCart() {
    try {
      var el = document.querySelector('header') || document.querySelector('.category_products_grid_container');
      var fk = el && Object.keys(el).filter(function (k) { return k.indexOf('__reactFiber') === 0; })[0];
      for (var f = fk && el[fk]; f; f = f.return) {
        var c = f.memoizedProps && f.memoizedProps.client;
        if (c && c.invalidateQueries) { c.invalidateQueries({ queryKey: ['cart-items'] }); return; }
      }
    } catch (e) {}
  }

  // Same call the theme's own "add to cart" makes; the cart page reads it from the server.
  function addToCart(btn) {
    var gid = guestId();
    if (!gid) { location.href = btn.parentNode.querySelector('a').getAttribute('href'); return; }
    btn.disabled = true;
    btn.textContent = '...';
    fetch('https://api.easy-orders.net/api/v1/cart-items/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: btn.getAttribute('data-id'), quantity: 1, guest_id: gid })
    }).then(function (r) {
      if (!r.ok) throw 0;
      added[btn.getAttribute('data-id')] = 1;
      refreshCart();
      btn.textContent = '✓ اتضاف للسلة';
      btn.className = 'zop-c zop-ok';
      var go = document.getElementById('zop-go');
      if (go) go.style.display = 'block';
      // Like the theme's own button: open the side cart once the refreshed items are in.
      setTimeout(openCart, 700);
    }).catch(function () {
      btn.textContent = 'أضف للسلة';
    }).then(function () {
      setTimeout(function () { btn.disabled = false; }, 600);
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('#zop .zop-c');
    if (btn) { e.preventDefault(); addToCart(btn); return; }
    if (e.target.closest && e.target.closest('#zop-go')) { e.preventDefault(); openCart(); }
  });

  // A full load of /cart 404s on this theme, so open it through the header cart button.
  function openCart() {
    var cart = [].filter.call(document.querySelectorAll('header button, button'), function (b) {
      return /items in cart/i.test(b.textContent);
    })[0];
    if (cart) cart.click(); else location.href = '/';
  }

  function tick() {
    var box = document.getElementById('zop');
    var slug = pageSlug();
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
    if (!document.getElementById('zop-css')) {
      var st = document.createElement('style');
      st.id = 'zop-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    box = document.createElement('div');
    box.id = 'zop';
    if (slug) box.className = 'zop-pp';
    box.innerHTML = '<div class="zop-h">' + title + '<small>اشتري 2 والتالتة هدية 🎁 والشحن مجاني 🚚</small></div>' +
      '<div class="zop-g">' + list.map(card).join('') + '</div>' +
      '<a id="zop-go" href="/cart"' + (Object.keys(added).length ? ' style="display:block"' : '') + '>كمّل الطلب من السلة ←</a>';
    if (slug) anchor.parentNode.insertBefore(box, anchor.nextSibling);
    else anchor.parentNode.insertBefore(box, anchor);
  }

  setInterval(tick, 700);
  tick();
})();
