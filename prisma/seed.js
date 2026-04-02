const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')
    console.log('Using DATABASE_URL from environment.')

    // We no longer clear existing data to preserve manual edits in Supabase.
    
    const defaultFacilities = [
        "Cluster One Gate System (Keamanan 24 Jam)",
        "Fasilitas Masjid di dalam komplek",
        "Jalan Lebar dan Lingkungan Asri"
    ]

    const propertiesResult = [
        { id: "griya-keiko", name: "Griya Keiko", titleTop: "Griya Keiko", titleBottom: "Smart Modern Living", facilities: defaultFacilities },
        { id: "kurnia-jaya", name: "Kurnia Jaya", titleTop: "Kurnia Jaya", titleBottom: "Minimalist Residence", facilities: defaultFacilities },
        { id: "albirruni", name: "Albirruni", titleTop: "Albirruni", titleBottom: "Modern Harmony", facilities: defaultFacilities },
        { id: "arraz", name: "ARRAZ", titleTop: "ARRAZ", titleBottom: "Srimahi City", facilities: defaultFacilities },
        { id: "arsy", name: "ARSY", titleTop: "ARSY", titleBottom: "Modern House", facilities: defaultFacilities },
        { id: "nayra", name: "Nayra", titleTop: "Nayra", titleBottom: "Premium Living", facilities: defaultFacilities },
    ]

    const unitsResult = [
        {
            id: "GK-A01",
            propertyId: "griya-keiko",
            type: "36",
            price: "450.000.000",
            status: "Available",
            features: ["2 Kamar Tidur", "1 Kamar Mandi", "Carport"]
        },
        {
            id: "GK-A02",
            propertyId: "griya-keiko",
            type: "36",
            price: "450.000.000",
            status: "Sold",
            features: ["2 Kamar Tidur", "1 Kamar Mandi", "Carport"]
        },
        {
            id: "AL-B01",
            propertyId: "albirruni",
            type: "45",
            price: "450.000.000",
            status: "Available",
            features: ["2 Kamar Tidur", "1 Kamar Mandi", "Carport"]
        }
    ]

    for (const p of propertiesResult) {
        const existing = await prisma.property.findUnique({
            where: { id: p.id }
        })
        if (!existing) {
            await prisma.property.create({
                data: p
            })
            console.log(`+ Added new property: ${p.name}`)
        } else {
            // Update facilities if already exists
            await prisma.property.update({
                where: { id: p.id },
                data: {
                    facilities: p.facilities
                }
            })
            console.log(`~ Updated facilities for property ${p.name}`)
        }
    }

    for (const u of unitsResult) {
        const existing = await prisma.unit.findUnique({
            where: { id: u.id }
        })
        if (!existing) {
            await prisma.unit.create({
                data: u
            })
            console.log(`+ Added new unit: ${u.id}`)
        } else {
            console.log(`~ Unit ${u.id} already exists, skipping.`)
        }
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
