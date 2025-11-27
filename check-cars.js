const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCars() {
    const total = await prisma.car.count();
    const rent = await prisma.car.count({ where: { type: 'RENT' } });
    const sale = await prisma.car.count({ where: { type: 'SALE' } });
    const available = await prisma.car.count({ where: { available: true } });
    const rentAvailable = await prisma.car.count({ where: { type: 'RENT', available: true } });

    console.log({
        total,
        rent,
        sale,
        available,
        rentAvailable
    });
}

checkCars()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
