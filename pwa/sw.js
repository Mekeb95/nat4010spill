/* Service worker for Nøkkelvokteren. Spillet er én HTML-fil; den caches slik at appen virker uten nett.
   Navigasjon: nett først (så nye versjoner kommer straks), cache som reserve. Skriftene er selvhostet og forhåndscaches. */
const VERSION = '__VERSION__';
const CORE = 'nv-core-' + VERSION;
const FONTS = 'nv-fonts-v1'; // eldre versjoner hentet skrifter fra Google; cachen ryddes ved aktivering
const PRECACHE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './icon.svg', '__FONTS__'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CORE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => (k.startsWith('nv-core-') && k !== CORE) || k === FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Nett først (nye versjoner kommer straks), men ikke heng på svakt nett: etter 3 s brukes cachen.
    const net = fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CORE).then((c) => c.put('./index.html', copy)); }
      return res;
    });
    const slow = new Promise((r) => setTimeout(r, 3000)).then(() => caches.match('./index.html'));
    e.respondWith(
      Promise.race([net.catch(() => caches.match('./index.html')), slow.then((hit) => hit || net)])
        .then((res) => res || net)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
