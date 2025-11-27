const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@drivenow.com' },
        update: {},
        create: {
            email: 'admin@drivenow.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin created:', admin.email);

    // Create Cars
    const cars = [
        {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2024,
            type: 'RENT',
            price: 150,
            imageUrl: 'https://images.unsplash.com/photo-1623869675781-80e6568f29dc?q=80&w=1000&auto=format&fit=crop',
        },
        {
            brand: 'Honda',
            model: 'Civic',
            year: 2024,
            type: 'RENT',
            price: 160,
            imageUrl: 'https://images.unsplash.com/photo-1606152421811-aa911307c423?q=80&w=1000&auto=format&fit=crop',
        },
        {
            brand: 'BMW',
            model: 'X5',
            year: 2024,
            type: 'SALE',
            price: 450000,
            imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba9545225a?q=80&w=1000&auto=format&fit=crop',
        },
        {
            brand: 'Porsche',
            model: '911',
            year: 2024,
            type: 'SALE',
            price: 1200000,
            imageUrl: 'https://images.unsplash.com/photo-1611821064430-0d4104816000?q=80&w=1000&auto=format&fit=crop',
        },
    ];

    for (const car of cars) {
        await prisma.car.create({ data: car });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
