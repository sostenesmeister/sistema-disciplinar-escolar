// Gera hashes bcrypt válidos para os usuários iniciais
// Uso: node src/scripts/seed.js
import bcrypt from 'bcryptjs';
import { query, default as pool } from '../db.js';

const usuarios = [
    { login: 'admin', senha: 'escola123', nome: 'Administrador do Sistema', email: 'admin@escola.com.br', perfil: 'ADMIN' },
    { login: 'maria', senha: 'prof123',   nome: 'Maria Silva',              email: 'maria@escola.com.br', perfil: 'PROFESSOR' },
    { login: 'joao',  senha: 'coord123',  nome: 'João Souza',               email: 'joao.coord@escola.com.br', perfil: 'COORDENADOR' },
];

async function main() {
    console.log('🌱 Re-seed de usuários com hashes bcrypt válidos...');
    for (const u of usuarios) {
        const hash = await bcrypt.hash(u.senha, 10);
        await query(`
            INSERT INTO usuarios (login, senha_hash, nome, email, perfil)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (login) DO UPDATE SET senha_hash = EXCLUDED.senha_hash
        `, [u.login, hash, u.nome, u.email, u.perfil]);
        console.log(`✅ ${u.login} (${u.perfil})`);
    }
    console.log('🎉 Seed concluído!');
    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
