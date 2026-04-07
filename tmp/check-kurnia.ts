import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const p = await prisma.property.findUnique({
    where: { id: 'kurnia-jaya' }
  })
  console.log('--- Kurnia Jaya Data ---')
  console.log(JSON.stringify(p, null, 2))
}
main().finally(() => prisma.$disconnect())
