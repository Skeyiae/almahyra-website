import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const prop = await prisma.property.findUnique({
    where: { id: 'albirruni' }
  })
  if (prop) {
    console.log("imagesStandard type:", typeof prop.imagesStandard);
    console.log("isArray?", Array.isArray(prop.imagesStandard));
  }
}

main().finally(() => prisma.$disconnect())
