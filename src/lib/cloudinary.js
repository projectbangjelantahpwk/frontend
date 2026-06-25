// src/lib/cloudinary.js

export async function uploadImageToCloudinary(file) {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary Cloud Name atau Upload Preset belum disetting di .env!");
  }
  const uploadPreset = "benefit_karyawan";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    // Tembak langsung ke API Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/dmqgtix3n/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url; // Mengembalikan link gambar HTTPS
    } else {
      throw new Error(data.error?.message || "Gagal upload ke Cloudinary");
    }
  } catch (error) {
    console.error("Error Upload Cloudinary:", error);
    throw error;
  }
}
