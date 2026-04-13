import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const albirruniUnits = await prisma.unit.findMany({
    where: { propertyId: 'albirruni' },
    take: 1
  })
  console.log(JSON.stringify(albirruniUnits, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
