import { getPrismaClient } from './index';

export interface DatabaseBootstrapResult {
    connected: boolean;
    host: string;
    port: string;
    database: string;
    sslmode: string;
    migrationTableExists: boolean;
    appliedMigrations: number;
    requiredTablesChecked: string[];
    missingRequiredTables: string[];
    error?: string;
}

export interface DatabaseBootstrapOptions {
    requiredTables?: string[];
}

function normalizeDatabaseUrl(): string {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        throw new Error('DATABASE_URL is not defined');
    }

    if (!dbUrl.includes('sslmode') && process.env.NODE_ENV === 'production') {
        const separator = dbUrl.includes('?') ? '&' : '?';
        const normalized = `${dbUrl}${separator}sslmode=require`;
        process.env.DATABASE_URL = normalized;
        return normalized;
    }

    return dbUrl;
}

function getHostInfo(dbUrl: string) {
    try {
        const parsed = new URL(dbUrl);
        return {
            host: parsed.hostname,
            port: parsed.port || '5432',
            database: parsed.pathname.replace(/^\//, ''),
            sslmode: parsed.searchParams.get('sslmode') || '(none)',
        };
    } catch {
        return {
            host: '(unparseable)',
            port: '',
            database: '',
            sslmode: '',
        };
    }
}

export async function initializeDatabase(
    serviceName: string,
    options: DatabaseBootstrapOptions = {}
): Promise<DatabaseBootstrapResult> {
    const dbUrl = normalizeDatabaseUrl();
    const hostInfo = getHostInfo(dbUrl);
    const requiredTables = options.requiredTables ?? [];

    console.log(`[${serviceName}] DATABASE_URL host: ${hostInfo.host}:${hostInfo.port}`);
    console.log(`[${serviceName}] DATABASE_URL database: ${hostInfo.database}`);
    console.log(`[${serviceName}] DATABASE_URL sslmode: ${hostInfo.sslmode}`);

    const prisma = getPrismaClient();
    let migrationTableExists = false;
    let appliedMigrations = 0;
    let missingRequiredTables: string[] = [];

    try {
        const connectionPromise = prisma.$connect();
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Database connection timed out after 30000ms')), 30000)
        );

        await Promise.race([connectionPromise, timeoutPromise]);
        await prisma.$queryRaw`SELECT 1`;
        console.log(`[${serviceName}] Prisma connection: OK`);

        try {
            const migrationRows = await prisma.$queryRaw<Array<{ count: bigint }>>`
                SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
            `;
            migrationTableExists = true;
            appliedMigrations = Number(migrationRows[0]?.count ?? 0);
            console.log(`[${serviceName}] Applied migrations: ${appliedMigrations}`);
        } catch {
            console.warn(`[${serviceName}] _prisma_migrations table not found - run migrate deploy on auth-service`);
        }

        if (requiredTables.length > 0) {
            const tableRows = await prisma.$queryRaw<Array<{ table_name: string }>>`
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
            `;

            const existingTables = new Set(tableRows.map((row) => row.table_name));
            missingRequiredTables = requiredTables.filter((table) => !existingTables.has(table));

            if (missingRequiredTables.length > 0) {
                throw new Error(`Required tables missing: ${missingRequiredTables.join(', ')}`);
            }

            console.log(`[${serviceName}] Required tables verified: ${requiredTables.join(', ')}`);
        }

        return {
            connected: true,
            host: hostInfo.host,
            port: hostInfo.port,
            database: hostInfo.database,
            sslmode: hostInfo.sslmode,
            migrationTableExists,
            appliedMigrations,
            requiredTablesChecked: requiredTables,
            missingRequiredTables,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[${serviceName}] Prisma connection FAILED: ${message}`);
        return {
            connected: false,
            host: hostInfo.host,
            port: hostInfo.port,
            database: hostInfo.database,
            sslmode: hostInfo.sslmode,
            migrationTableExists,
            appliedMigrations,
            requiredTablesChecked: requiredTables,
            missingRequiredTables,
            error: message,
        };
    }
}

export async function checkDatabaseHealth(): Promise<{ ok: boolean; error?: string }> {
    try {
        const prisma = getPrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
