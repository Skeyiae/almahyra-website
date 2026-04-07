import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const units = await prisma.unit.findMany({
    where: { propertyId: 'griya-keiko', bedrooms: 3 }
  })
  console.log('--- 3BR Units in Griya Keiko ---')
  units.forEach(u => console.log(`${u.label}: ${u.price}`))
}
main().finally(() => prisma.$disconnect())
