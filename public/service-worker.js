// Service Worker para PWA offline
const CACHE_NAME = 'englishflow-v1'
const RUNTIME_CACHE = 'englishflow-runtime'

// URLs essenciais (shell do app)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// Install - cachea assets essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('SW install error:', err))
  )
})

// Activate - limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME && name !== RUNTIME_CACHE) {
            return caches.delete(name)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch - stale-while-revalidate para assets JS/CSS, network-first para HTML
self.addEventListener('fetch', event => {
  // Só GET
  if (event.request.method !== 'GET') return
  // Só http/https (ignora chrome-extension://, etc)
  if (!event.request.url.startsWith('http')) return

  const url = new URL(event.request.url)

  // API/dynamic - network-first
  if (url.pathname.startsWith('/api/') || event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone()
          caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match('/')))
    )
    return
  }

  // Assets estáticos - cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Também atualiza em background
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, response))
          }
        }).catch(() => {})
        return cached
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response
        }
        const clone = response.clone()
        caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, clone))
        return response
      }).catch(() => cached || caches.match('/'))
    })
  )
})
