/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

if (workbox) {
  ['/$', '/*', '.+/*'].forEach(mask => {
    workbox.routing.registerRoute(
      new RegExp(mask),
      new workbox.strategies.NetworkFirst({ cacheName: 'dynamic' })
    )
  })
} else {
  console.log('Boo! Workbox didn\'t load 😬')
}
