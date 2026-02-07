
import express from 'express';
import authRoutes from './routes/auth.routes';

const app = express();
const BASE_PATH = '/auth';

app.use(express.json());
app.use(BASE_PATH, authRoutes);

console.log('--- ROUTE VERIFICATION START ---');

// Check router stack
if (authRoutes.stack) {
    console.log('Auth Router Stack Size:', authRoutes.stack.length);
    authRoutes.stack.forEach((r: any) => {
        if (r.route && r.route.path) {
            const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
            console.log(`[ROUTE FOUND] ${methods} ${BASE_PATH}${r.route.path}`);
        }
    });
} else {
    console.error('ERROR: authRoutes has no stack. Is it a valid Router?');
}

// Start temporary server to test connectivity
const PORT = 3002; // Use different port to avoid conflict
const server = app.listen(PORT, async () => {
    console.log(`Temp Verification Server running on port ${PORT}`);

    // Use native fetch to self-test
    try {
        const response = await fetch(`http://localhost:${PORT}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        console.log(`POST /auth/register Status: ${response.status}`);
        if (response.status === 404) {
            console.error('FAIL: Endpoint returned 404');
        } else {
            console.log('SUCCESS: Endpoint reachable (even if 400/500)');
        }
    } catch (err) {
        console.error('FETCH ERROR:', err);
    } finally {
        server.close();
        console.log('--- ROUTE VERIFICATION END ---');
        process.exit(0);
    }
});
