// Verzió: az adatok vagy a kód módosításakor növeld, hogy a telefonok frissítsenek.
const V = 'kv-1';
const PRE = ['./', 'index.html', 'kutyafajtak.json', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(PRE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  const put = x => { if (x.ok) { const c = x.clone(); caches.open(V).then(h => h.put(r, c)); } return x; };
  if (/\.json$|\.html$|\/$/.test(u.pathname)) {
    // Kód és adat: előbb a hálózat (friss), offline a tárolt példány.
    e.respondWith(fetch(r).then(put).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
  } else {
    // Képek és egyebek: előbb a tárolt példány.
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(put)));
  }
});
