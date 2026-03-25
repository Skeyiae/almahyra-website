import { prisma } from "./prisma";

/**
 * Mengambil semua data perumahan dari Supabase
 */
export async function getProperties() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: { name: "asc" },
            include: {
                units: true,
            },
        });
        return properties;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch properties data.");
    }
}

/**
 * Mengambil satu properti berdasarkan slug/id
 */
export async function getPropertyBySlug(slug: string) {
    try {
        const property = await prisma.property.findUnique({
            where: { id: slug },
            include: { units: true },
        });
        return property;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch property by slug.");
    }
}

/**
 * Mengambil unit yang tersedia untuk properti tertentu
 */
export async function getAvailableUnits(propertyId: string) {
    try {
        const units = await prisma.unit.findMany({
            where: {
                propertyId: propertyId,
                status: "Available",
            },
        });
        return units;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch available units.");
    }
}

/**
 * Mengambil semua unit untuk properti tertentu
 */
export async function getUnitsByPropertyId(propertyId: string) {
    try {
        const units = await prisma.unit.findMany({
            where: { propertyId: propertyId },
        });
        return units;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch units by property ID.");
    }
}

/**
 * Mengambil harga berdasarkan tipe unit
 */
export async function getPriceByType(propertyId: string, type: string) {
    try {
        const unit = await prisma.unit.findFirst({
            where: {
                propertyId: propertyId,
                type: type,
            },
        });
        return unit?.price;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch price by type.");
    }
}
