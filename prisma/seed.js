const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')
    console.log('Using DATABASE_URL from environment.')

    // Clear existing data
    try {
        await prisma.unit.deleteMany({})
        await prisma.property.deleteMany({})
    } catch (e) {
        console.log('Cleanup skipped or tables not found yet.')
    }

    const propertiesResult = [
        { id: "griya-keiko", name: "Griya Keiko", titleTop: "Griya Keiko", titleBottom: "Smart Modern Living" },
        { id: "kurnia-jaya", name: "Kurnia Jaya", titleTop: "Kurnia Jaya", titleBottom: "Minimalist Residence" },
        { id: "jati-asri", name: "Jati Asri", titleTop: "Jati Asri", titleBottom: "Comfort & Natural" },
        { id: "pandora-subsidi", name: "Pandora Subsidi", titleTop: "Pandora Subsidi", titleBottom: "Srimahi Residence" },
        { id: "arraz", name: "ARRAZ", titleTop: "ARRAZ", titleBottom: "Srimahi City" },
        { id: "griya-elok", name: "Griya Elok", titleTop: "Griya Elok", titleBottom: "Exclusive Residence" },
        { id: "arsy", name: "ARSY", titleTop: "ARSY", titleBottom: "Modern House" },
        { id: "nayra", name: "Nayra", titleTop: "Nayra", titleBottom: "Premium Living" },
        { id: "reno", name: "Reno", titleTop: "Reno", titleBottom: "Green Living" },
        { id: "green-permana", name: "Green Permana", titleTop: "Green Permana", titleBottom: "Eco Friendly City" },
    ]

    for (const p of propertiesResult) {
        await prisma.property.create({
            data: p
        })
    }

    const unitsResult = [
        {
            id: "A-01",
            propertyId: "griya-keiko",
            type: "36",
            price: "450.000.000",
            status: "Available",
            features: ["2 Kamar Tidur", "1 Kamar Mandi", "Carport"]
        },
        {
            id: "A-02",
            propertyId: "griya-keiko",
            type: "36",
            price: "450.000.000",
            status: "Sold",
            features: ["2 Kamar Tidur", "1 Kamar Mandi", "Carport"]
        },
        {
            id: "B-01",
            propertyId: "griya-keiko",
            type: "45",
            price: "550.000.000",
            status: "Available",
            features: ["3 Kamar Tidur", "1 Kamar Mandi", "Taman Belakang"]
        },
        {
            id: "KJ-01",
            propertyId: "kurnia-jaya",
            type: "36",
            price: "420.000.000",
            status: "Booked",
            features: ["2 Kamar Tidur", "1 Kamar Mandi"]
        },
        {
            id: "KJ-02",
            propertyId: "kurnia-jaya",
            type: "36",
            price: "420.000.000",
            status: "Available",
            features: ["2 Kamar Tidur", "1 Kamar Mandi"]
        },
        {
            id: "JT-10",
            propertyId: "jati-asri",
            type: "45",
            price: "580.000.000",
            status: "Available",
            features: ["3 Kamar Tidur", "2 Kamar Mandi"]
        }
    ]

    for (const u of unitsResult) {
        await prisma.unit.create({
            data: u
        })
    }

    console.log('Seed finished successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
