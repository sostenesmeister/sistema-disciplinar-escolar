import express from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);

const ocorrenciaSchema = z.object({
    aluno_id: z.number().int().positive(),
    data_ocorrencia: z.string().optional(),
    hora_ocorrencia: z.string().optional().nullable(),
    tipo: z.string().min(1).max(50),
    gravidade: z.enum(['LEVE', 'MEDIA', 'GRAVE', 'GRAVISSIMA']).default('LEVE'),
    descricao: z.string().min(3),
    medida_aplicada: z.string().max(100).optional().nullable(),
    local_ocorrencia: z.string().max(100).optional().nullable(),
    responsavel_notificado: z.boolean().default(false),
    status: z.enum(['ABERTO', 'EM_ANALISE', 'CONCLUIDO', 'ARQUIVADO']).default('ABERTO'),
});

// Listar com filtros
router.get('/', async (req, res, next) => {
    try {
        const { aluno_id, status, gravidade, data_inicio, data_fim, busca, limit = 100 } = req.query;
        let sql = `
            SELECT o.*, a.nome AS aluno_nome, a.matricula, t.nome AS turma_nome,
                   u.nome AS registrado_por_nome
            FROM ocorrencias o
            INNER JOIN alunos a ON a.id = o.aluno_id
            INNER JOIN turmas t ON t.id = a.turma_id
            LEFT JOIN  usuarios u ON u.id = o.registrado_por_id
            WHERE 1=1
        `;
        const p = [];
        if (aluno_id)    { p.push(aluno_id);    sql += ` AND o.aluno_id = $${p.length}`; }
        if (status)      { p.push(status);      sql += ` AND o.status = $${p.length}`; }
        if (gravidade)   { p.push(gravidade);   sql += ` AND o.gravidade = $${p.length}`; }
        if (data_inicio) { p.push(data_inicio); sql += ` AND o.data_ocorrencia >= $${p.length}`; }
        if (data_fim)    { p.push(data_fim);    sql += ` AND o.data_ocorrencia <= $${p.length}`; }
        if (busca) {
            p.push(`%${busca}%`);
            sql += ` AND (a.nome ILIKE $${p.length} OR o.descricao ILIKE $${p.length} OR o.tipo ILIKE $${p.length})`;
        }
        sql += ' ORDER BY o.data_ocorrencia DESC, o.id DESC LIMIT ' + Number(limit);
        const result = await query(sql, p);
        res.json(result.rows);
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await query(`
            SELECT o.*, a.nome AS aluno_nome, t.nome AS turma_nome, u.nome AS registrado_por_nome
            FROM ocorrencias o
            INNER JOIN alunos a ON a.id = o.aluno_id
            INNER JOIN turmas t ON t.id = a.turma_id
            LEFT JOIN  usuarios u ON u.id = o.registrado_por_id
            WHERE o.id = $1
        `, [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Ocorrência não encontrada' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
    try {
        const d = ocorrenciaSchema.parse(req.body);
        const result = await query(`
            INSERT INTO ocorrencias (aluno_id, data_ocorrencia, hora_ocorrencia, tipo, gravidade,
                descricao, medida_aplicada, local_ocorrencia, registrado_por_id,
                responsavel_notificado, status)
            VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [d.aluno_id, d.data_ocorrencia || null, d.hora_ocorrencia || null, d.tipo, d.gravidade,
            d.descricao, d.medida_aplicada || null, d.local_ocorrencia || null,
            req.usuario.id, d.responsavel_notificado, d.status]);
        res.status(201).json(result.rows[0]);
    } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
    try {
        const data = ocorrenciaSchema.partial().parse(req.body);
        const fields = Object.keys(data);
        if (!fields.length) return res.status(400).json({ error: 'Nada para atualizar' });
        const setClauses = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
        const values = fields.map((f) => data[f]);
        values.push(req.params.id);
        const result = await query(
            `UPDATE ocorrencias SET ${setClauses} WHERE id = $${values.length} RETURNING *`, values);
        if (!result.rowCount) return res.status(404).json({ error: 'Ocorrência não encontrada' });
        res.json(result.rows[0]);
    } catch (err) { next(err); }
});

router.delete('/:id', autorizar('ADMIN'), async (req, res, next) => {
    try {
        // Arquivar em vez de deletar
        const result = await query(
            `UPDATE ocorrencias SET status = 'ARQUIVADO' WHERE id = $1 RETURNING id`,
            [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ error: 'Ocorrência não encontrada' });
        res.json({ ok: true });
    } catch (err) { next(err); }
});

export default router;
