import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

/**
 * Mengambil semua data perumahan dari Supabase
 * Dicache selama 1 jam untuk meningkatkan performa navigasi
 */
export const getProperties = unstable_cache(
    async () => {
        const properties = await prisma.property.findMany({
            orderBy: { name: "asc" },
        });
        return properties;
    },
    ["all-properties"],
    { revalidate: 3600, tags: ["properties"] }
);

/**
 * Mengambil satu properti berdasarkan slug/id
 * Dicache per request dan secara global dengan tag slug
 */
export const getPropertyBySlug = (slug: string) => {
    return unstable_cache(
        async () => {
            const property = await prisma.property.findUnique({
                where: { id: slug },
                include: {
                    units: {
                        orderBy: {
                            label: 'asc'
                        }
                    }
                }
            });
            return property;
        },
        [`property-${slug}`],
        { revalidate: 3600, tags: [`property-${slug}`] }
    )();
};

/**
 * Mengambil unit yang tersedia untuk properti tertentu
 */
export async function getAvailableUnits(propertyId: string) {
    const units = await prisma.unit.findMany({
        where: {
            propertyId: propertyId,
            status: "Available",
        },
    });
    return units;
}

/**
 * Mengambil semua unit untuk properti tertentu
 */
export async function getUnitsByPropertyId(propertyId: string) {
    const units = await prisma.unit.findMany({
        where: { propertyId: propertyId },
    });
    return units;
}

/**
 * Mengambil harga berdasarkan tipe unit
 */
export async function getPriceByType(propertyId: string, type: string) {
    const unit = await prisma.unit.findFirst({
        where: {
            propertyId: propertyId,
            type: type,
        },
    });
    return unit?.price;
}

/**
 * Mengambil semua data marketing dari Supabase
 */
export async function getMarketingContacts() {
    try {
        // Gunakan raw query sebagai fallback jika prisma client belum terupdate
        const marketing = await (prisma as any).$queryRawUnsafe('SELECT * FROM "Marketing" ORDER BY id ASC');
        if (marketing && marketing.length > 0) return marketing;
    } catch (error) {
        console.error("Prisma Raw Query Error:", error);
    }

    // Hardcoded fallback agar tidak kosong (Permintaan User)
    return [
        {
            id: 1,
            name: "Marketing Almahyra 1",
            position: "Senior Marketing",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        },
        {
            id: 2,
            name: "Marketing Almahyra 2",
            position: "Marketing Executive",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        },
        {
            id: 3,
            name: "Marketing Almahyra 3",
            position: "Marketing Consultant",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        }
    ];
}
