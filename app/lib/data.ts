import prisma from './prisma';

export async function getProperties() {
    try {
        const properties = await prisma.property.findMany({
            include: {
                units: true,
            },
        });
        return properties;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch properties data.');
    }
}
