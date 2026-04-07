import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const units = await prisma.unit.findMany({
    where: { propertyId: 'griya-keiko' },
    select: { id: true, label: true, bedrooms: true, price: true }
  })
  console.log('--- Griya Keiko Units ---')
  console.log(JSON.stringify(units, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
