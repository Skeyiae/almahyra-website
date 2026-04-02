import { Model } from "../types/config";

/**
 * ALMAHYRA MODEL CONFIGURATOR DATA
 * 
 * Cara mengganti foto:
 * 1. Taruh foto kamu di folder public/models/
 * 2. Ganti path di bawah ini sesuai nama file foto kamu
 *    Contoh: "/models/nama-foto-kamu.png" 
 * 
 * Cara menambah model/type rumah baru untuk perumahan yang sama:
 * - Gunakan propertyId yang sama (misal: "griya-keiko")
 * - Pastikan id model harus unik (misal: "model-keiko-type-36", "model-keiko-type-45")
 */

export const models: Model[] = [
    {
        id: "model-keiko-type-36",
        propertyId: "griya-keiko",
        name: "Tipe Standard",
        description: "",
        variants: [
            {
                id: "white-36",
                label: "Putih Modern",
                color: "#f5f0e8",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png",
            },
        ],
    },
    {
        id: "model-keiko-type-45",
        propertyId: "griya-keiko",
        name: "Tipe Premium",
        description: "",
        variants: [
            {
                id: "premium-brown",
                label: "Premium Wood",
                color: "#8B6914",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png",
            },
        ],
    },
    {
        id: "model-kurnia-1",
        propertyId: "kurnia-jaya",
        name: "Tipe Premium",
        description: "",
        variants: [
            {
                id: "natural",
                label: "Natural",
                color: "#7a6b5d",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png",
            },
        ],
    },
    // Tambahkan model untuk perumahan lain di sini dengan propertyId yang sesuai
    {
        id: "model-albirruni-1",
        propertyId: "albirruni",
        name: "Tipe Standard",
        description: "",
        variants: [
            {
                id: "albirruni-v1",
                label: "Standard",
                color: "#c9a96e",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png",
            },
        ],
    },
    {
        id: "model-arraz-1",
        propertyId: "arraz",
        name: "Tipe Standard",
        description: "",
        variants: [
            {
                id: "arraz-v1",
                label: "Modern",
                color: "#c9a96e",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png",
            },
        ],
    },
    {
        id: "model-arsy-1",
        propertyId: "arsy",
        name: "Tipe Standard",
        description: "",
        variants: [
            {
                id: "arsy-v1",
                label: "White",
                color: "#f5f0e8",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png",
            },
        ],
    },
    {
        id: "model-nayra-1",
        propertyId: "nayra",
        name: "Tipe Standard",
        description: "",
        variants: [
            {
                id: "nayra-v1",
                label: "Standard",
                color: "#7a6b5d",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png",
            },
        ],
    },
];
