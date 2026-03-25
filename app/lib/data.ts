import { prisma } from "./prisma";

/**
 * Mengambil semua data perumahan dari Supabase
 */
export async function getProperties() {
    const properties = await prisma.property.findMany({
        orderBy: { name: "asc" },
    });
    return properties;
}

/**
 * Mengambil satu properti berdasarkan slug/id
 */
export async function getPropertyBySlug(slug: string) {
    const property = await prisma.property.findUnique({
        where: { id: slug },
        include: { units: true },
    });
    return property;
}

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
