import express from 'express';
import { query } from '../db.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);

router.get('/', async (_req, res, next) => {
    try {
        const stats = await query(`
            SELECT
                (SELECT COUNT(*)::int FROM turmas      WHERE status = 'ATIVA')                                   AS turmas,
                (SELECT COUNT(*)::int FROM alunos      WHERE status = 'ATIVO')                                   AS alunos,
                (SELECT COUNT(*)::int FROM ocorrencias
                    WHERE EXTRACT(YEAR FROM data_ocorrencia) = EXTRACT(YEAR FROM CURRENT_DATE))                   AS ocorrencias_ano,
                (SELECT COUNT(*)::int FROM ocorrencias WHERE status IN ('ABERTO','EM_ANALISE'))                    AS em_aberto
        `);

        const recentes = await query(`
            SELECT o.id, o.data_ocorrencia, o.tipo, o.gravidade, o.descricao, o.status,
                   a.nome AS aluno_nome, t.nome AS turma_nome
            FROM ocorrencias o
            INNER JOIN alunos a ON a.id = o.aluno_id
            INNER JOIN turmas t ON t.id = a.turma_id
            ORDER BY o.data_ocorrencia DESC, o.id DESC
            LIMIT 10
        `);

        const porGravidade = await query(`
            SELECT gravidade, COUNT(*)::int AS total
            FROM ocorrencias
            WHERE EXTRACT(YEAR FROM data_ocorrencia) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY gravidade
        `);

        res.json({
            stats: stats.rows[0],
            recentes: recentes.rows,
            por_gravidade: porGravidade.rows,
        });
    } catch (err) { next(err); }
});

// Busca rápida — usada na home
router.get('/busca', async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json([]);
        const result = await query(`
            SELECT a.id, a.nome, a.matricula, t.nome AS turma_nome,
                   COUNT(o.id)::int AS total_ocorrencias
            FROM alunos a
            INNER JOIN turmas t ON t.id = a.turma_id
            LEFT JOIN  ocorrencias o ON o.aluno_id = a.id
            WHERE a.nome ILIKE $1 OR a.matricula ILIKE $1
            GROUP BY a.id, a.nome, a.matricula, t.nome
            ORDER BY a.nome
            LIMIT 20
        `, [`%${q}%`]);
        res.json(result.rows);
    } catch (err) { next(err); }
});

export default router;
