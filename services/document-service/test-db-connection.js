const { Client } = require('pg');

const configs = [
    { user: 'collab_user', password: 'collab_pass', database: 'collab_db' },
    { user: 'postgres', password: 'password', database: 'postgres' },
    { user: 'postgres', password: 'collab_pass', database: 'collab_db' },
    { user: 'postgres', password: 'postgres', database: 'postgres' },
    { user: 'postgres', password: 'admin', database: 'postgres' },
    { user: 'postgres', password: '', database: 'postgres' }
];

async function testConnection() {
    console.log('Testing database connections on port 5432...');

    for (const config of configs) {
        const client = new Client({
            host: '127.0.0.1',
            port: 5432,
            user: config.user,
            password: config.password,
            database: config.database
        });

        try {
            console.log(`Trying ${config.user}:${config.password}@${config.database}...`);
            await client.connect();
            console.log(`✅ SUCCESS! Connected with: ${config.user}:${config.password}@${config.database}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`❌ Failed: ${err.message}`);
        } finally {
            try { await client.end(); } catch (e) {}
        }
    }

    console.log('All attempts failed.');
    process.exit(1);
}

testConnection();
