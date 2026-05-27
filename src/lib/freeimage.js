// src/lib/freeimage.js

export async function uploadImageToFreeimage(file) {
  // 🔥 Tarik API Key otomatis dari file .env lu
  const API_KEY = import.meta.env.PUBLIC_FREEIMAGE_API_KEY;

  // Jaga-jaga kalau .env lu belum ke-load atau salah ketik
  if (!API_KEY) {
    throw new Error("API Key Freeimage belum terbaca dari .env bro! Coba restart server Astro-nya.");
  }

  // 1. Ubah file jadi teks Base64 biar gampang nembus CORS browser
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Potong teks 'data:image/png;base64,' di depannya biar API Freeimage nggak bingung
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

  // 2. Bungkus ke dalam FormData sesuai permintaan API v1 Freeimage
  const formData = new FormData();
  formData.append("key", API_KEY);
  formData.append("source", base64Data);
  formData.append("action", "upload");
  formData.append("format", "json");

  // 3. Eksekusi tembak ke server Freeimage
  try {
    const response = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Koneksi ditolak server (HTTP ${response.status})`);
    }

    const data = await response.json();

    // 4. Pastikan balasan dari server benar-benar ngasih URL gambar
    if (data && data.status_code === 200 && data.image?.url) {
      return data.image.url;
    } else {
      throw new Error(data.error?.message || "Format balasan Freeimage salah.");
    }
  } catch (error) {
    console.error("Error Upload Freeimage:", error);
    throw new Error("Gagal hit Freeimage! MATIKAN ADBLOCKER (Ublock/Brave Shield) lu saat ngetes ini. Detail: " + error.message);
  }
}
