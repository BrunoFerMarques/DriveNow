async function verifyPricing() {
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

    // 2. Get a car
    const carsRes = await fetch(`${baseUrl}/api/cars?type=RENT`, { headers: { 'Cookie': cookie } });
    const cars = await carsRes.json();
    const car = cars[0];
    console.log(`Car: ${car.brand} ${car.model}, Price: ${car.price}`);

    const expectedDailyRate = car.price * 0.0005;
    console.log(`Expected Daily Rate (0.05%): ${expectedDailyRate}`);

    // 3. Rent for 5 days
    const days = 5;
    const expectedTotal = expectedDailyRate * days;
    console.log(`Renting for ${days} days. Expected Total: ${expectedTotal}`);

    const rentRes = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            carId: car.id,
            days,
            pickupLocation: 'Caçapava - SP',
            startDate: '2026-02-01'
        })
    });

    if (!rentRes.ok) {
        console.error('Rent failed:', await rentRes.text());
        return;
    }

    const transaction = await rentRes.json();
    console.log(`Transaction Total Value: ${transaction.totalValue}`);

    if (Math.abs(transaction.totalValue - expectedTotal) < 0.01) {
        console.log('SUCCESS: Pricing is correct.');
    } else {
        console.error('FAILURE: Pricing mismatch.');
    }
}

verifyPricing().catch(console.error);
