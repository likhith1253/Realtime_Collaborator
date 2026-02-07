
const { PrismaClient } = require('@collab/database');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Debugging Canvas DB ---');

        // 1. Check if we can connect and query schema
        console.log('1. Querying raw canvas table...');
        try {
            const raw = await prisma.$queryRaw`SELECT * FROM canvas LIMIT 1`;
            console.log('   Success. Rows returned:', raw.length);
            if (raw.length > 0) {
                console.log('   Sample row keys:', Object.keys(raw[0]));
            }
        } catch (e) {
            console.error('   FAILED to query canvas table:', e.message);
        }

        // 2. Mock parameters (using a likely UUID just to check syntax)
        const projectId = '20408d98-2dcc-4d92-b1a6-9c471021d4c8';
        const userId = '00000000-0000-0000-0000-000000000000'; // Dummy

        console.log('\n2. Testing getProjectCanvases query...');
        try {
            const canvases = await prisma.$queryRaw`
                SELECT * FROM canvas 
                WHERE project_id = ${projectId}::uuid 
                ORDER BY created_at DESC
            `;
            console.log('   Success. Canvases found:', canvases.length);
        } catch (e) {
            console.error('   FAILED getProjectCanvases query:', e);
        }

    } catch (err) {
        console.error('Global Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
