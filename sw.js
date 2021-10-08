const staticDevCoffee = "bhel"
const assets = [
  "/bhel/",
  "/bhel/index.html",
  "/bhel/petite-vue.js",
  "/bhel/assets/music/mixkit-rising-forest-471.mp3",
  "https://unpkg.com/petite-vue?module",
  "https://unpkg.com/@picocss/pico@latest/css/pico.min.css",
  "/bhel/apple-touch-icon.png",
  "/bhel/favicon-32x32.png",
  "/bhel/favicon-16x16.png",
  "/bhel/site.webmanifest",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
