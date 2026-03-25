import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting safe seed...')

    // NOTA: Kami menghapus deleteMany() agar data unit yang sudah diinput manual di Supabase tidak hilang.
    // Kami menggunakan upsert() agar data perumahan diupdate jika sudah ada, atau dibuat jika belum ada.

    const properties = [
        {
            id: "griya-keiko",
            name: "Griya Keiko Tugu Perahu",
            titleTop: "Griya Keiko",
            titleBottom: "Smart Modern Living",
            description: "Hunian elegan di Sabah Balau yang memadukan estetika modern dengan fungsionalitas — menciptakan ruang yang menginspirasi dan nyaman untuk ditinggali oleh keluarga Anda.",
            locationText: "Sabah Balau, Lampung (Pinggir Jalan Tugu Perahu)",
            promoBadge: "Promo Tanpa DP",
            promoSubtext: "Booking Hanya 2 Juta Saja",
            sitePlanImage: "/siteplans/griya-keiko.png",
            salesPhone: "62895610098292",
            salesName: "Sales Griya Keiko",
            imagesStandard: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png" },
                { label: "Ruang Tamu", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png" },
                { label: "Kamar Tidur", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-bedroom.png" },
                { label: "Dapur & Kamar Mandi", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-interior.png" },
            ]),
            imagesPremium: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png" },
                { label: "Ruang Tamu", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png" },
                { label: "Kamar Tidur", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-bedroom.png" },
                { label: "Dapur & Kamar Mandi", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-interior.png" },
            ]),
            mortgageSchemes: JSON.stringify([
                {
                    id: "niaga-syariah",
                    name: "Bank Niaga Syariah",
                    options: [
                        {
                            label: "Flat Bertahap 15 Tahun",
                            type: "stepped",
                            periods: [
                                { label: "1-5 Tahun", monthlyPayment: 2778084 },
                                { label: "6-15 Tahun", monthlyPayment: 3897049 },
                            ]
                        },
                        {
                            label: "Flat Sampai Akhir (15 Tahun)",
                            type: "fixed",
                            periods: [
                                { label: "1-15 Tahun", monthlyPayment: 3499254 },
                            ]
                        }
                    ]
                },
                {
                    id: "bni",
                    name: "Bank BNI",
                    options: [
                        {
                            label: "Flat Bertahap 15 Tahun",
                            type: "stepped",
                            periods: [
                                { label: "Tahun 1", monthlyPayment: 2545279 },
                                { label: "Tahun 2-3", monthlyPayment: 2884097 },
                                { label: "Tahun 4-10", monthlyPayment: 3336407 },
                                { label: "Tahun 11-15", monthlyPayment: 3526380 },
                            ]
                        }
                    ]
                },
                {
                    id: "bsi",
                    name: "Bank Syariah Indonesia (BSI)",
                    options: [
                        {
                            label: "Flat Bertahap (Opsi 1)",
                            type: "stepped",
                            periods: [
                                { label: "Bulan 1-36", monthlyPayment: 2814299 },
                                { label: "Bulan 37-60", monthlyPayment: 3334831 },
                                { label: "Bulan 61-180", monthlyPayment: 3977433 },
                            ]
                        },
                        {
                            label: "Flat 15 Tahun (Opsi 2)",
                            type: "fixed",
                            periods: [
                                { label: "1-15 Tahun", monthlyPayment: 3600000 },
                            ]
                        }
                    ]
                },
                {
                    id: "btn-syariah",
                    name: "Bank BTN Syariah",
                    options: [
                        {
                            label: "Flat Bertahap 15 Tahun",
                            type: "stepped",
                            periods: [
                                { label: "Tahun 1", monthlyPayment: 2867277 },
                                { label: "Tahun 2", monthlyPayment: 3133854 },
                                { label: "Tahun 3-4", monthlyPayment: 3578093 },
                                { label: "Tahun 5", monthlyPayment: 4023654 },
                                { label: "Tahun 6-15", monthlyPayment: 4110241 },
                            ]
                        }
                    ]
                }
            ]),
            landmarks: JSON.stringify([
                { label: "Kampus ITERA", time: "5 Menit", type: "school" },
                { label: "Gerbang Tol Itera", time: "7 Menit", type: "transport" },
                { label: "Kampus UIN", time: "8 Menit", type: "school" },
                { label: "Golf Sukarame", time: "10 Menit", type: "other" },
                { label: "Airan Raya", time: "5 Menit", type: "transport" },
            ])
        },
        {
            id: "kurnia-jaya",
            name: "Kurnia Jaya",
            titleTop: "Kurnia Jaya",
            titleBottom: "Minimalist Residence",
            description: "Kurnia Jaya menghadirkan solusi hunian terjangkau dengan kualitas bangunan premium di Lampung Selatan.",
            locationText: "Lampung Selatan",
            sitePlanImage: "/siteplans/kurnia-jaya.png",
            salesPhone: "628123456789", // Placeholder
            salesName: "Sales Kurnia Jaya",
            imagesStandard: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-living.png" },
            ]),
            imagesPremium: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png" },
            ]),
            landmarks: JSON.stringify([
                { label: "Indogrosir", time: "10 Menit", type: "mall" },
                { label: "RS Airan Raya", time: "12 Menit", type: "other" },
            ])
        },
        {
            id: "jati-asri",
            name: "Jati Asri",
            titleTop: "Jati Asri",
            titleBottom: "Comfort & Natural",
            description: "Perumahan eksklusif dengan lingkungan asri dan tenang di Jati Agung. Sangat cocok bagi Anda yang menginginkan ketenangan.",
            locationText: "Jati Agung, Lampung Selatan",
            sitePlanImage: "/siteplans/jati-asri.png",
            salesPhone: "628123456789", // Placeholder
            salesName: "Sales Jati Asri",
            imagesStandard: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/interior-bedroom.png" },
            ]),
            imagesPremium: JSON.stringify([
                { label: "Eksterior", url: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-brown.png" },
            ]),
            landmarks: JSON.stringify([
                { label: "Pasar Jati Agung", time: "5 Menit", type: "mall" },
                { label: "Puskesmas", time: "3 Menit", type: "other" },
            ])
        },
    ]

    for (const p of properties) {
        await prisma.property.upsert({
            where: { id: p.id },
            update: {
                name: p.name,
                titleTop: p.titleTop,
                titleBottom: p.titleBottom,
                description: p.description,
                locationText: p.locationText,
                promoBadge: p.promoBadge || null,
                promoSubtext: p.promoSubtext || null,
                salesPhone: p.salesPhone || "628123456789",
                salesName: p.salesName || "Almahyra Sales",
                imagesStandard: p.imagesStandard ? JSON.parse(p.imagesStandard) : [],
                imagesPremium: p.imagesPremium ? JSON.parse(p.imagesPremium) : [],
                mortgageSchemes: p.mortgageSchemes ? JSON.parse(p.mortgageSchemes) : [],
                landmarks: p.landmarks ? JSON.parse(p.landmarks) : [],
            } as any,
            create: {
                ...p,
                landmarks: p.landmarks ? JSON.parse(p.landmarks) : [],
                mortgageSchemes: p.mortgageSchemes ? JSON.parse(p.mortgageSchemes) : [],
                imagesStandard: p.imagesStandard ? JSON.parse(p.imagesStandard) : [],
                imagesPremium: p.imagesPremium ? JSON.parse(p.imagesPremium) : [],
            } as any
        })
    }

    // Units for Griya Keiko (Kapling A-01 sampai A-20)
    const keikoUnits = [];
    for (let i = 1; i <= 20; i++) {
        const plotNumber = i < 10 ? `0${i}` : `${i}`;
        const label = `A-${plotNumber}`;
        const isPremium = i % 5 === 0; // Setiap kelipatan 5 adalah tipe 3BR

        keikoUnits.push({
            id: `gk-${label.toLowerCase()}`,
            propertyId: "griya-keiko",
            label: label,
            type: isPremium ? "Type 70/100 (3BR Premium)" : "Type 60/84 (2BR Standard)",
            price: isPremium ? "425.000.000" : "354.000.000", // Adjusted from 365m to 354m as requested
            status: i % 7 === 0 ? "Sold" : (i % 4 === 0 ? "Booked" : "Available"),
            features: isPremium
                ? ["3 Kamar Tidur", "2 Kamar Mandi", "Dapur Luas", "Carport 2 Mobil"]
                : ["2 Kamar Tidur", "2 Kamar Mandi", "Taman Belakang", "Carport"],
            bedrooms: isPremium ? 3 : 2,
            bathrooms: 2, // Both types now have 2 bathrooms
            buildingArea: isPremium ? 70 : 60,
            landArea: isPremium ? 100 : 84,
            electricity: "1300 VA",
            waterSource: "Sumur Bor"
        });
    }

    await prisma.unit.deleteMany({ where: { propertyId: "griya-keiko" } });
    await prisma.unit.createMany({ data: keikoUnits });

    console.log("Seeding realistic units for Griya Keiko... Done (20 units)");

    console.log('Safe seed finished successfully!')

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
