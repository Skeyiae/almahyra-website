import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Final Force Update: Ensuring all 3BR units in Griya Keiko have 455M price and correct metadata...')
  
  // 1. First, find all units that SHOULD be 3BR based on label (A-05, A-10, etc.)
  const LabelsToUpdate = ['A-05', 'A-10', 'A-15', 'A-20']
  
  const update1 = await prisma.unit.updateMany({
    where: {
      propertyId: 'griya-keiko',
      label: { in: LabelsToUpdate }
    },
    data: {
      bedrooms: 3,
      price: '455.000.000',
      type: 'Type 70/100 (3BR Premium)'
    }
  })
  console.log(`Updated ${update1.count} A-series units based on label.`)

  // 2. Update any other 3BR units to 455M
  const update2 = await prisma.unit.updateMany({
    where: {
      propertyId: 'griya-keiko',
      OR: [
        { bedrooms: 3 },
        { type: { contains: '3BR' } },
        { type: { contains: '3 Kamar' } }
      ]
    },
    data: {
      price: '455.000.000'
    }
  })
  console.log(`Updated ${update2.count} 3BR units to 455M price.`)

  // 3. Make sure the 455M units ALL have bedrooms set to 3
  const update3 = await prisma.unit.updateMany({
    where: {
      propertyId: 'griya-keiko',
      OR: [
        { price: '455.000.000' },
        { price: '455000000' }
      ]
    },
    data: {
      bedrooms: 3
    }
  })
  console.log(`Updated ${update3.count} 455M units to have 3 bedrooms.`)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
