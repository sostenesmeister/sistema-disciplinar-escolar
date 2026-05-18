import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../db.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);
router.use(autorizar('ADMIN')); // só admin gerencia usuários

const usuarioSchema = z.object({
    login: z.string().min(2).max(50),
    senha: z.string().min(6).max(100).optional(),
    nome: z.string().min(2).max(150),
    email: z.string().email().optional().nullable(),
    perfil: z.enum(['ADMIN', 'COORDENADOR', 'PROFESSOR']),
    ativo: z.boolean().default(true),
});

router.get('/', async (_req, res, next) => {
    try {
        const result = await query(`
            SELECT id, login, nome, email, perfil, ativo, ultimo_acesso, criado_em
            FROM usuarios ORDER BY nome
        `);
        res.json(result.rows);
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const d = usuarioSchema.parse(req.body);
        if (!d.senha) return res.status(400).json({ error: 'Senha obrigatória ao criar usuário' });
        const hash = await bcrypt.hash(d.senha, 10);
        const result = await query(`
            INSERT INTO usuarios (login, senha_hash, nome, email, perfil, ativo)
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, login, nome, email, perfil, ativo
        `, [d.login, hash, d.nome, d.email || null, d.perfil, d.ativo]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'Login já existe' });
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const data = usuarioSchema.partial().parse(req.body);
        const updates = [];
        const values = [];
        let i = 1;
        for (const [k, v] of Object.entries(data)) {
            if (k === 'senha') {
                if (!v) continue;
                updates.push(`senha_hash = $${i++}`);
                values.push(await bcrypt.hash(v, 10));
            } else {
                updates.push(`${k} = $${i++}`);
                values.push(v);
            }
        }
        if (!updates.length) return res.status(400).json({ error: 'Nada para atualizar' });
        values.push(req.params.id);
        const result = await query(
            `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${i}
             RETURNING id, login, nome, email, perfil, ativo`,
            values);
        if (!result.rowCount) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        // Desativar em vez de deletar
        const result = await query(
            `UPDATE usuarios SET ativo = FALSE WHERE id = $1 RETURNING id`,
            [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ ok: true });
    } catch (err) { next(err); }
});

export default router;
