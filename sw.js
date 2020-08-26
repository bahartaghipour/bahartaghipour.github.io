var cacheVersion = '3';
var filesToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/favicon.ico'
];
currentCache = {
  static: "static-cache-v" + cacheVersion,
  dynamic: "dynamic-cache-v" + cacheVersion
}
/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(currentCache['static']).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', e => {
  let expectedCacheNames = Object.values(currentCache);
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.forEach(cacheName => {
          if(! expectedCacheNames.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  console.log(e);
  e.respondWith(
    // caches.open(currentCache['dynamic']).then(cache => {
    //   return cache.match(e.request).then(response => {
    //     if(response)
    //     return response;
    //     return fetch(e.request).then(networkResponse => {
    //       cache.put(e.request, networkResponse.clone());
    //       return networkResponse;
    //     });
    //   });
    // })
    caches.match(e.request).then(response => {
      if(response) return response;
      return fetch(e.request).then(networkResponse => {
        caches.open(currentCache['dynamic']).then(cache => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        })
      })
    })
  );
});
