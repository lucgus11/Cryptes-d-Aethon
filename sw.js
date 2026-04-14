const CACHE_NAME = 'cryptes-d-aethon-V1'; // Change le nom à chaque mise à jour majeure

// Liste des fichiers à mettre en cache immédiatement (Assets critiques)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-72x72.png'
];

// 1. Installation : Mise en cache des fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Mise en cache des assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Suppression de l\'ancien cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Interception des requêtes (Stratégie: Cache First, fallback to Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne le fichier du cache s'il existe, sinon fait la requête réseau
      return response || fetch(event.request);
    })
  );
});
