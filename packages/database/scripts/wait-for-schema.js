const { PrismaClient } = require('@prisma/client');
const { normalizeDatabaseUrl, logDatabaseConfig } = require('./db-env');

const [, , serviceName = 'schema-waiter', requiredTablesArg = ''] = process.argv;
const requiredTables = requiredTablesArg
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const maxAttempts = Number(process.env.DB_WAIT_MAX_ATTEMPTS || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 5000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    normalizeDatabaseUrl();
    logDatabaseConfig(serviceName);

    const prisma = new PrismaClient();

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await prisma.$connect();
            await prisma.$queryRaw`SELECT 1`;

            if (requiredTables.length > 0) {
                const rows = await prisma.$queryRaw`
                    SELECT table_name
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                `;
                const existingTables = new Set(rows.map((row) => row.table_name));
                const missingTables = requiredTables.filter((table) => !existingTables.has(table));

                if (missingTables.length > 0) {
                    throw new Error(`Missing tables: ${missingTables.join(', ')}`);
                }
            }

            console.log(
                `[${serviceName}] Database schema is ready${requiredTables.length ? ` (${requiredTables.join(', ')})` : ''}.`
            );
            await prisma.$disconnect();
            return;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.warn(`[${serviceName}] Schema readiness check failed (${attempt}/${maxAttempts}): ${message}`);

            if (attempt === maxAttempts) {
                await prisma.$disconnect().catch(() => undefined);
                process.exit(1);
            }

            await sleep(delayMs);
        }
    }
}

main().catch((error) => {
    console.error(
        `[${serviceName}] Unexpected schema readiness failure: ${
            error instanceof Error ? error.message : String(error)
        }`
    );
    process.exit(1);
});
