// Zella: إضافة خصم الباندلز في صفحة إتمام الطلب وصفحة الشكر (وفّرت مع العرض + السعر المشطوب)
(function(){
var CAT = '83a341ea-2ab6-4ed3-82e8-0ff3b60b3f19';
var API = 'https://api.easy-orders.net/api/v1/';
var diffs = null, bs = 0, at = 0, busy = false;
function guest(){ try { return JSON.parse(localStorage.getItem('guest-id')).state||{}; } catch (e){ return {}; } }
function get(url, g){
return fetch(url, { headers: { 'Accept': 'application/json', 'currencyId': g.currencyId, 'Currency-Id': g.currencyId } })
.then(function(r){ return r.ok ? r.json() : null; });
}
function money(n){ return Math.round(n).toLocaleString('en-US') + ' ج.م'; }
function num(el){ return el ? parseFloat(el.textContent.replace(/[^\d.]/g, ''))||0 : 0; }
function refresh(){
var g = guest();
if (busy||!g.guestId) return;
busy = true;
if (!diffs) diffs = get(API + 'products?limit=500&page=1&fields=id,price,sale_price&category_id=' + CAT, g).then(function(j){
var m = {};
((j&&j.data)||[]).forEach(function(p){ if (p.sale_price&&p.price > p.sale_price) m[p.id] = p.price - p.sale_price; });
return m;
}).catch(function(){ diffs = null; return {}; });
Promise.all([diffs, get(API + 'cart-items/guest?guest_id=' + g.guestId, g)]).then(function(r){
var items = Array.isArray(r[1]) ? r[1] : [];
bs = items.filter(function(i){ return i.in_cart!==false; }).reduce(function(s, i){ return s + (r[0][i.product_id]||0) * (i.quantity||0); }, 0);
at = Date.now(); busy = false; draw();
}).catch(function(){ busy = false; });
}
function setVal(el, text){
if (!el) return;
el.classList.toggle('zb-wv', !!text);
if (text&&el.getAttribute('data-zw')!==text) el.setAttribute('data-zw', text);
}
function draw(){
// وفّرت مع العرض: نزود خصم الباندل على خصم EasyOrders
var native = document.querySelectorAll('[data-invoice="invoice-total-savings"], [data-invoice="checkout-mobile-total-savings"]');
native.forEach(function(s){
var v = s.lastElementChild;
if (v&&v!==s.firstElementChild) setVal(v, bs > 0 ? money(num(v) + bs) : '');
});
document.querySelectorAll('.zcx-sav').forEach(function(x){ if (native.length||bs <= 0) x.remove(); });
if (!native.length&&bs > 0){
document.querySelectorAll('[data-invoice="invoice-total"]').forEach(function(t){
if (t.parentElement.querySelector('.zcx-sav')) return;
var d = document.createElement('div');
d.className = 'zcx-sav flex items-center gap-1.5 text-sm font-bold text-gray-900 mt-1';
t.insertAdjacentElement('afterend', d);
});
var mob = document.querySelector('.checkout_mobile_total_toggle > span:last-child');
if (mob&&mob.textContent.trim()&&!mob.querySelector('.zcx-sav')){
var d2 = document.createElement('span');
d2.className = 'zcx-sav flex items-center gap-1.5 text-xs font-bold mt-1';
mob.appendChild(d2);
}
var html = '<span>🎁 وفّرت مع العرض</span><span>' + money(bs) + '</span>';
document.querySelectorAll('.zcx-sav').forEach(function(x){ if (x.innerHTML!==html) x.innerHTML = html; });
}
// السعر المشطوب في ملخص الطلب
var box = document.querySelector('#checkout-order-summary-toggle > span:last-child');
if (!box) return;
var struck = box.querySelector('.line-through:not(.zcx-was)');
var own = box.querySelector('.zcx-was');
if (struck){
if (own) own.remove();
setVal(struck, bs > 0 ? money(num(struck) + bs) : '');
} else if (bs > 0){
var c = box.cloneNode(true), o = c.querySelector('.zcx-was');
if (o) o.remove();
var text = money(num(c) + bs);
if (!own){ own = document.createElement('span'); own.className = 'zcx-was'; box.insertBefore(own, box.firstChild); }
if (own.textContent!==text) own.textContent = text;
} else if (own) own.remove();
}
// صفحة الشكر: نحسب خصم الباندل من المنتجات المكتوبة في الطلب
var names = null;
function drawThanks(){
var g = guest();
if (!names) names = get(API + 'products?limit=500&page=1&fields=id,name,price,sale_price&category_id=' + CAT, g).then(function(j){
var m = {};
((j&&j.data)||[]).forEach(function(p){ if (p.sale_price&&p.price > p.sale_price) m[p.name.trim()] = p.price - p.sale_price; });
return m;
}).catch(function(){ names = null; return {}; });
names.then(function(m){
var save = 0;
document.querySelectorAll('h4').forEach(function(h){
var d = m[h.textContent.trim()];
if (!d) return;
var q = [].filter.call(h.parentElement.querySelectorAll('p'), function(p){ return /عدد القطع/.test(p.textContent); })[0];
save += d * (q ? num(q)||1 : 1);
});
if (save <= 0) return;
var dts = [].slice.call(document.querySelectorAll('dt'));
var subDt = dts.filter(function(d){ return /اجمالي المنتجات/.test(d.textContent); })[0];
var shipDt = dts.filter(function(d){ return /تكلفة الشحن/.test(d.textContent); })[0];
var totDt = dts.filter(function(d){ return /^\s*الاجمالي/.test(d.textContent); })[0];
if (!subDt||!totDt) return;
setVal(subDt.lastElementChild, money(num(subDt.lastElementChild) + save));
var row = document.querySelector('.zcx-row');
if (!row){
var grp = dts.filter(function(d){ return d.textContent.trim()==='خصم المنتجات'; })[0];
grp = grp ? grp.parentElement : null;
if (!grp){
grp = document.createElement('div');
grp.className = 'space-y-1';
grp.innerHTML = '<dt class="text-gray-500">خصم المنتجات</dt>';
(shipDt||subDt).insertAdjacentElement('afterend', grp);
}
row = document.createElement('dt');
row.className = 'zcx-row flex flex-wrap justify-between';
grp.appendChild(row);
}
var html = '<span class="flex items-center gap-1 text-sm text-gray-400">🎁 عرض الباندل</span><div class="flex items-center gap-1">- ' + money(save) + '</div>';
if (row.innerHTML!==html) row.innerHTML = html;
var sv = document.querySelector('[data-invoice="invoice-total-savings"]');
if (sv){
var l = sv.firstElementChild;
if (sv.lastElementChild!==l) setVal(sv.lastElementChild, money(num(sv.lastElementChild) + save));
} else if (!document.querySelector('.zcx-tsav')){
var d2 = document.createElement('div');
d2.className = 'zcx-tsav zcx-sav flex items-center gap-1.5 text-sm font-bold text-gray-900';
d2.innerHTML = '<span>🎁 وفّرت مع العرض</span><span>' + money(save) + '</span>';
totDt.insertAdjacentElement('afterend', d2);
}
});
}
var st = document.createElement('style');
st.textContent = '.zcx-was{font-size:14px;color:#6b7280;text-decoration:line-through;font-weight:400;margin-inline-end:8px}.zcx-sav span:last-child{color:#16a34a}';
document.head.appendChild(st);
var t = 0;
function tick(){
if (location.pathname.indexOf('/thanks')===0) return drawThanks();
if (location.pathname.indexOf('/checkout')!==0) return;
if (Date.now() - at > 3000) refresh(); else draw();
}
function start(){
new MutationObserver(function(){ clearTimeout(t); t = setTimeout(tick, 150); }).observe(document.body, { childList: true, subtree: true, characterData: true });
tick();
}
function go(){ setTimeout(start, 300); } // نبدأ بعد ما الصفحة تخلص تحميل علشان منبوظش أول رسم لـ React
if (document.readyState==='complete') go(); else addEventListener('load', go);
})();
