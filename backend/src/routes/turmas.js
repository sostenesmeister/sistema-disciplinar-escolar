import express from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);

const turmaSchema = z.object({
    nome: z.string().min(1).max(50),
    serie: z.string().min(1).max(50),
    turno: z.enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL']),
    ano_letivo: z.number().int().min(2000).max(2100),
    professor_responsavel: z.string().max(150).optional().nullable(),
    status: z.enum(['ATIVA', 'INATIVA', 'ENCERRADA']).default('ATIVA'),
});

router.get('/', async (_req, res, next) => {
    try {
        const result = await query(`
            SELECT t.*, COUNT(a.id)::int AS total_alunos
            FROM turmas t
            LEFT JOIN alunos a ON a.turma_id = t.id AND a.status = 'ATIVO'
            GROUP BY t.id ORDER BY t.ano_letivo DESC, t.nome
        `);
        res.json(result.rows);
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM turmas WHERE id = $1', [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Turma não encontrada' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

router.post('/', autorizar('ADMIN'), async (req, res, next) => {
    try {
        const d = turmaSchema.parse(req.body);
        const result = await query(`
            INSERT INTO turmas (nome, serie, turno, ano_letivo, professor_responsavel, status)
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
        `, [d.nome, d.serie, d.turno, d.ano_letivo, d.professor_responsavel || null, d.status]);
        res.status(201).json(result.rows[0]);
    } catch (err) { next(err); }
});

router.put('/:id', autorizar('ADMIN'), async (req, res, next) => {
    try {
        const data = turmaSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length) return res.status(400).json({ error: 'Nada para atualizar' });
        const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const result = await query(
            `UPDATE turmas SET ${setClauses} WHERE id = $${values.length} RETURNING *`, values);
        if (!result.rowCount) return res.status(404).json({ error: 'Turma não encontrada' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

router.delete('/:id', autorizar('ADMIN'), async (req, res, next) => {
    try {
        const result = await query(
            `UPDATE turmas SET status = 'INATIVA' WHERE id = $1 RETURNING id`, [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Turma não encontrada' });
        res.json({ ok: true });
    } catch (err) { next(err); }
});

export default router;
