import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
    console.error('Erro inesperado no pool do PostgreSQL', err);
    process.exit(-1);
});

export async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
        console.log('[SQL]', { text: text.substring(0, 80), duration, rows: res.rowCount });
    }
    return res;
}

export async function getClient() {
    return pool.connect();
}

export default pool;
