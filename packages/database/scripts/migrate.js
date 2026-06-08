const { execSync } = require('child_process');
const { normalizeDatabaseUrl, logDatabaseConfig } = require('./db-env');

const serviceName = process.env.RENDER_SERVICE_NAME || 'migration-runner';

try {
    normalizeDatabaseUrl();
    logDatabaseConfig(serviceName);
} catch (error) {
    console.error(`[Migrate] ${error.message}`);
    process.exit(1);
}

console.log('[Migrate] Running database migrations (single source: auth-service on Render)...');

try {
    execSync('npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma', {
        stdio: 'inherit',
        env: process.env,
    });

    const statusOutput = execSync(
        'npx prisma migrate status --schema=packages/database/prisma/schema.prisma',
        { encoding: 'utf8', env: process.env }
    );
    console.log('[Migrate] Migration status:\n', statusOutput);
    console.log('[Migrate] Migrations completed successfully.');
} catch (error) {
    console.error('[Migrate] Migrations failed:', error.message);
    process.exit(1);
}
