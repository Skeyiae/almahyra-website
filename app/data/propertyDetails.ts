export interface PropertyDetail {
    id: string;
    description: string;
    locationText: string;
    basePrice: number;
    installments: string;
    promoBadge: {
        text: string;
        subtext?: string;
    } | null;
    landmarks: {
        label: string;
        time: string;
        type: "school" | "mall" | "transport" | "other";
    }[];
    specs: {
        label: string;
        value: string;
        icon: "bed" | "bath" | "water" | "power" | "home" | "layout";
    }[];
}

export const propertyDetails: Record<string, PropertyDetail> = {
    "griya-keiko": {
        id: "griya-keiko",
        description: "Hunian elegan di Sabah Balau yang memadukan estetika modern dengan fungsionalitas — menciptakan ruang yang menginspirasi dan nyaman untuk ditinggali oleh keluarga Anda.",
        locationText: "Sabah Balau, Lampung (Pinggir Jalan Tugu Perahu)",
        basePrice: 354000000,
        installments: "2,6 Jutaan",
        promoBadge: {
            text: "Promo Tanpa DP",
            subtext: "Booking Hanya 2 Juta Saja"
        },
        landmarks: [
            { label: "Kampus ITERA", time: "5 Menit", type: "school" },
            { label: "Gerbang Tol Itera", time: "7 Menit", type: "transport" },
            { label: "Kampus UIN", time: "8 Menit", type: "school" },
            { label: "Golf Sukarame", time: "10 Menit", type: "other" },
            { label: "Airan Raya", time: "5 Menit", type: "transport" },
        ],
        specs: [
            { label: "Kamar Tidur", value: "2 Unit", icon: "bed" },
            { label: "Kamar Mandi", value: "2 Unit", icon: "bath" },
            { label: "Listrik", value: "1300 W", icon: "power" },
            { label: "Sumber Air", value: "Sumur Bor", icon: "water" },
            { label: "Luas Bangunan", value: "60 m²", icon: "home" },
            { label: "Luas Tanah", value: "84 m²", icon: "layout" },
        ],
    },
    "jati-asri": {
        id: "jati-asri",
        description: "Perumahan eksklusif dengan lingkungan asri dan tenang di Jati Agung. Sangat cocok bagi Anda yang menginginkan ketenangan setelah seharian beraktivitas.",
        locationText: "Jati Agung, Lampung Selatan",
        basePrice: 285000000,
        installments: "1,9 Jutaan",
        promoBadge: {
            text: "Diskon Booking",
            subtext: "Hanya 1 Juta Langsung Akad"
        },
        landmarks: [
            { label: "Pasar Jati Agung", time: "5 Menit", type: "mall" },
            { label: "Puskesmas", time: "3 Menit", type: "other" },
            { label: "SD Negeri 1", time: "4 Menit", type: "school" },
        ],
        specs: [
            { label: "Kamar Tidur", value: "2 Unit", icon: "bed" },
            { label: "Kamar Mandi", value: "1 Unit", icon: "bath" },
            { label: "Listrik", value: "900 W", icon: "power" },
            { label: "Sumber Air", value: "Sumur Bor", icon: "water" },
            { label: "Luas Bangunan", value: "36 m²", icon: "home" },
            { label: "Luas Tanah", value: "72 m²", icon: "layout" },
        ],
    },
    "kurnia-jaya": {
        id: "kurnia-jaya",
        description: "Kurnia Jaya menghadirkan solusi hunian terjangkau dengan kualitas bangunan premium di Lampung Selatan.",
        locationText: "Lampung Selatan",
        basePrice: 310000000,
        installments: "2,1 Jutaan",
        promoBadge: null,
        landmarks: [
            { label: "Indogrosir", time: "10 Menit", type: "mall" },
            { label: "RS Airan Raya", time: "12 Menit", type: "other" },
        ],
        specs: [
            { label: "Kamar Tidur", value: "2 Unit", icon: "bed" },
            { label: "Kamar Mandi", value: "1 Unit", icon: "bath" },
            { label: "Listrik", value: "1300 W", icon: "power" },
            { label: "Luas Bangunan", value: "45 m²", icon: "home" },
        ],
    }
};

export const defaultDetail: PropertyDetail = {
    id: "default",
    description: "Hunian modern dan nyaman dengan lokasi strategis untuk keluarga Anda di perumahan Almahyra Property.",
    locationText: "Lokasi Strategis & Akses Mudah",
    basePrice: 350000000,
    installments: "2,5 Jutaan",
    promoBadge: null,
    landmarks: [
        { label: "Lokasi Strategis", time: "Dekat Fasum", type: "transport" },
        { label: "Pusat Kota", time: "15 Menit", type: "mall" },
    ],
    specs: [
        { label: "Kamar Tidur", value: "2 Unit", icon: "bed" },
        { label: "Kamar Mandi", value: "1 Unit", icon: "bath" },
        { label: "Listrik", value: "1300 W", icon: "power" },
        { label: "Sumber Air", value: "Sumur Bor", icon: "water" },
    ],
};
