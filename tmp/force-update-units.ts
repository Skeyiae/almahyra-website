import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Force updating all 3-bedroom units to 455.000.000 price...')
  
  const result = await prisma.unit.updateMany({
    where: {
      OR: [
        { bedrooms: 3 },
        { price: '455000000' },
        { price: '455.000.000' }
      ]
    },
    data: {
      price: '455.000.000', // Using standard format with dots
      bedrooms: 3
    }
  })
  
  console.log(`Updated ${result.count} units.`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
