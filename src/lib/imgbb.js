// src/lib/imgbb.js

export async function uploadImageToImgbb(file) {
  // 🔥 Tarik API Key otomatis dari file .env lu[cite: 2]
  // Pastikan variabel di .env sudah diganti jadi PUBLIC_IMGBB_API_KEY
  const API_KEY = import.meta.env.PUBLIC_IMGBB_API_KEY;

  // Jaga-jaga kalau .env lu belum ke-load atau salah ketik[cite: 2]
  if (!API_KEY) {
    throw new Error("API Key ImgBB belum terbaca dari .env bro! Coba restart server Astro-nya.");
  }

  // 1. Ubah file jadi teks Base64 biar gampang nembus CORS browser[cite: 2]
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Potong teks 'data:image/png;base64,' di depannya biar API ImgBB nggak bingung[cite: 2]
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

  // 2. Bungkus ke dalam FormData sesuai permintaan API v1 ImgBB[cite: 2]
  const formData = new FormData();
  formData.append("key", API_KEY);
  formData.append("image", base64Data); // Perubahan: ImgBB menggunakan key 'image', bukan 'source'

  // 3. Eksekusi tembak ke server ImgBB[cite: 2]
  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Koneksi ditolak server (HTTP ${response.status})`);
    }

    const data = await response.json();

    // 4. Pastikan balasan dari server benar-benar ngasih URL gambar[cite: 2]
    // Perubahan: Format balasan ImgBB ada di 'data.success' dan 'data.data.url'
    if (data && data.success && data.data?.url) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Format balasan ImgBB salah.");
    }
  } catch (error) {
    console.error("Error Upload ImgBB:", error);
    throw new Error("Gagal hit ImgBB! MATIKAN ADBLOCKER (Ublock/Brave Shield) lu saat ngetes ini. Detail: " + error.message); //[cite: 2]
  }
}
