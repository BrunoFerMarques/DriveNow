// Using native fetch in Node.js

async function verify() {
    const baseUrl = 'http://localhost:3000';

    // 1. Login
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@drivenow.com', password: 'admin123' }) // Assuming these creds exist from seed
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token received:', token ? 'Yes' : 'No');

    if (!token) {
        console.error('No token returned!');
        return;
    }

    // 2. Fetch Cars with Token
    console.log('Fetching cars with Bearer token...');
    const carsRes = await fetch(`${baseUrl}/api/cars`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!carsRes.ok) {
        console.error('Fetch cars failed:', await carsRes.text());
        return;
    }

    const cars = await carsRes.json();
    console.log(`Fetch successful. Got ${cars.length} cars.`);
}

verify().catch(console.error);
