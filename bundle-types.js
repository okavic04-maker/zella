/* Zella Store: show the perfumes inside a bundle as image cards, each one links to its product page.
   To add a bundle: add a line to BUNDLES with the bundle slug and the slugs of its perfumes. */
(function () {
  var API = 'https://api.easy-orders.net/api/v1/';
  var LABELS = ['النوع الأول', 'النوع التاني', 'النوع التالت', 'النوع الرابع'];
  var BUNDLES = {
    'bundle-2plus1-orchid-bleu-eros': [
      { s: 'orcblack', n: 'Tom Ford Black Orchid' },
      { s: 'bleuchanel', n: 'Bleu de Chanel EDP' },
      { s: 'VersaceErosEaudeParfum', n: 'Versace Eros EDP', gift: true }
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
    + '#zbt .h{font-size:12px;color:#9ca3af;margin-top:-4px}';

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
    var h = document.querySelector('h2.variation_name');
    if (!h) return;
    var block = h.parentElement.parentElement; // the "محتوى العرض" option, already selected
    if (old && old.dataset.s === s && block.style.display === 'none') return;
    if (old) old.remove();
    block.style.display = 'none';
    var el = document.createElement('div');
    el.id = 'zbt'; el.dataset.s = s;
    el.innerHTML = list.map(function (p, i) {
      return '<div class="r"><h2>' + LABELS[i] + ': <span>' + p.n + '</span>' + (p.gift ? '<b class="g">🎁 هدية</b>' : '') + '</h2>'
        + '<a href="/products/' + p.s + '" target="_blank" rel="noopener">'
        + (thumbs[p.s] ? '<img src="' + thumbs[p.s] + '" alt="' + p.n + '">' : '') + '<i>التفاصيل ↗</i></a></div>';
    }).join('') + '<p class="h">اضغط على صورة أي نوع تشوف صفحته وتفاصيل ريحته</p>';
    block.parentElement.insertBefore(el, block.nextSibling);
  }

  var t;
  function schedule() {
    clearTimeout(t);
    t = setTimeout(function () {
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
