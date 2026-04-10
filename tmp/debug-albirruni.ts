import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const slug = 'albirruni'
  console.log(`Checking property with slug: ${slug}`)
  
  const property = await prisma.property.findUnique({
    where: { id: slug },
    include: {
      units: true,
    }
  })

  if (!property) {
    console.log(`Property not found: ${slug}`)
  } else {
    console.log('Property found:', JSON.stringify(property, null, 2))
    
    // Check for common issues
    if (!property.name) console.log('WARNING: Missing name')
    if (!property.titleTop) console.log('WARNING: Missing titleTop')
    if (!property.units || property.units.length === 0) console.log('WARNING: No units found')
    
    // Check if images are JSON and valid
    try {
      if (property.imagesStandard) {
        console.log('imagesStandard type:', typeof property.imagesStandard)
      }
      if (property.imagesPremium) {
        console.log('imagesPremium type:', typeof property.imagesPremium)
      }
    } catch (e) {
      console.log('ERROR checking images:', e)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
