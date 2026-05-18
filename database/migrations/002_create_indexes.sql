-- ============================================================
-- Migration 002 — Índices para performance
-- ============================================================

BEGIN;

-- Usuários
CREATE INDEX IF NOT EXISTS idx_usuarios_login   ON usuarios(login);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil  ON usuarios(perfil) WHERE ativo = TRUE;

-- Turmas
CREATE INDEX IF NOT EXISTS idx_turmas_ano_letivo ON turmas(ano_letivo);
CREATE INDEX IF NOT EXISTS idx_turmas_status     ON turmas(status);

-- Alunos
CREATE INDEX IF NOT EXISTS idx_alunos_turma     ON alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_alunos_nome      ON alunos(nome);
CREATE INDEX IF NOT EXISTS idx_alunos_matricula ON alunos(matricula);
CREATE INDEX IF NOT EXISTS idx_alunos_status    ON alunos(status);
-- Trigram para busca por nome (substring/typo-tolerant)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_alunos_nome_trgm ON alunos USING gin (nome gin_trgm_ops);

-- Ocorrências
CREATE INDEX IF NOT EXISTS idx_ocorrencias_aluno          ON ocorrencias(aluno_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_data           ON ocorrencias(data_ocorrencia DESC);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_status         ON ocorrencias(status);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_gravidade      ON ocorrencias(gravidade);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_registrado_por ON ocorrencias(registrado_por_id);
-- Índice composto para o filtro mais comum: aluno + período
CREATE INDEX IF NOT EXISTS idx_ocorrencias_aluno_data     ON ocorrencias(aluno_id, data_ocorrencia DESC);

COMMIT;
