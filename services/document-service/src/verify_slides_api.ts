
import { randomUUID } from 'crypto';

const AUTH_URL = 'http://localhost:3001/auth'; // Adjust based on confirmation
const DOC_URL = 'http://localhost:3002';

async function verify() {
    const email = `test-${randomUUID()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    console.log(`1. Registering user: ${email}`);
    const signupRes = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name })
    });

    if (!signupRes.ok) {
        console.error('Signup failed:', await signupRes.text());
        return;
    }
    const signupData = await signupRes.json();
    const token = signupData.token;
    let authToken = token;

    if (!authToken) {
        console.log('Signup didn\'t return token, logging in...');
        const loginRes = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!loginRes.ok) throw new Error('Login failed');
        const loginData = await loginRes.json();
        authToken = loginData.token;
    }
    console.log('Authentication successful. Token obtained.');

    // Debug: Check user details
    const meRes = await fetch(`${AUTH_URL}/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (meRes.ok) {
        const me = await meRes.json();
        console.log('User details:', JSON.stringify(me, null, 2));
    } else {
        console.log('Failed to fetch /me:', await meRes.text());
    }

    console.log('2. Creating Project');
    const projectRes = await fetch(`${DOC_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            name: 'Slide Test Project',
            description: 'Testing slides'
        })
    });

    if (!projectRes.ok) {
        console.error('Create Project failed:', await projectRes.text());
        return;
    }
    const project = await projectRes.json();
    const projectId = project.id;
    console.log(`Project created: ${projectId}`);

    console.log('3. Creating Slide');
    const slideRes = await fetch(`${DOC_URL}/projects/${projectId}/slides`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            title: 'My First Slide',
            content: '# Hello World'
        })
    });

    if (!slideRes.ok) {
        console.error('Create Slide failed:', await slideRes.text());
        return;
    }
    const slide = await slideRes.json();
    console.log(`Slide created: ${slide.id}, Order: ${slide.order}`);

    console.log('4. Listing Slides');
    const listRes = await fetch(`${DOC_URL}/projects/${projectId}/slides`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const slides = await listRes.json();
    console.log(`Found ${slides.length} slides`);
    if (slides.length !== 1) console.error('Expected 1 slide');

    console.log('5. Updating Slide');
    const updateRes = await fetch(`${DOC_URL}/slides/${slide.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            title: 'Updated Title',
            order: 5
        })
    });
    const updatedSlide = await updateRes.json();
    console.log(`Updated title: ${updatedSlide.title}, Order: ${updatedSlide.order}`);

    console.log('6. Deleting Slide');
    const deleteRes = await fetch(`${DOC_URL}/slides/${slide.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (deleteRes.ok) {
        console.log('Slide deleted');
    } else {
        console.error('Delete failed');
    }

    console.log('Verification Complete!');
}

verify().catch(console.error);
