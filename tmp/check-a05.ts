import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const units = await prisma.unit.findMany({
    where: { propertyId: 'griya-keiko', label: { contains: 'A-05' } }
  })
  console.log('--- A-05 Details ---')
  console.log(JSON.stringify(units, null, 2))
}

main().finally(() => prisma.$disconnect())
