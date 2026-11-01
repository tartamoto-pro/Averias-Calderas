const V="averias-v2",F=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
if(e.request.method!=="GET")return;
/* Los PDF los gestiona el navegador directamente (sin pasar por el service worker) */
if(/\.pdf($|\?)/i.test(e.request.url)||e.request.headers.has("range"))return;
e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.status===200){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp)).catch(()=>{})}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))))});
