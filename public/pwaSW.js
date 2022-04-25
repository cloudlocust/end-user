// Avoid having the SW in pending mode; awaiting to be installed.
self.skipWaiting()

// eventListener fetch is essential for the browser to know it's a PWA app.
self.addEventListener('fetch', () => {})
