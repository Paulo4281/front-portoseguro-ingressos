// Service Worker para Web Push Notifications
// Este arquivo deve estar em /public para ser acessível

const CACHE_NAME = 'psi-v1'
const STATIC_CACHE_URLS = []

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Receber notificações push
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Porto Seguro Ingressos',
    body: 'Você tem uma nova notificação!',
    icon: '/images/logos/logo-porto-seguro-ingressos-primary.png',
    badge: '/images/logos/logo-porto-seguro-ingressos-primary.png',
    tag: 'default',
    requireInteraction: false,
    data: {}
  }

  // Se houver dados no evento, usar eles
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        ...notificationData,
        ...data,
        data: data
      }
    } catch (e) {
      // Se não for JSON, tentar como texto
      notificationData.body = event.data.text()
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: notificationData.actions || [],
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    }
  )

  event.waitUntil(promiseChain)
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const notificationData = event.notification.data || {}
  let urlToOpen = '/'

  // Se houver uma URL nos dados da notificação, abrir ela
  if (notificationData.url) {
    urlToOpen = notificationData.url
  } else if (notificationData.eventId) {
    urlToOpen = `/ver-evento/${notificationData.eventSlug || notificationData.eventId}`
  } else if (notificationData.ticketId) {
    urlToOpen = '/meus-ingressos'
  }

  // Abrir ou focar na janela
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Verificar se já existe uma janela aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // Se não existir, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
