const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.car.updateMany({
            data: {
                imageUrl: null,
            },
        });
        console.log(`Successfully reset images for ${result.count} cars.`);
    } catch (error) {
        console.error('Error resetting images:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
