console.log('service-worker.js')

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

if (workbox) {
  ['/$', '/*', '.+/*'].forEach(mask => {
    workbox.routing.registerRoute(
      new RegExp(mask),
      new workbox.strategies.NetworkFirst({ cacheNae: 'dynamic' })
    )
  })
} else {
  console.log('Boo! Workbox didn\'t load 😬')
}
