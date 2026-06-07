const { execSync } = require('child_process');

let dbUrl = process.env.DATABASE_URL;
if (dbUrl && !dbUrl.includes('sslmode') && process.env.NODE_ENV === 'production') {
    const separator = dbUrl.includes('?') ? '&' : '?';
    dbUrl = `${dbUrl}${separator}sslmode=require`;
    process.env.DATABASE_URL = dbUrl;
    console.log('[Migrate] Appended sslmode=require for Render PostgreSQL.');
}

console.log('[Migrate] Running database migrations...');
try {
    execSync('npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma', {
        stdio: 'inherit',
        env: process.env
    });
    console.log('[Migrate] Migrations completed successfully.');
} catch (error) {
    console.error('[Migrate] Migrations failed:', error.message);
    process.exit(1);
}
