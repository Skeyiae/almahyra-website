import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Fix: Adding specIcons Column ---');
    try {
        // Run raw SQL to add the column if it doesn't exist
        // Note: Using JSONB for PostgreSQL (Supabase)
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "Property" 
            ADD COLUMN IF NOT EXISTS "specIcons" JSONB DEFAULT '{}';
        `);
        console.log('✅ Column "specIcons" added successfully or already exists.');
    } catch (error) {
        console.error('❌ Error adding column:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
