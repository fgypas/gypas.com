// Service Worker for Foivos Gypas Portfolio (2025)
// Provides offline functionality and performance improvements

const CACHE_NAME = 'foivos-portfolio-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/modern.css',
  '/assets/js/main.min.js',
  '/images/me.jpg',
  '/images/panoptes_logo.png',
  '/images/zarp.png',
  '/images/tectool.png',
  '/images/mpmorfsdb.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Network first resources (always try to get fresh content)
const NETWORK_FIRST = [
  '/index.html'
];

// Cache first resources (serve from cache if available)
const CACHE_FIRST = [
  '/assets/',
  '/images/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Network first strategy for HTML pages
    if (isNetworkFirst(request)) {
      return await networkFirst(request);
    }
    
    // Cache first strategy for static assets
    if (isCacheFirst(request)) {
      return await cacheFirst(request);
    }
    
    // Default to network first with cache fallback
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    return await handleOfflineResponse(request);
  }
}

function isNetworkFirst(request) {
  return NETWORK_FIRST.some(pattern => request.url.includes(pattern));
}

function isCacheFirst(request) {
  return CACHE_FIRST.some(pattern => request.url.includes(pattern));
}

async function networkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function cacheFirst(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fall back to network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    throw error;
  }
}

async function handleOfflineResponse(request) {
  // Return cached version if available
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // For HTML requests, return the cached home page
  if (request.destination === 'document') {
    const cachedHome = await caches.match('/');
    if (cachedHome) {
      return cachedHome;
    }
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Background sync for form submissions (if needed in the future)
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(handleContactFormSync());
  }
});

async function handleContactFormSync() {
  // Handle offline form submissions when back online
  const submissions = await getStoredSubmissions();
  
  for (const submission of submissions) {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(submission),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Remove successful submission
      await removeStoredSubmission(submission.id);
    } catch (error) {
      console.error('Failed to sync form submission:', error);
    }
  }
}

// Push notifications (placeholder for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/pwa-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'open',
          title: 'Open',
          icon: '/icons/pwa-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/pwa-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Utility functions for IndexedDB operations (for future use)
async function getStoredSubmissions() {
  // Implementation for retrieving stored form submissions
  return [];
}

async function removeStoredSubmission(id) {
  // Implementation for removing stored form submissions
  return true;
}
