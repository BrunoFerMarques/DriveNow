// Native fetch is available in Node 18+

async function verifyCarUpdate() {
    const baseUrl = 'http://localhost:3000';

    // 1. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@drivenow.com', password: 'admin123' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    const cookie = `auth_token=${token}`;
    console.log('Login successful.');

    // 2. Get a car to update
    console.log('Fetching cars...');
    const carsRes = await fetch(`${baseUrl}/api/cars?type=RENT`);
    const cars = await carsRes.json();

    if (cars.length === 0) {
        console.error('No cars found.');
        return;
    }

    const car = cars[0];
    console.log(`Updating car: ${car.brand} ${car.model} (${car.id})`);

    // 3. Update the car
    const updateRes = await fetch(`${baseUrl}/api/cars/${car.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            price: car.price + 100 // Change price slightly
        })
    });

    if (updateRes.ok) {
        const updatedCar = await updateRes.json();
        console.log('Update successful!');
        console.log(`New price: ${updatedCar.price}`);
    } else {
        console.error('Update failed:', await updateRes.text());
    }
}

verifyCarUpdate().catch(console.error);
