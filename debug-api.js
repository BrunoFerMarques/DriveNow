async function debugApi() {
    const res = await fetch('http://localhost:3000/api/cars?type=RENT');
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
}

debugApi().catch(console.error);
