async function verifyOverlap() {
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
    const carsRes = await fetch(`${baseUrl}/api/cars?type=RENT`, {
        headers: { 'Cookie': cookie }
    });
    const cars = await carsRes.json();
    const car = cars[0];
    console.log(`Testing with car: ${car.brand} ${car.model} (${car.id})`);

    // Helper to rent
    const rent = async (start, days) => {
        const res = await fetch(`${baseUrl}/api/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },
            body: JSON.stringify({
                carId: car.id,
                days,
                pickupLocation: 'Caçapava - SP',
                startDate: start
            })
        });
        return res;
    };

    // 3. Rent 1: Dec 1 - Dec 5 (5 days)
    console.log('Attempting Rent 1: 2025-12-01 (5 days)...');
    const res1 = await rent('2025-12-01', 5);
    if (res1.ok) console.log('Rent 1 Success');
    else console.error('Rent 1 Failed:', await res1.text());

    // 4. Rent 2: Dec 3 - Dec 7 (Overlap) -> Should Fail
    console.log('Attempting Rent 2 (Overlap): 2025-12-03 (5 days)...');
    const res2 = await rent('2025-12-03', 5);
    if (res2.status === 400) console.log('Rent 2 Failed as expected (Overlap).');
    else console.error('Rent 2 Unexpected:', res2.status, await res2.text());

    // 5. Rent 3: Dec 7 - Dec 10 (No Overlap) -> Should Success
    // Note: Rent 1 ends on Dec 6 (Dec 1 + 5 days = Dec 6 00:00:00? Wait.
    // Logic: endDate = startDate + days. 
    // If start Dec 1, days 5 -> endDate = Dec 6.
    // Overlap check: startDate <= existingEnd AND endDate >= existingStart.
    // Rent 1: [Dec 1, Dec 6]
    // Rent 3: Start Dec 7.
    // Dec 7 <= Dec 6 is False. No overlap.
    console.log('Attempting Rent 3 (No Overlap): 2025-12-07 (3 days)...');
    const res3 = await rent('2025-12-07', 3);
    if (res3.ok) console.log('Rent 3 Success.');
    else console.error('Rent 3 Failed:', await res3.text());
}

verifyOverlap().catch(console.error);
