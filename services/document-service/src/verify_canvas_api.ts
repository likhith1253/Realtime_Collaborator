
import { randomUUID } from 'crypto';
import * as fs from 'fs';

const AUTH_URL = 'http://localhost:3001/auth';
const DOC_URL = 'http://localhost:3002';
const LOG_FILE = 'verification_result.log';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function verify() {
    fs.writeFileSync(LOG_FILE, '--- Starting Canvas API Verification ---\n');
    log('--- Starting Canvas API Verification ---');

    // 1. Setup User
    const email = `test-canvas-${randomUUID()}@example.com`;
    const password = 'Password123!';
    const name = 'Canvas Tester';

    log(`1. Registering user: ${email}`);
    const signupRes = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: name })
    });

    if (!signupRes.ok) {
        log(`Signup failed: ${await signupRes.text()}`);
        return;
    }
    const signupData = await signupRes.json();
    let authToken = signupData.token;

    if (!authToken) {
        log('Signup didn\'t return token, logging in...');
        const loginRes = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!loginRes.ok) throw new Error('Login failed');
        const loginData = await loginRes.json();
        authToken = loginData.token;
    }
    log('Authentication successful.');

    // 2. Create Project
    log('2. Creating Project');
    const projectRes = await fetch(`${DOC_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            name: 'Canvas Test Project',
            description: 'Testing canvas backend'
        })
    });

    if (!projectRes.ok) {
        log(`Create Project failed: ${await projectRes.text()}`);
        return;
    }
    const project = await projectRes.json();
    const projectId = project.id;
    log(`Project created: ${projectId}`);

    // 3. Get Canvas
    log('3. Fetching Initial Canvas');
    const getRes1 = await fetch(`${DOC_URL}/projects/${projectId}/canvas`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (getRes1.ok) {
        const canvas = await getRes1.json();
        log(`Initial Canvas fetched: ${JSON.stringify(canvas)}`);
        if (canvas.project_id !== projectId) log('Mismatch in project ID');
    } else {
        log(`Failed to fetch initial canvas. Status: ${getRes1.status}. Body: ${await getRes1.text()}`);
    }

    // 4. Create/Post Canvas
    log('4. Create/Set Canvas Data');
    const canvasData = { nodes: [{ id: 'n1', type: 'text', x: 100, y: 100, content: 'Hello' }] };
    let canvasId = '';

    const postRes = await fetch(`${DOC_URL}/projects/${projectId}/canvas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ data: canvasData })
    });

    if (postRes.ok) {
        const createdCanvas = await postRes.json();
        log(`Canvas created successfully: ${createdCanvas.id}`);
        canvasId = createdCanvas.id;

        if (JSON.stringify(createdCanvas.data) !== JSON.stringify(canvasData)) {
            log(`Created canvas data mismatch. Expected: ${JSON.stringify(canvasData)}, Got: ${JSON.stringify(createdCanvas.data)}`);
        }
    } else {
        log(`Create Canvas failed. Status: ${postRes.status}. Body: ${await postRes.text()}`);
    }

    // If we missed canvasId from POST, try to get it again
    if (!canvasId) {
        const getRes2 = await fetch(`${DOC_URL}/projects/${projectId}/canvas`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (getRes2.ok) {
            const canvas = await getRes2.json();
            canvasId = canvas.id;
        }
    }

    if (!canvasId) {
        log('Critical: Could not obtain canvasId to proceed with update test');
        return;
    }

    // 5. Update Canvas
    log('5. Updating Canvas');
    const updatedData = { nodes: [{ id: 'n1', type: 'text', x: 200, y: 200, content: 'Moved' }] };
    const putRes = await fetch(`${DOC_URL}/canvas/${canvasId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ data: updatedData })
    });

    if (putRes.ok) {
        const updatedCanvas = await putRes.json();
        log('Canvas updated successfully');
        if (JSON.stringify(updatedCanvas.data) !== JSON.stringify(updatedData)) {
            log(`Update verification failed: Data mismatch. Expected: ${JSON.stringify(updatedData)}, Got: ${JSON.stringify(updatedCanvas.data)}`);
        } else {
            log('Data verification passed');
        }
    } else {
        log(`Update Canvas failed: ${await putRes.text()}`);
    }

    log('--- Verification Complete ---');
}

verify().catch(e => {
    log(`ERROR: ${e.message}`);
    console.error(e);
});
