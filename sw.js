const CACHE_NAME = "nasho-launcher-v5";


const APP_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/nasho-logo.png"
];



/* =====================================================
   INSTALL
===================================================== */

self.addEventListener(
  "install",
  function(event) {

    self.skipWaiting();

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(function(cache) {

          return cache.addAll(
            APP_FILES
          );

        })

    );

  }
);



/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(function(keys) {

          return Promise.all(

            keys.map(function(key) {

              if (
                key !== CACHE_NAME
              ) {

                return caches.delete(
                  key
                );

              }

            })

          );

        })
        .then(function() {

          return self.clients.claim();

        })

    );

  }
);



/* =====================================================
   FETCH
===================================================== */

self.addEventListener(
  "fetch",
  function(event) {

    if (
      event.request.method !== "GET"
    ) {

      return;

    }


    /*
      Network first.
      If internet is available,
      use the newest Vercel version.
    */

    event.respondWith(

      fetch(event.request)

        .then(function(response) {

          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {

            const copy =
              response.clone();

            caches
              .open(CACHE_NAME)
              .then(function(cache) {

                cache.put(
                  event.request,
                  copy
                );

              });

          }

          return response;

        })

        .catch(function() {

          return caches.match(
            event.request
          );

        })

    );

  }
);
