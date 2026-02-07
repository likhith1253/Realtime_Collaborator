
import { PrismaClient } from '@collab/database';

const prisma = new PrismaClient();

async function main() {
    // @ts-ignore
    if (prisma.slide) {
        console.log('prisma.slide exists!');
    } else {
        console.log('prisma.slide is UNDEFINED');
    }
    await prisma.$disconnect();
}

main();
