const CACHE_NAME = 'levelup-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/firebase-config.js',
  '/images/lvl_icon_512.png'
];

// Evento 'install':
// Quando o service worker é instalado, ele salva os arquivos essenciais em cache.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate':
// Usado para limpar caches antigos, garantindo que o app use a versão mais recente.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch':
// Estratégia 'Cache First': tenta encontrar a resposta no cache primeiro, e só depois na rede.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o arquivo do cache se ele existir.
        if (response) {
          return response;
        }
        // Se não existir, faz a requisição na rede.
        return fetch(event.request);
      })
  );
});