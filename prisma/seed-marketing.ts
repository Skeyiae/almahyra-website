import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Marketing Team with User Request...')

    const marketingTeam = [
        {
            name: "Marketing Almahyra 1",
            position: "Senior Marketing",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        },
        {
            name: "Marketing Almahyra 2",
            position: "Marketing Executive",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        },
        {
            name: "Marketing Almahyra 3",
            position: "Marketing Consultant",
            whatsapp: "089638279827",
            photo: "https://res.cloudinary.com/daoubepeo/image/upload/v1/models/model-exterior-white.png"
        }
    ]

    for (const [index, m] of marketingTeam.entries()) {
        await prisma.marketing.upsert({
            where: { id: index + 1 },
            update: m,
            create: m
        })
    }

    console.log('Marketing Team seeded successfully!')
}

main()
    .catch((e) => {
        console.error('Seed Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
