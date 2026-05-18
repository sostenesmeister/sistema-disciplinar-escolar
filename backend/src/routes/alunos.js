import express from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);

const alunoSchema = z.object({
    matricula: z.string().min(1).max(30),
    nome: z.string().min(2).max(150),
    turma_id: z.number().int().positive(),
    data_nascimento: z.string().optional().nullable(),
    responsavel: z.string().max(150).optional().nullable(),
    telefone_responsavel: z.string().max(30).optional().nullable(),
    email_responsavel: z.string().email().optional().nullable(),
    status: z.enum(['ATIVO', 'TRANSFERIDO', 'EVADIDO', 'CONCLUIDO']).default('ATIVO'),
});

// Listar todos os alunos (com nome da turma)
router.get('/', async (req, res, next) => {
    try {
        const { turma_id, status, busca } = req.query;
        let sql = `
            SELECT a.*, t.nome AS turma_nome, t.serie, t.turno
            FROM alunos a
            INNER JOIN turmas t ON t.id = a.turma_id
            WHERE 1=1
        `;
        const params = [];
        if (turma_id) { params.push(turma_id); sql += ` AND a.turma_id = $${params.length}`; }
        if (status)   { params.push(status);   sql += ` AND a.status = $${params.length}`; }
        if (busca) {
            params.push(`%${busca}%`);
            sql += ` AND (a.nome ILIKE $${params.length} OR a.matricula ILIKE $${params.length})`;
        }
        sql += ' ORDER BY a.nome';
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) { next(err); }
});

// Buscar aluno por id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await query(`
            SELECT a.*, t.nome AS turma_nome, t.serie, t.turno
            FROM alunos a INNER JOIN turmas t ON t.id = a.turma_id
            WHERE a.id = $1
        `, [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

// Histórico de ocorrências do aluno
router.get('/:id/historico', async (req, res, next) => {
    try {
        const result = await query(`
            SELECT o.*, u.nome AS registrado_por_nome
            FROM ocorrencias o
            LEFT JOIN usuarios u ON u.id = o.registrado_por_id
            WHERE o.aluno_id = $1
            ORDER BY o.data_ocorrencia DESC, o.id DESC
        `, [req.params.id]);
        res.json(result.rows);
    } catch (err) { next(err); }
});

// Criar aluno (admin e coordenador)
router.post('/', autorizar('ADMIN', 'COORDENADOR'), async (req, res, next) => {
    try {
        const data = alunoSchema.parse(req.body);
        const result = await query(`
            INSERT INTO alunos (matricula, nome, turma_id, data_nascimento, responsavel, telefone_responsavel, email_responsavel, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [data.matricula, data.nome, data.turma_id, data.data_nascimento || null,
            data.responsavel || null, data.telefone_responsavel || null, data.email_responsavel || null, data.status]);
        res.status(201).json(result.rows[0]);
    } catch (err) { next(err); }
});

// Atualizar aluno
router.put('/:id', autorizar('ADMIN', 'COORDENADOR'), async (req, res, next) => {
    try {
        const data = alunoSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length) return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const result = await query(
            `UPDATE alunos SET ${setClauses} WHERE id = $${values.length} RETURNING *`,
            values
        );
        if (!result.rowCount) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

// Inativar aluno (não deleta — preserva histórico)
router.delete('/:id', autorizar('ADMIN'), async (req, res, next) => {
    try {
        const result = await query(
            `UPDATE alunos SET status = 'EVADIDO' WHERE id = $1 RETURNING id`,
            [req.params.id]
        );
        if (!result.rowCount) return res.status(404).json({ error: 'Aluno não encontrado' });
        res.json({ ok: true, mensagem: 'Aluno marcado como evadido (histórico preservado)' });
    } catch (err) { next(err); }
});

export default router;
