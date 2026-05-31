// File: public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// ⚠️ GANTI DENGAN CONFIG DARI FIREBASE CONSOLE LU ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyBhSvulo8KRVoe7Fo09dL6t6aqmfSS1yRE",
  authDomain: "project-bang-jelantah.firebaseapp.com",
  projectId: "project-bang-jelantah",
  storageBucket: "project-bang-jelantah.firebasestorage.app",
  messagingSenderId: "422054168481",
  appId: "1:422054168481:web:9e8159f56b2de70778ade0",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handler notifikasi saat aplikasi berjalan di background/tertutup
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Notifikasi background masuk: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/5.png", // Ganti icon kalau perlu
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
