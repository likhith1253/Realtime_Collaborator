/**
 * Single source of truth for DATABASE_URL normalization and safe logging.
 * Used by migrate.js and service startup diagnostics.
 */

function normalizeDatabaseUrl() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        throw new Error('DATABASE_URL is not defined');
    }

    if (!dbUrl.includes('sslmode') && process.env.NODE_ENV === 'production') {
        const separator = dbUrl.includes('?') ? '&' : '?';
        process.env.DATABASE_URL = `${dbUrl}${separator}sslmode=require`;
    }

    return process.env.DATABASE_URL;
}

function getDatabaseHostInfo(dbUrl) {
    try {
        const parsed = new URL(dbUrl);
        return {
            host: parsed.hostname,
            port: parsed.port || '5432',
            database: parsed.pathname.replace(/^\//, ''),
            sslmode: parsed.searchParams.get('sslmode') || '(none)',
            user: parsed.username,
        };
    } catch {
        return { host: '(unparseable)', port: '', database: '', sslmode: '', user: '' };
    }
}

function logDatabaseConfig(serviceName) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error(`[${serviceName}] CRITICAL: DATABASE_URL is not defined`);
        return null;
    }

    const info = getDatabaseHostInfo(dbUrl);
    console.log(`[${serviceName}] DATABASE_URL host: ${info.host}:${info.port}`);
    console.log(`[${serviceName}] DATABASE_URL database: ${info.database}`);
    console.log(`[${serviceName}] DATABASE_URL sslmode: ${info.sslmode}`);
    console.log(`[${serviceName}] DATABASE_URL user: ${info.user}`);
    return info;
}

module.exports = {
    normalizeDatabaseUrl,
    getDatabaseHostInfo,
    logDatabaseConfig,
};
