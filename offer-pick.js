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

  var css = '#zop{margin:0 0 18px;border-radius:16px;overflow:hidden;border:2px solid #14b8a6;background:#f0fdfa}' +
    '#zop .zop-h{background:#14b8a6;color:#fff;font-weight:800;font-size:17px;text-align:center;padding:10px 8px}' +
    '#zop .zop-h small{display:block;font-weight:600;font-size:13px;opacity:.95;margin-top:2px}' +
    '#zop .zop-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px}' +
    '#zop a{display:flex;flex-direction:column;background:#fff;border-radius:12px;overflow:hidden;text-decoration:none;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.08)}' +
    '#zop img{width:100%;aspect-ratio:1/1;object-fit:contain;background:#fff}' +
    '#zop .zop-n{font-size:12px;font-weight:700;line-height:1.3;padding:6px 6px 0;min-height:32px;text-align:center}' +
    '#zop .zop-p{text-align:center;padding:4px 4px 8px}' +
    '#zop .zop-p b{color:#f97316;font-size:17px;font-weight:900}' +
    '#zop .zop-p s{color:#999;font-size:11px;margin-inline-start:4px}' +
    '#zop .zop-c{display:block;margin:0 6px 8px;background:#f97316;color:#fff;font-size:12px;font-weight:800;text-align:center;border-radius:8px;padding:6px 0}' +
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
    return '<a href="/products/' + p.slug + '">' +
      '<img src="' + p.thumb + '" alt="" loading="eager">' +
      '<div class="zop-n">' + p.name + '</div>' +
      '<div class="zop-p"><b>' + price + ' ج.م</b>' + (p.sale_price && p.price > p.sale_price ? '<s>' + p.price + '</s>' : '') + '</div>' +
      '<span class="zop-c">اطلب البرفيوم</span></a>';
  }

  function tick() {
    var box = document.getElementById('zop');
    if (!active()) { if (box) box.remove(); return; }
    load();
    if (!products || !products.length) return;
    var grid = document.querySelector('.category_products_grid_container');
    if (!grid) return;
    if (box && box.nextElementSibling === grid) return;
    if (box) box.remove();
    if (!document.getElementById('zop-css')) {
      var st = document.createElement('style');
      st.id = 'zop-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    box = document.createElement('div');
    box.id = 'zop';
    box.innerHTML = '<div class="zop-h">🎬 البرفيومات اللي في الفيديو<small>اشتري 2 والتالتة هدية 🎁</small></div>' +
      '<div class="zop-g">' + products.map(card).join('') + '</div>';
    grid.parentNode.insertBefore(box, grid);
  }

  setInterval(tick, 700);
  tick();
})();
