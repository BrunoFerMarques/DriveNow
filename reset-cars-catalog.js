const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetCars() {
    console.log('Resetting cars...');
    const update = await prisma.car.updateMany({
        data: {
            type: 'RENT',
            available: true
        }
    });
    console.log(`Updated ${update.count} cars.`);
}

resetCars()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
