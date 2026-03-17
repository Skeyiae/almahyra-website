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
        name: "Type 60/84 - Standard",
        description: "Hunian nyaman dengan 2 Kamar Tidur dan 2 Kamar Mandi di Griya Keiko",
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
        name: "Type 70/100 - Premium",
        description: "Ruang lebih luas dengan 3 Kamar Tidur dan 2 Kamar Mandi di Griya Keiko",
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
        name: "Kurnia Jaya Luxury",
        description: "Hunian mewah dengan konsep alam di Kurnia Jaya",
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
        id: "model-jati-1",
        propertyId: "jati-asri",
        name: "Jati Asri Classic",
        description: "Nuansa kayu klasik di Jati Asri",
        variants: [
            {
                id: "oak",
                label: "Oak",
                color: "#4a3728",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-bedroom.png",
            },
        ],
    },
    {
        id: "model-pandora-1",
        propertyId: "pandora-subsidi",
        name: "Pandora Residence",
        description: "Hunian mewah dengan konsep alam di Pandora Residence",
        variants: [
            {
                id: "natural",
                label: "Natural",
                color: "#7a6b5d",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png",
            },
        ],
    },
    {
        id: "model-arraz-1",
        propertyId: "arraz",
        name: "ARRAZ Residence",
        description: "Hunian asri di Srimahi City",
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
        id: "model-elok-1",
        propertyId: "griya-elok",
        name: "Griya Elok Luxury",
        description: "Kenyamanan eksklusif di Griya Elok",
        variants: [
            {
                id: "elok-v1",
                label: "Premium",
                color: "#8B6914",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png",
            },
        ],
    },
    {
        id: "model-arsy-1",
        propertyId: "arsy",
        name: "ARSY Modern House",
        description: "Desain masa kini untuk keluarga dinamis",
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
        name: "Nayra House",
        description: "Hunian minimalis dengan udara sejuk",
        variants: [
            {
                id: "nayra-v1",
                label: "Standard",
                color: "#7a6b5d",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png",
            },
        ],
    },
    {
        id: "model-reno-1",
        propertyId: "reno",
        name: "Reno Residence",
        description: "Pilihan tepat untuk investasi masa depan",
        variants: [
            {
                id: "reno-v1",
                label: "Classic",
                color: "#4a3728",
                image: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png",
            },
        ],
    },
];
