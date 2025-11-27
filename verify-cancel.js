async function verifyCancel() {
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
    const cookie = loginRes.headers.get('set-cookie').split(';')[0];
    console.log('Login successful.');

    // 2. Rent a car
    console.log('Creating a rental to cancel...');
    const carsRes = await fetch(`${baseUrl}/api/cars?type=RENT`, { headers: { 'Cookie': cookie } });
    const cars = await carsRes.json();
    const car = cars[0];

    const rentRes = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            carId: car.id,
            days: 2,
            pickupLocation: 'Caçapava - SP',
            startDate: '2025-12-20'
        })
    });

    if (!rentRes.ok) {
        console.error('Rent failed:', await rentRes.text());
        return;
    }
    const transaction = await rentRes.json();
    console.log('Rental created:', transaction.id);

    // 3. Cancel the rental
    console.log('Canceling rental...');
    const cancelRes = await fetch(`${baseUrl}/api/transactions/${transaction.id}`, {
        method: 'DELETE',
        headers: { 'Cookie': cookie }
    });

    if (cancelRes.ok) {
        console.log('SUCCESS: Rental canceled.');
    } else {
        console.error('FAILURE: Cancel failed:', await cancelRes.text());
    }
}

verifyCancel().catch(console.error);
