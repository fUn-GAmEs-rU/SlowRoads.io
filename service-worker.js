const CACHE_VERSION = "cache-1740770437175";
const FILES = [
  "app.e972eff3.js",
  "0.e1749fc5.js",
  "1.033497dd.js",
  "2.f5ef3045.css",
  "2.8410b8f1.js",
  "auto_on.da4fbe10.mp3",
  "auto_off.dc550416.mp3",
  "coupe_main_new.53837d9a.obj",
  "coupe_wheel.a5e44cdf.obj",
  "coupe_interior.6ee6e82e.obj",
  "coupe_dash.c2d78df2.obj",
  "coupe_steering.4443a960.obj",
  "coupe_map.76d2e800.jpg",
  "coupe_window.cee5417c.webp",
  "coach_main.9fa80d57.obj",
  "coach_interior.10318910.obj",
  "coach_window.b801ee83.webp",
  "bike_main.c972f06f.obj",
  "bike_interior.a5fd5b53.obj",
  "bike_wheel.15deee9d.obj",
  "bike_window.9bc8bd2b.webp",
  "coupe_boost.5c7ff2f7.mp3",
  "brake.fe62943d.mp3",
  "roll_tarmac_01.946ae363.mp3",
  "roll_tarmac_int.e8cc8d26.mp3",
  "hit_01.9e9c259f.mp3",
  "hit_01_int.c2f91a7b.mp3",
  "skid_tarmac.a73c8b33.mp3",
  "scrape_metal.417cfe49.mp3",
  "grass.4bda3c44.webp",
  "spring_imposters_0_d.fac9b679.webp",
  "index.85bbc95f.js",
  "scheduler.6cda8fd7.js",
  "favicon.png",
  "manifest.json",
  "5CBE07E9.png",
  "alea.min.js",
  "favicon.svg",
  "Sono.ttf",
  "Space.ttf",
  "icon.svg",
  "icon_steam_white.svg",
  "logo-stacked.svg",
  "topo-square-light.webp"
];

// Turn all paths into absolute, normalized paths like "/filename.ext"
const RESOURCES = FILES.map(path => `/${path.replace(/^\/+/, '')}`);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache =>
      Promise.all(
        RESOURCES.map(path =>
          cache.add(path).catch(err => {
            console.warn(`[ServiceWorker] Failed to cache: ${path}`, err);
          })
        )
      )
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_VERSION) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestPath = new URL(event.request.url).pathname;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async cache => {
      const match = await cache.match(requestPath);
      if (match) return match;

      try {
        const response = await fetch(event.request);
        if (response.status === 200) {
          cache.put(requestPath, response.clone());
        }
        return response;
      } catch (err) {
        return cache.match(requestPath);
      }
    })
  );
});
