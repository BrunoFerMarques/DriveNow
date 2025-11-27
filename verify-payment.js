async function verifyPayment() {
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

    // 3. Rent with PIX
    console.log('Renting with PIX...');
    const pixRes = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            carId: car.id,
            days: 2,
            pickupLocation: 'Caçapava - SP',
            startDate: '2026-03-01',
            paymentMethod: 'PIX'
        })
    });

    if (pixRes.ok) console.log('PIX Rent Success');
    else console.error('PIX Rent Failed:', await pixRes.text());

    // 4. Rent with CREDIT_CARD
    console.log('Renting with CREDIT_CARD...');
    const cardRes = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({
            carId: car.id,
            days: 2,
            pickupLocation: 'Caçapava - SP',
            startDate: '2026-03-10',
            paymentMethod: 'CREDIT_CARD'
        })
    });

    if (cardRes.ok) console.log('Card Rent Success');
    else console.error('Card Rent Failed:', await cardRes.text());
}

verifyPayment().catch(console.error);
