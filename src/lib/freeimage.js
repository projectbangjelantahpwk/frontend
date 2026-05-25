// src/lib/freeimage.js

export async function uploadImageToFreeimage(file) {
  const apiKey = import.meta.env.PUBLIC_FREEIMAGE_API_KEY;

  if (!apiKey) {
    throw new Error("API Key Freeimage tidak ditemukan di .env!");
  }

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("action", "upload");
  formData.append("source", file);
  formData.append("format", "json");

  try {
    const response = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.status_code === 200) {
      return data.image.url; // Mengembalikan link URL langsung
    } else {
      throw new Error(data.error?.message || "Gagal mengunggah gambar.");
    }
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
}
