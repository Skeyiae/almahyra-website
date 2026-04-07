import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const units = await prisma.unit.findMany({
    where: {
      OR: [
        { bedrooms: 3 },
        { price: { contains: '455' } }
      ]
    }
  })
  console.log('--- Matching Units ---')
  console.log(JSON.stringify(units, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
