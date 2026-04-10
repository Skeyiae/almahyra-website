import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      name: true
    }
  })
  console.log('List of Properties in Database:')
  console.log(JSON.stringify(properties, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
