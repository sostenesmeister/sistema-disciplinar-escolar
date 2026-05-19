import express from 'express';
import { query } from '../db.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.use(autenticar);

// Relatório por aluno: ficha completa
router.get('/aluno/:id', async (req, res, next) => {
  try {
    const aluno = await query(`
      SELECT a.*, t.nome AS turma_nome, t.serie, t.turno
      FROM alunos a INNER JOIN turmas t ON t.id = a.turma_id
      WHERE a.id = $1
    `, [req.params.id]);
    if (!aluno.rowCount) return res.status(404).json({ error: 'Aluno não encontrado' });

    const ocorrencias = await query(`
      SELECT o.*, u.nome AS registrado_por_nome
      FROM ocorrencias o LEFT JOIN usuarios u ON u.id = o.registrado_por_id
      WHERE o.aluno_id = $1
      ORDER BY o.data_ocorrencia DESC, o.id DESC
    `, [req.params.id]);

    const resumo = await query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE gravidade='LEVE')::int AS leves,
        COUNT(*) FILTER (WHERE gravidade='MEDIA')::int AS medias,
        COUNT(*) FILTER (WHERE gravidade='GRAVE')::int AS graves,
        COUNT(*) FILTER (WHERE gravidade='GRAVISSIMA')::int AS gravissimas,
        COUNT(*) FILTER (WHERE status='ABERTO')::int AS em_aberto
      FROM ocorrencias WHERE aluno_id = $1
    `, [req.params.id]);

    res.json({
      aluno: aluno.rows[0],
      ocorrencias: ocorrencias.rows,
      resumo: resumo.rows[0],
    });
  } catch (err) { next(err); }
});

router.get('/turma/:id', async (req, res, next) => {
  try {
    const { data_inicio, data_fim } = req.query;
    const turma = await query('SELECT * FROM turmas WHERE id = $1', [req.params.id]);
    if (!turma.rowCount) return res.status(404).json({ error: 'Turma não encontrada' });

    const params = [req.params.id];
    let filtroData = '';
    if (data_inicio) { params.push(data_inicio); filtroData += ` AND o.data_ocorrencia >= $${params.length}`; }
    if (data_fim) { params.push(data_fim); filtroData += ` AND o.data_ocorrencia <= $${params.length}`; }

    const alunos = await query(`
      SELECT a.id, a.nome, a.matricula,
        COUNT(o.id)::int AS total_ocorrencias,
        COUNT(o.id) FILTER (WHERE o.gravidade IN ('GRAVE','GRAVISSIMA'))::int AS graves
      FROM alunos a
      LEFT JOIN ocorrencias o ON o.aluno_id = a.id${filtroData}
      WHERE a.turma_id = $1 AND a.status = 'ATIVO'
      GROUP BY a.id, a.nome, a.matricula
      ORDER BY total_ocorrencias DESC, a.nome
    `, params);

    const totais = await query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE o.gravidade='LEVE')::int AS leves,
        COUNT(*) FILTER (WHERE o.gravidade='MEDIA')::int AS medias,
        COUNT(*) FILTER (WHERE o.gravidade='GRAVE')::int AS graves,
        COUNT(*) FILTER (WHERE o.gravidade='GRAVISSIMA')::int AS gravissimas
      FROM ocorrencias o
      INNER JOIN alunos a ON a.id = o.aluno_id
      WHERE a.turma_id = $1${filtroData}
    `, params);

    res.json({ turma: turma.rows[0], alunos: alunos.rows, totais: totais.rows[0] });
  } catch (err) { next(err); }
});

router.get('/periodo', async (req, res, next) => {
  try {
    const { data_inicio, data_fim, gravidade, turma_id } = req.query;
    const p = [];
    let sql = `
      SELECT o.*, a.nome AS aluno_nome, a.matricula, t.nome AS turma_nome
      FROM ocorrencias o
      INNER JOIN alunos a ON a.id = o.aluno_id
      INNER JOIN turmas t ON t.id = a.turma_id
      WHERE 1=1
    `;
    if (data_inicio) { p.push(data_inicio); sql += ` AND o.data_ocorrencia >= $${p.length}`; }
    if (data_fim) { p.push(data_fim); sql += ` AND o.data_ocorrencia <= $${p.length}`; }
    if (gravidade) { p.push(gravidade); sql += ` AND o.gravidade = $${p.length}`; }
    if (turma_id) { p.push(turma_id); sql += ` AND a.turma_id = $${p.length}`; }
    sql += ' ORDER BY o.data_ocorrencia DESC, o.id DESC';

    const ocorrencias = await query(sql, p);

    const porTipo = await query(`
      SELECT tipo, COUNT(*)::int AS total
      FROM ocorrencias o
      INNER JOIN alunos a ON a.id = o.aluno_id
      WHERE ($1::date IS NULL OR o.data_ocorrencia >= $1::date)
        AND ($2::date IS NULL OR o.data_ocorrencia <= $2::date)
        AND ($3::text IS NULL OR o.gravidade = $3)
        AND ($4::int IS NULL OR a.turma_id = $4)
      GROUP BY tipo ORDER BY total DESC
    `, [data_inicio || null, data_fim || null, gravidade || null, turma_id || null]);

    const porGravidade = await query(`
      SELECT gravidade, COUNT(*)::int AS total
      FROM ocorrencias o
      INNER JOIN alunos a ON a.id = o.aluno_id
      WHERE ($1::date IS NULL OR o.data_ocorrencia >= $1::date)
        AND ($2::date IS NULL OR o.data_ocorrencia <= $2::date)
        AND ($3::int IS NULL OR a.turma_id = $3)
      GROUP BY gravidade
    `, [data_inicio || null, data_fim || null, turma_id || null]);

    res.json({
      ocorrencias: ocorrencias.rows,
      total: ocorrencias.rowCount,
      por_tipo: porTipo.rows,
      por_gravidade: porGravidade.rows,
    });
  } catch (err) { next(err); }
});

router.get('/ranking-alunos', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const result = await query(`
      SELECT a.id, a.nome, a.matricula, t.nome AS turma_nome,
        COUNT(o.id)::int AS total,
        COUNT(o.id) FILTER (WHERE o.gravidade IN ('GRAVE','GRAVISSIMA'))::int AS graves
      FROM alunos a
      INNER JOIN turmas t ON t.id = a.turma_id
      LEFT JOIN ocorrencias o ON o.aluno_id = a.id
      WHERE a.status = 'ATIVO'
      GROUP BY a.id, a.nome, a.matricula, t.nome
      HAVING COUNT(o.id) > 0
      ORDER BY total DESC, graves DESC
      LIMIT $1
    `, [limit]);
    res.json(result.rows);
  } catch (err) { next(err); }
});

export default router;
