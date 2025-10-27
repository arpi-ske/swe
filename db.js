const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password : "1",
});

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("Connected to the database");
        client.release();
    } catch (err) {
        console.error("Database connection error", err.stack);
        process.exit(1);
    }
}

module.exports = { pool, connectDB };