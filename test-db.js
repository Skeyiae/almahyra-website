const { Client } = require('pg');

const connectionString = "postgresql://postgres:almahyraT3kn0123@db.uozskneinkzwtudsypqp.supabase.co:5432/postgres";

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('Connecting to:', connectionString.replace(/:[^:]*@/, ':****@'));
        await client.connect();
        console.log('Successfully connected!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error details:', err);
        process.exit(1);
    }
}

testConnection();
