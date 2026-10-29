// Zella: قسم "وصلت حديثا" في الرئيسية يعرض أحدث البرفانات تلقائي (من غير الباندلز والمخفي؛ اللي خلص من المخزون بيظهر "نفذ المخزون" ويرجع عادي لما المخزون يرجع)
(function(){
var TITLES = /^(وصلت حديثا|New Arrivals)$/;
var BUNDLES = '83a341ea-2ab6-4ed3-82e8-0ff3b60b3f19';
var API = 'https://api.easy-orders.net/api/v1/';
var list = null, qc = null, t = 0;
function guest(){ try { return JSON.parse(localStorage.getItem('guest-id')).state||{}; } catch (e){ return {}; } }
function hdr(g){ return { 'Accept': 'application/json', 'currencyId': g.currencyId, 'Currency-Id': g.currencyId }; }
function get(url){ return fetch(url, { headers: hdr(guest()) }).then(function(r){ return r.ok ? r.json() : null; }); }
function load(){
if (list) return list;
list = Promise.all([
get(API + 'products?limit=500&page=1&fields=id,name,price,sale_price&category_id=' + BUNDLES),
get(API + 'products?limit=60&page=1&sort=created_at&order=desc&fields=id,name,slug,thumb,price,sale_price,hidden,quantity,track_stock,disable_orders_for_no_stock')
]).then(function(r){
var skip = {};
((r[0]&&r[0].data)||[]).forEach(function(p){ skip[p.id] = 1; });
return ((r[1]&&r[1].data)||[]).filter(function(p){
p.out = p.track_stock&&p.disable_orders_for_no_stock&&p.quantity <= 0;
return !p.hidden&&!skip[p.id];
});
}).catch(function(){ list = null; return []; });
return list;
}
function section(){
var title = [].filter.call(document.querySelectorAll('h1,h2,h3,span'), function(e){ return !e.children.length&&TITLES.test(e.textContent.trim()); })[0];
var s = title;
for (var i = 0; s&&i < 8; i++){
if (s.querySelectorAll('.home_grid_section_card').length > 1) return s;
s = s.parentElement;
}
return null;
}
function setText(el, text){
if (!el) return;
var n = el.firstChild;
if (n&&n.nodeType===3){ if (n.textContent!==String(text)) n.textContent = text; }
else el.insertBefore(document.createTextNode(text), el.firstChild);
}
function fill(card, p){
if (card.getAttribute('data-zna')===p.id) return;
card.setAttribute('data-zna', p.id);
var price = p.sale_price||p.price, old = p.sale_price ? p.price : 0;
card.querySelectorAll('a[href*="/products/"]').forEach(function(a){ a.setAttribute('href', '/products/' + p.slug); a.setAttribute('title', p.name); });
var img = card.querySelector('img');
if (img){ img.removeAttribute('srcset'); img.src = p.thumb; img.alt = p.name; }
var h = card.querySelector('h2,h3');
if (h) h.textContent = p.name;
var box = h&&h.nextElementSibling;
var now = box&&box.querySelector('span'), del = box&&box.querySelector('del');
setText(now, price);
// الكارت الأصلي ممكن ميكونش فيه سعر قديم أو بادج خصم، فنعملهم
if (!del&&old&&box&&now){
del = document.createElement('del');
del.className = 'font-normal text-[#61758A] opacity-60 text-sm md:text-base flex items-center gap-1';
del.appendChild(document.createTextNode(''));
if (now.lastElementChild) del.appendChild(now.lastElementChild.cloneNode(true));
box.appendChild(del);
}
if (del){ del.style.display = old ? '' : 'none'; if (old) setText(del, old); }
var badge = card.querySelector('span.absolute.top-1');
if (!badge&&old){
badge = document.createElement('span');
badge.className = 'absolute top-1 right-1 rounded-[19px] bg-red-500 px-4 py-2 leading-none text-sm text-white font-bold';
badge.setAttribute('dir', 'ltr');
(h&&h.parentElement ? h.parentElement.parentElement : card).insertBefore(badge, h ? h.parentElement : null);
}
if (badge){
badge.style.display = old ? '' : 'none';
if (old) badge.textContent = '-' + Math.round((old - price) / old * 100) + '%';
}
// اللي خلص من المخزون يظهر بزرار مقفول
var btn = card.querySelector(':scope > button');
if (btn){
if (!btn.hasAttribute('data-zt')) btn.setAttribute('data-zt', btn.textContent.trim());
var ar = /[؀-ۿ]/.test(btn.getAttribute('data-zt'));
btn.textContent = p.out ? (ar ? 'نفذ المخزون' : 'Out of Stock') : (/نفذ|out of stock/i.test(btn.getAttribute('data-zt')) ? (ar ? 'أضف للسلة' : 'Add to Cart') : btn.getAttribute('data-zt'));
btn.disabled = !!p.out;
btn.style.opacity = p.out ? '0.5' : '';
}
}
function draw(){
var s = section();
if (!s) return;
load().then(function(items){
var cards = s.querySelectorAll('.home_grid_section_card');
if (!items.length) return;
cards.forEach(function(c, i){
var p = items[i];
if (!p){ c.style.display = 'none'; return; }
c.style.display = '';
fill(c, p);
});
});
}
// زرار "أضف للسلة" في الكروت دي يضيف المنتج الجديد مش القديم
function findQC(){
if (qc) return qc;
var root = document.getElementById('__next');
var key = root&&Object.keys(root).filter(function(k){ return k.indexOf('__reactContainer')===0; })[0];
var f = key&&root[key];
if (f&&f.stateNode&&f.stateNode.current) f = f.stateNode.current;
var stack = [f], n = 0;
while (stack.length&&n < 5000){
var x = stack.pop(); n++;
if (!x) continue;
var pr = x.memoizedProps;
if (pr&&pr.client&&typeof pr.client.invalidateQueries==='function'){ qc = pr.client; break; }
if (x.child) stack.push(x.child);
if (x.sibling) stack.push(x.sibling);
}
return qc;
}
document.addEventListener('click', function(e){
var btn = e.target.closest&&e.target.closest('.home_grid_section_card[data-zna] > button');
if (!btn) return;
e.preventDefault(); e.stopPropagation();
var card = btn.parentElement, id = card.getAttribute('data-zna');
var href = card.querySelector('a[href*="/products/"]').getAttribute('href');
var g = guest();
if (!g.guestId){ location.href = href; return; }
btn.disabled = true;
fetch(API + 'cart-items/guest', {
method: 'POST',
headers: Object.assign({ 'Content-Type': 'application/json' }, hdr(g)),
body: JSON.stringify({ product_id: id, quantity: 1, guest_id: g.guestId })
}).then(function(r){
if (!r.ok) throw new Error(r.status);
var c = findQC();
if (c) c.invalidateQueries({ queryKey: ['cart-items'] });
setTimeout(function(){
var b = [].filter.call(document.querySelectorAll('nav button, header button'), function(x){ return /items in cart/.test(x.innerText); })[0];
if (b&&!document.querySelector('[data-cart="items-section"]')) b.click();
}, 400);
}).catch(function(){ location.href = href; })
.then(function(){ btn.disabled = false; });
}, true);
function start(){
new MutationObserver(function(){ if (t) return; t = setTimeout(function(){ t = 0; draw(); }, 200); }) // يشتغل كل 200ms على الأقل حتى لو الصفحة لسه بتتغير.observe(document.body, { childList: true, subtree: true });
draw();
}
var gone;
function go(){ // نبدأ أول ما React يمسك الصفحة (أو عند التحميل) علشان منبوظش أول رسم ليه
if (gone) return;
var m = document.querySelector('main');
if (document.readyState==='complete'||(m&&Object.keys(m).some(function(k){ return k.indexOf('__reactFiber')===0; }))){ gone = 1; setTimeout(start, 30); }
else setTimeout(go, 50);
}
go();
})();
