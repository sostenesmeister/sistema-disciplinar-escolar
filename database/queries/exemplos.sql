-- ============================================================
-- Queries de exemplo úteis
-- ============================================================

-- 1) Histórico completo de um aluno (com nome do registrante e turma)
SELECT
    o.data_ocorrencia,
    o.tipo,
    o.gravidade,
    o.descricao,
    o.medida_aplicada,
    o.status,
    u.nome AS registrado_por,
    t.nome AS turma
FROM ocorrencias o
INNER JOIN alunos a  ON a.id = o.aluno_id
INNER JOIN turmas t  ON t.id = a.turma_id
LEFT JOIN  usuarios u ON u.id = o.registrado_por_id
WHERE a.nome ILIKE '%noel ferreira%'
ORDER BY o.data_ocorrencia DESC;

-- 2) Top 10 alunos com mais ocorrências no ano
SELECT a.nome, t.nome AS turma, COUNT(o.id) AS total_ocorrencias
FROM alunos a
INNER JOIN turmas t ON t.id = a.turma_id
LEFT JOIN  ocorrencias o ON o.aluno_id = a.id
    AND EXTRACT(YEAR FROM o.data_ocorrencia) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY a.id, a.nome, t.nome
HAVING COUNT(o.id) > 0
ORDER BY total_ocorrencias DESC
LIMIT 10;

-- 3) Ocorrências em aberto (precisam de atenção)
SELECT
    o.id,
    o.data_ocorrencia,
    a.nome AS aluno,
    t.nome AS turma,
    o.tipo,
    o.gravidade,
    o.descricao
FROM ocorrencias o
INNER JOIN alunos a ON a.id = o.aluno_id
INNER JOIN turmas t ON t.id = a.turma_id
WHERE o.status IN ('ABERTO', 'EM_ANALISE')
ORDER BY
    CASE o.gravidade
        WHEN 'GRAVISSIMA' THEN 1
        WHEN 'GRAVE'      THEN 2
        WHEN 'MEDIA'      THEN 3
        WHEN 'LEVE'       THEN 4
    END,
    o.data_ocorrencia DESC;

-- 4) Busca por nome (substring, tolerante a typos via pg_trgm)
SELECT id, matricula, nome, similarity(nome, 'Noel Ferreira') AS score
FROM alunos
WHERE nome % 'Noel Ferreira'
ORDER BY score DESC
LIMIT 5;

-- 5) Resumo do dashboard
SELECT
    (SELECT COUNT(*) FROM turmas      WHERE status = 'ATIVA')              AS turmas_ativas,
    (SELECT COUNT(*) FROM alunos      WHERE status = 'ATIVO')              AS alunos_ativos,
    (SELECT COUNT(*) FROM ocorrencias WHERE EXTRACT(YEAR FROM data_ocorrencia) = EXTRACT(YEAR FROM CURRENT_DATE)) AS ocorrencias_ano,
    (SELECT COUNT(*) FROM ocorrencias WHERE status IN ('ABERTO', 'EM_ANALISE')) AS em_aberto;

-- 6) Reincidentes — alunos com 3+ ocorrências em 30 dias
SELECT a.nome, COUNT(o.id) AS qtd_ultimos_30_dias
FROM alunos a
INNER JOIN ocorrencias o ON o.aluno_id = a.id
WHERE o.data_ocorrencia >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY a.id, a.nome
HAVING COUNT(o.id) >= 3
ORDER BY qtd_ultimos_30_dias DESC;
