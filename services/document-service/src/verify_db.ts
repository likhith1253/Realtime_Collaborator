
import { PrismaClient } from '@collab/database';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking for slides table...');
        const result = await prisma.$queryRaw`SELECT count(*) FROM slides`;
        console.log('Result:', result);
        console.log('Slides table exists!');
    } catch (e) {
        console.error('Error querying slides table:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
