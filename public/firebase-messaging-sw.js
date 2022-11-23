// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

const firebaseConfig = {
    apiKey: 'AIzaSyClMER8hwr4e5l-br7DFKTGTZUnxwY42eg',
    authDomain: 'novu-push-notification.firebaseapp.com',
    projectId: 'novu-push-notification',
    storageBucket: 'novu-push-notification.appspot.com',
    messagingSenderId: '967242899838',
    appId: '1:967242899838:web:736824780e23ba1c17d32f',
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})
