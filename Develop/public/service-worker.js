const FILES_TO_CACHE = ["/", "index.js", "styles.css", "db.js"];

const CACHE_NAME = "static-cashe-v2";

const DATA_CACHE_NAME = "data-cache-v1";

self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cahse) => {
            console.log("success pre-cashed")
            return cahse.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("remove old data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.ClientRectList.claim();
})

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(
                function(response) {
                    if (!response || response.status !== 200 || response.type !== "basic") {
                        return response;
                    }
                    let responseToCache = response.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    })

                    return response
                }
            );
        })
    );
});