// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

console.log('\n********************** firebase-messaging-sw.js **********************')

// Set Firebase configuration, once available
self.addEventListener('fetch', () => {
    const urlParams = new URLSearchParams(location.search)
    console.log('Setting Firebase configuration:')
    console.log(urlParams)
    console.log('-----------------')
    self.firebaseConfig = Object.fromEntries(urlParams)
    console.log(firebaseConfig)
    console.log('-----------------')
})

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
}

// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig)
// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
    console.log('onBackgroundMessage (display notifs): ')
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }
    console.log(notificationTitle)
    console.log('-----------------')
    console.log(notificationOptions)
    console.log('-----------------')

    self.registration.showNotification(notificationTitle, notificationOptions)
})

console.log('********************** firebase-messaging-sw.js **********************\n')
