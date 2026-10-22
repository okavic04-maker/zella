/* Zella Store: show the perfumes inside a bundle as image cards, each one links to its product page.
   To add a bundle: add a line to BUNDLES with the bundle slug and the slugs of its perfumes.
   Also in the cart: products from the Bundle Offers section get "عرض الباندل" instead of "خارج العرض"
   (that tag comes from the Buy-2-get-1 script in the head code, which is at the store's size limit).
   When the cart holds bundles only, the Buy-2-get-1 progress bar shows the bundle offer as already done, in green. */
(function () {
  var API = 'https://api.easy-orders.net/api/v1/';
  var LABELS = ['النوع الأول', 'النوع التاني', 'النوع التالت', 'النوع الرابع'];
  var BUNDLES = {
    'bundle-2plus1-orchid-bleu-eros': [
      { s: 'orcblack', n: 'Tom Ford Black Orchid' },
      { s: 'bleuchanel', n: 'Bleu de Chanel EDP' },
      { s: 'VersaceErosEaudeParfum', n: 'Versace Eros EDP', gift: true }
    ],
    'bundle2-999111': [
      { s: 'sauvagehigh', n: 'Dior Sauvage EDP' },
      { s: 'sexyman', n: '212 Sexy Men' },
      { s: 'VersaceErosEaudeParfum', n: 'Versace Eros EDP', gift: true }
    ],
    'bundle23-1000': [
      { s: 'bvg', n: 'Bvlgari Man in Black' },
      { s: 'sauvel', n: 'Sauvage Elixir' }
    ]
  };
  var thumbs = {};

  var css = ''
    + '#zbt{margin-top:16px}'
    + '#zbt .r{margin-bottom:14px}'
    + '#zbt h2{font-size:16px;font-weight:700;color:#111;margin:0 0 8px}'
    + '#zbt h2 span{font-weight:700}'
    + '#zbt .g{display:inline-block;background:#d62d1f;color:#fff;font-size:11px;border-radius:10px;padding:2px 8px;margin-right:6px;vertical-align:middle}'
    + '#zbt a{position:relative;display:block;width:120px;height:120px;border:2px solid #111;border-radius:14px;overflow:hidden;background:#000}'
    + '#zbt img{width:100%;height:100%;object-fit:cover;display:block}'
    + '#zbt a i{position:absolute;bottom:4px;left:4px;background:#000;color:#fff;font-style:normal;font-size:10px;font-weight:700;border-radius:12px;padding:2px 7px}'
    + '#zbt .h{font-size:12px;color:#9ca3af;margin-top:-4px}'
    + '[data-zbt-bundle] .zb-tag-out{display:none}'
    + '.zbt-cart{margin-top:6px;font-size:12px}'
    + '.zbt-cart span{display:inline-block;background:#16a34a;color:#fff;border-radius:4px;padding:2px 8px;font-weight:700}'
    + '[data-zbt-all] #zella-bogo-bar .zb-msg,[data-zbt-all] #zella-bogo-bar .zb-progress{display:none}'
    + '#zbt-bar{margin:0 0 8px;padding:12px 14px 4px;border:1px solid #bbf7d0;border-radius:12px;background:#f0fdf4;text-align:center}'
    + '#zbt-bar p{margin:0 0 10px;font-size:14px;font-weight:700;color:#15803d}'
    + '#zbt-bar .tr{position:relative;height:8px;margin:0 12px 14px;border-radius:8px;background:#16a34a}'
    + '#zbt-bar .tr i{position:absolute;top:50%;width:24px;height:24px;margin:-12px -12px 0 0;border-radius:50%;background:#16a34a;color:#fff;font-size:12px;font-style:normal;font-weight:700;line-height:24px}';

  function slug() { var m = location.pathname.match(/^\/products\/([^\/?#]+)/); return m && decodeURIComponent(m[1]); }

  function loadThumbs(list, done) {
    var need = list.filter(function (p) { return !thumbs[p.s]; });
    if (!need.length) return done();
    fetch(API + 'products?limit=10&fields=slug,thumb&filter=slug||$in||' + need.map(function (p) { return p.s; }).join(','))
      .then(function (r) { return r.json(); })
      .then(function (j) { (j.data || j || []).forEach(function (p) { thumbs[p.slug] = p.thumb; }); done(); })
      .catch(done);
  }

  function render() {
    var s = slug(), list = s && BUNDLES[s], old = document.getElementById('zbt');
    if (!list) { if (old) old.remove(); return; }
    var hs = document.querySelectorAll('h2.variation_name');
    if (!hs.length) return;
    var blocks = [].map.call(hs, function (x) { return x.parentElement.parentElement; }); // the bundle's options (one or more), already selected
    var block = blocks[blocks.length - 1];
    if (old && old.dataset.s === s && block.style.display === 'none') return;
    if (old) old.remove();
    blocks.forEach(function (b) { b.style.display = 'none'; });
    var el = document.createElement('div');
    el.id = 'zbt'; el.dataset.s = s;
    el.innerHTML = list.map(function (p, i) {
      return '<div class="r"><h2>' + LABELS[i] + ': <span>' + p.n + '</span>' + (p.gift ? '<b class="g">🎁 هدية</b>' : '') + '</h2>'
        + '<a href="/products/' + p.s + '" target="_blank" rel="noopener">'
        + (thumbs[p.s] ? '<img src="' + thumbs[p.s] + '" alt="' + p.n + '">' : '') + '<i>التفاصيل ↗</i></a></div>';
    }).join('') + '<p class="h">اضغط على صورة أي نوع تشوف صفحته وتفاصيل ريحته</p>';
    block.parentElement.insertBefore(el, block.nextSibling);
  }

  var isBundle = {};
  function bundleOf(s) { // same product data the store's cart script reads
    if (isBundle[s] !== undefined) return Promise.resolve(isBundle[s]);
    var build = window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId;
    if (!build) return Promise.resolve(false);
    return isBundle[s] = fetch('/_next/data/' + build + '/products/' + encodeURIComponent(s) + '.json?id=' + encodeURIComponent(s))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var cats = (j && j.pageProps && j.pageProps.product && j.pageProps.product.categories) || [];
        return isBundle[s] = cats.some(function (c) { return c.slug === 'savingspackagesoffers'; });
      })
      .catch(function () { delete isBundle[s]; return false; });
  }
  // the store's cart script rewrites its own tag, so we hide it and add our label next to it
  function fixCartTags() {
    [].slice.call(document.querySelectorAll('[data-cart="item"]')).forEach(function (li) {
      if (li.hasAttribute('data-zbt-bundle') || !li.querySelector('.zb-tag-out')) return;
      var a = li.querySelector('a[href*="/products/"]'), host = li.querySelector('[data-cart="item-info"]');
      if (!a || !host) return;
      var s = decodeURIComponent(a.getAttribute('href').split('/products/')[1].split(/[?#]/)[0]);
      bundleOf(s).then(function (yes) {
        if (!yes || !li.isConnected || li.hasAttribute('data-zbt-bundle')) return;
        li.setAttribute('data-zbt-bundle', '');
        var tag = document.createElement('div');
        tag.className = 'zbt-cart'; tag.innerHTML = '<span>🎁 عرض الباندل</span>';
        host.appendChild(tag);
      });
    });
    bundleBar();
  }
  function bundleBar() {
    var bar = document.getElementById('zella-bogo-bar'), mine = document.getElementById('zbt-bar');
    var items = [].slice.call(document.querySelectorAll('[data-cart="item"]'));
    var section = bar && bar.parentElement;
    function off() { if (mine) mine.remove(); if (section) section.removeAttribute('data-zbt-all'); }
    if (!bar || !items.length) return off();
    Promise.all(items.map(function (li) {
      var a = li.querySelector('a[href*="/products/"]');
      return a ? bundleOf(decodeURIComponent(a.getAttribute('href').split('/products/')[1].split(/[?#]/)[0])) : false;
    })).then(function (all) {
      if (!all.every(Boolean)) return off();
      section.setAttribute('data-zbt-all', '');
      if (document.getElementById('zbt-bar')) return;
      var el = document.createElement('div');
      el.id = 'zbt-bar';
      el.innerHTML = '<p>🎁 عرض الباندل مفعّل — الخصم محسوب في السعر</p><div class="tr">'
        + [1, 2, 3].map(function (n) { return '<i style="right:' + (n * 100 / 3) + '%">✓</i>'; }).join('') + '</div>';
      bar.parentElement.insertBefore(el, bar);
    });
  }

  var t;
  function schedule() {
    clearTimeout(t);
    t = setTimeout(function () {
      fixCartTags();
      var list = BUNDLES[slug()];
      if (list) loadThumbs(list, render); else render();
    }, 120);
  }
  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    schedule();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
