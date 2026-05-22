const CACHE = 'bingo-v1';
const SHELL = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); });
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => {
    const fresh = fetch(e.request).then(r => { if(r.ok) caches.open(CACHE).then(c=>c.put(e.request,r.clone())); return r; });
    return cached || fresh;
  }));
});
