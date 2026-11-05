/* Zella — free-shipping bar shows the 1500 EGP threshold.
   The store setting stays 2000 on purpose (EasyOrders checks the total before the BOGO discount, the customer
   sees ~1500 after it). The theme's line "أنت على بُعد X ج.م فقط من الشحن المجاني" is scaled by 3/4, so 2000 shows
   as 1500 and it reaches 0 exactly when shipping really turns free. Only the text node with the number is changed
   (the currency is a child span). bogo.js copies the already-fixed text into #zella-bogo-bar on its next redraw. */
(function () {
  var RATIO = 1500 / 2000;
  var NUM = /^(\s*)([\d,]+(?:\.\d+)?)(\s*)$/; // React puts the number in its own text node
  var mine = new WeakMap(); // text node -> the text we wrote, so we never scale twice
  function run() {
    document.querySelectorAll('span.font-bold').forEach(function (el) {
      if (!/الشحن المجاني/.test(el.textContent)) return;
      el.childNodes.forEach(function (tn) {
        if (tn.nodeType !== 3 || mine.get(tn) === tn.nodeValue) return;
        var m = tn.nodeValue.match(NUM);
        if (!m) return;
        var n = parseFloat(m[2].replace(/,/g, ''));
        if (isNaN(n)) return;
        var out = m[1] + Math.ceil(n * RATIO) + m[3];
        mine.set(tn, out);
        tn.nodeValue = out;
      });
    });
  }
  var t;
  new MutationObserver(function () { if (t) return; t = setTimeout(function () { t = 0; run(); }, 60); })
    .observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  run();
})();
