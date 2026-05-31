// ==========================================
// SERVICE WORKER UNTUK NOTIFIKASI BACKGROUND
// ==========================================
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Config Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBhSvulo8KRVoe7Fo09dL6t6aqmfSS1yRE",
  authDomain: "project-bang-jelantah.firebaseapp.com",
  projectId: "project-bang-jelantah",
  storageBucket: "project-bang-jelantah.firebasestorage.app",
  messagingSenderId: "422054168481",
  appId: "1:422054168481:web:9e8159f56b2de70778ade0"
});

const messaging = firebase.messaging();

// Tangkap notif saat BACKGROUND (tab tertutup)
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Pemberitahuan Baru';
  const notificationOptions = {
    body: payload.notification?.body || 'Anda memiliki pesan baru',
    icon: payload.notification?.image || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    sound: '/sounds/notification.mp3', // 🔊 SUARA
    tag: 'notification', // Prevent duplicate
    requireInteraction: false // User bisa dismiss
  };

  // Mainkan suara + tunjukkan notif
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle klik notifikasi
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received in background');
});
