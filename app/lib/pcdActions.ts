"use server";

import crypto from "crypto";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

// Konfigurasi Cloudinary dari Environment Variables
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Mengunggah gambar Base64 ke Cloudinary menggunakan Signed Upload API
 */
export async function uploadWatermarkedToCloudinary(base64Image: string, propertyId: string, label: string) {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw new Error("Konfigurasi Cloudinary tidak lengkap di .env");
    }

    try {
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        const folder = "almahyra_watermarked";
        const publicId = `${propertyId}_${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${timestamp}`;

        // Parameter yang akan ditandatangani secara digital (diurutkan secara alfabetis)
        const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
        
        // Buat signature SHA-1 menggunakan API Secret
        const signature = crypto
            .createHash("sha1")
            .update(paramsToSign + API_SECRET)
            .digest("hex");

        // Bangun Form Data untuk POST request ke Cloudinary
        const formData = new FormData();
        formData.append("file", base64Image);
        formData.append("api_key", API_KEY);
        formData.append("timestamp", timestamp);
        formData.append("folder", folder);
        formData.append("public_id", publicId);
        formData.append("signature", signature);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gagal mengunggah ke Cloudinary");
        }

        const data = await response.json();
        return data.secure_url as string;
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error(error.message || "Gagal mengunggah citra ke Cloudinary");
    }
}

/**
 * Memperbarui URL gambar perumahan di database Supabase lewat Prisma
 */
export async function updatePropertyImage(
    propertyId: string,
    label: string,
    isPremium: boolean,
    newUrl: string
) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            throw new Error("Properti tidak ditemukan");
        }

        const imageField = isPremium ? "imagesPremium" : "imagesStandard";
        const rawImages = property[imageField];
        
        let images: any[] = [];
        if (typeof rawImages === "string") {
            images = JSON.parse(rawImages);
        } else if (Array.isArray(rawImages)) {
            images = rawImages;
        }

        const updatedImages = images.map((img: any) => {
            if (img.label === label) {
                return {
                    ...img,
                    originalUrl: img.originalUrl || img.url, // Simpan URL asli jika belum dicadangkan
                    url: newUrl, // Ganti dengan URL Cloudinary ber-watermark baru
                };
            }
            return img;
        });

        await prisma.property.update({
            where: { id: propertyId },
            data: {
                [imageField]: updatedImages,
            },
        });

        // Revalidasi cache halaman utama dan detail properti agar instan terupdate
        revalidatePath("/");
        revalidatePath(`/${propertyId}`);

        return { success: true };
    } catch (error: any) {
        console.error("Database Update Error:", error);
        throw new Error(error.message || "Gagal memperbarui database Supabase");
    }
}

/**
 * Mengembalikan gambar perumahan ke URL asli Cloudinary di database Supabase
 */
export async function resetPropertyImage(
    propertyId: string,
    label: string,
    isPremium: boolean
) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            throw new Error("Properti tidak ditemukan");
        }

        const imageField = isPremium ? "imagesPremium" : "imagesStandard";
        const rawImages = property[imageField];
        
        let images: any[] = [];
        if (typeof rawImages === "string") {
            images = JSON.parse(rawImages);
        } else if (Array.isArray(rawImages)) {
            images = rawImages;
        }

        const updatedImages = images.map((img: any) => {
            if (img.label === label) {
                // Jika memiliki cadangan originalUrl, kembalikan. Jika tidak, tetap gunakan url saat ini.
                const originalUrl = img.originalUrl || img.url;
                return {
                    label: img.label,
                    url: originalUrl, // Pulihkan ke URL asli
                };
            }
            return img;
        });

        await prisma.property.update({
            where: { id: propertyId },
            data: {
                [imageField]: updatedImages,
            },
        });

        // Revalidasi cache agar perubahan instan
        revalidatePath("/");
        revalidatePath(`/${propertyId}`);

        return { success: true };
    } catch (error: any) {
        console.error("Database Reset Error:", error);
        throw new Error(error.message || "Gagal mereset gambar di database Supabase");
    }
}
