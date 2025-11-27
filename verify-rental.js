async function verifyRental() {
    const baseUrl = 'http://localhost:3000';

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@drivenow.com', password: 'admin123' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const { token } = await loginRes.json();
    console.log('Login successful.');

    // 2. Get a car to rent
    console.log('Fetching cars...');
    const carsRes = await fetch(`${baseUrl}/api/cars?type=RENT&available=true`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const cars = await carsRes.json();

    if (cars.length === 0) {
        console.error('No available cars for rent.');
        return;
    }

    const car = cars[0];
    console.log(`Renting car: ${car.brand} ${car.model} (${car.id})`);

    // 3. Rent the car
    console.log('Creating transaction...');
    const rentRes = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            carId: car.id,
            days: 3,
            pickupLocation: 'Caçapava - SP'
        })
    });

    if (!rentRes.ok) {
        console.error('Rent failed:', await rentRes.text());
        return;
    }

    const transaction = await rentRes.json();
    console.log('Transaction created:', transaction.id);
    console.log('Pickup Location:', transaction.pickupLocation);

    if (transaction.pickupLocation === 'Caçapava - SP') {
        console.log('SUCCESS: Pickup location verified.');
    } else {
        console.error('FAILURE: Pickup location mismatch.');
    }
}

verifyRental().catch(console.error);
