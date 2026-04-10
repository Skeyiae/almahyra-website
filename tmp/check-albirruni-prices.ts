import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const albirruniUnits = await prisma.unit.findMany({
    where: { propertyId: 'albirruni' },
    select: { label: true, price: true }
  })
  
  console.log('--- Unit Prices in Albirruni ---')
  albirruniUnits.map(u => console.log(`${u.label}: ${u.price}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
