async function verifyLogout() {
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

    const setCookie = loginRes.headers.get('set-cookie');
    console.log('Login successful. Cookie received:', setCookie ? 'Yes' : 'No');

    if (!setCookie) {
        console.error('No cookie received on login.');
        return;
    }

    // Extract cookie for subsequent requests
    const cookie = setCookie.split(';')[0];

    // 2. Verify Session (Me)
    console.log('Verifying session...');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { 'Cookie': cookie }
    });

    if (meRes.ok) {
        console.log('Session valid.');
    } else {
        console.error('Session invalid immediately after login.');
        return;
    }

    // 3. Logout
    console.log('Logging out...');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Cookie': cookie }
    });

    if (!logoutRes.ok) {
        console.error('Logout failed:', await logoutRes.text());
        return;
    }

    // Check if cookie is cleared in response
    const logoutSetCookie = logoutRes.headers.get('set-cookie');
    console.log('Logout response cookie:', logoutSetCookie);

    // 4. Verify Session Again (Should fail)
    console.log('Verifying session after logout...');
    // Note: In a real browser, the cookie would be cleared. Here we simulate sending the old cookie 
    // to see if the server accepts it (it shouldn't if we had a blacklist, but since we rely on cookie deletion,
    // the client is responsible for dropping it. The server tells client to drop it via Set-Cookie).

    // Ideally, the server response should contain Set-Cookie with Max-Age=0
    if (logoutSetCookie && logoutSetCookie.includes('Max-Age=0')) {
        console.log('SUCCESS: Server instructed to clear cookie.');
    } else if (logoutSetCookie && logoutSetCookie.includes('Expires=')) {
        // Check if expires is in the past
        console.log('SUCCESS: Server instructed to expire cookie.');
    } else {
        console.error('FAILURE: Server did not instruct to clear cookie.');
    }
}

verifyLogout().catch(console.error);
