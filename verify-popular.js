async function verifyPopular() {
    const baseUrl = 'http://localhost:3000';

    console.log('Fetching popular cars...');
    const res = await fetch(`${baseUrl}/api/cars?sort=popular`);

    if (!res.ok) {
        console.error('Fetch failed:', res.status, res.statusText, await res.text());
        return;
    }

    const cars = await res.json();
    console.log(`Got ${cars.length} cars.`);

    if (cars.length > 0) {
        console.log('First car:', cars[0].brand, cars[0].model, 'Transactions:', cars[0]._count?.transactions);
    }
}

verifyPopular().catch(console.error);
