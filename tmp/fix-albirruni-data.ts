import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const propertyId = 'albirruni'
  console.log(`Checking data for: ${propertyId}`)

  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  })

  if (!property) {
    console.log('Property not found')
    return
  }

  const rawSchemes = property.mortgageSchemes as any
  
  // Check if it's a double nested array like [[{...}]]
  if (Array.isArray(rawSchemes) && rawSchemes.length > 0 && Array.isArray(rawSchemes[0])) {
    console.log('Nested array detected in mortgageSchemes. Flattening...')
    
    // Flatten the array. If it's [[{...}, {...}]], it becomes [{...}, {...}]
    const flattenedSchemes = rawSchemes.flat()
    
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        mortgageSchemes: flattenedSchemes
      }
    })
    
    console.log('Success! Data flattened successfully.')
  } else {
    console.log('Data structure looks correct or is empty. No flattening needed.')
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
