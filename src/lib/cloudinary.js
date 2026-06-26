// src/lib/cloudinary.js

// 1. Ambil Data dari Environment Variables
export const CLOUDINARY_CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// 2. Fungsi Utama untuk Upload Gambar
export const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Pakai variabel .env

    try {
        // Tembak API Cloudinary pakai CLOUD_NAME dari .env
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Gagal upload gambar ke Cloudinary');
        }

        const data = await response.json();
        
        // Mengembalikan link URL gambar yang udah matang
        return data.secure_url; 
        
    } catch (error) {
        console.error('Error upload Cloudinary:', error);
        throw error;
    }
};