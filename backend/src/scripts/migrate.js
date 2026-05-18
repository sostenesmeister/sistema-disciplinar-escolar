// Script para rodar todas as migrations em ordem
// Uso: npm run migrate
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { query, default as pool } from '../db.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', '..', '..', 'database', 'migrations');

async function main() {
    console.log('🚀 Rodando migrations...');
    console.log('📂 Diretório:', MIGRATIONS_DIR);

    const arquivos = (await readdir(MIGRATIONS_DIR))
        .filter((f) => f.endsWith('.sql'))
        .sort();

    for (const arquivo of arquivos) {
        const sql = await readFile(join(MIGRATIONS_DIR, arquivo), 'utf-8');
        console.log(`\n➡️  Executando ${arquivo}...`);
        try {
            await query(sql);
            console.log(`✅ ${arquivo} — OK`);
        } catch (err) {
            console.error(`❌ ${arquivo} — ${err.message}`);
            process.exit(1);
        }
    }
    console.log('\n🎉 Todas as migrations rodaram com sucesso!');
    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
