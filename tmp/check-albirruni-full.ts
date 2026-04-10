import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const albirruniUnits = await prisma.unit.findMany({
    where: {
      OR: [
        { propertyId: 'albirruni' },
        { propertyId: 'al-birruni' }
      ]
    }
  })
  
  console.log('Units found for Albirruni:')
  console.log(JSON.stringify(albirruniUnits.map(u => ({ id: u.id, propertyId: u.propertyId, label: u.label })), null, 2))

  const albirruniProp = await prisma.property.findUnique({
    where: { id: 'albirruni' }
  })
  console.log('Albirruni Property Details:')
  console.log(JSON.stringify(albirruniProp, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
