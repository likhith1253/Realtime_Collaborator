
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://collab_user:collab_pass@127.0.0.1:5433/collab_db',
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to DB');
    
    const res = await client.query('SELECT id, name FROM projects LIMIT 5');
    console.log('Projects:', res.rows);
    
    // Check for weird IDs
    res.rows.forEach(row => {
        console.log(`ID: "${row.id}" (Type: ${typeof row.id})`);
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
