const CACHE_NAME = 'time-tracker-v4';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg'
];

// Install event - cache resources (skip waiting to activate immediately)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    // Skip waiting so the new service worker activates immediately
    self.skipWaiting();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Always fetch HTML files from network (never cache them)
    // This ensures updates are always visible
    if (event.request.method === 'GET' &&
        (url.pathname === '/' || url.pathname === '/index.html')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    // Only fallback to cache if network completely fails
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For other resources, use network-first with cache fallback
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If the request was successful, clone and cache it (except HTML)
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Network failed, try to serve from cache
                return caches.match(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all pages immediately
    return self.clients.claim();
});
