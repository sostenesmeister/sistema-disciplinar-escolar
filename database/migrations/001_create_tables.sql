-- ============================================================
-- Migration 001 — Criação das tabelas principais
-- Sistema Disciplinar Escolar — PostgreSQL 14+
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Tabela: usuarios
-- Usuários do sistema (admin, coordenadores, professores)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id              SERIAL PRIMARY KEY,
    login           VARCHAR(50) UNIQUE NOT NULL,
    senha_hash      VARCHAR(255) NOT NULL,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(150),
    perfil          VARCHAR(20) NOT NULL CHECK (perfil IN ('ADMIN', 'COORDENADOR', 'PROFESSOR')),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acesso   TIMESTAMP,
    criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE  usuarios IS 'Usuários do sistema disciplinar';
COMMENT ON COLUMN usuarios.senha_hash IS 'Senha criptografada com bcrypt (cost 10+)';
COMMENT ON COLUMN usuarios.perfil IS 'ADMIN, COORDENADOR ou PROFESSOR';

-- ------------------------------------------------------------
-- Tabela: turmas
-- Turmas (classes) da escola
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS turmas (
    id                       SERIAL PRIMARY KEY,
    nome                     VARCHAR(50) NOT NULL,
    serie                    VARCHAR(50) NOT NULL,
    turno                    VARCHAR(20) NOT NULL CHECK (turno IN ('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')),
    ano_letivo               INTEGER NOT NULL,
    professor_responsavel    VARCHAR(150),
    status                   VARCHAR(20) NOT NULL DEFAULT 'ATIVA' CHECK (status IN ('ATIVA', 'INATIVA', 'ENCERRADA')),
    criado_em                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nome, ano_letivo)
);

COMMENT ON TABLE turmas IS 'Turmas/classes da escola por ano letivo';

-- ------------------------------------------------------------
-- Tabela: alunos
-- Alunos vinculados a turmas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alunos (
    id                  SERIAL PRIMARY KEY,
    matricula           VARCHAR(30) UNIQUE NOT NULL,
    nome                VARCHAR(150) NOT NULL,
    turma_id            INTEGER NOT NULL REFERENCES turmas(id) ON DELETE RESTRICT,
    data_nascimento     DATE,
    responsavel         VARCHAR(150),
    telefone_responsavel VARCHAR(30),
    email_responsavel   VARCHAR(150),
    status              VARCHAR(20) NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'TRANSFERIDO', 'EVADIDO', 'CONCLUIDO')),
    observacoes         TEXT,
    criado_em           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE alunos IS 'Alunos matriculados na escola';

-- ------------------------------------------------------------
-- Tabela: ocorrencias
-- Registros disciplinares de cada aluno
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ocorrencias (
    id                       SERIAL PRIMARY KEY,
    aluno_id                 INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    data_ocorrencia          DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_ocorrencia          TIME,
    tipo                     VARCHAR(50) NOT NULL,
    gravidade                VARCHAR(20) NOT NULL DEFAULT 'LEVE' CHECK (gravidade IN ('LEVE', 'MEDIA', 'GRAVE', 'GRAVISSIMA')),
    descricao                TEXT NOT NULL,
    medida_aplicada          VARCHAR(100),
    local_ocorrencia         VARCHAR(100),
    registrado_por_id        INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    responsavel_notificado   BOOLEAN NOT NULL DEFAULT FALSE,
    data_notificacao         TIMESTAMP,
    status                   VARCHAR(20) NOT NULL DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'EM_ANALISE', 'CONCLUIDO', 'ARQUIVADO')),
    criado_em                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE ocorrencias IS 'Ocorrências disciplinares dos alunos';
COMMENT ON COLUMN ocorrencias.tipo IS 'Ex: BRIGA, INDISCIPLINA, ATRASO, DESRESPEITO, AGRESSAO_VERBAL, etc';
COMMENT ON COLUMN ocorrencias.medida_aplicada IS 'Ex: ADVERTENCIA_VERBAL, ADVERTENCIA_ESCRITA, SUSPENSAO, NOTIFICACAO_RESPONSAVEL';

-- ------------------------------------------------------------
-- Trigger para atualizar atualizado_em automaticamente
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_atualizar      BEFORE UPDATE ON usuarios     FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER trg_turmas_atualizar        BEFORE UPDATE ON turmas       FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER trg_alunos_atualizar        BEFORE UPDATE ON alunos       FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
CREATE TRIGGER trg_ocorrencias_atualizar   BEFORE UPDATE ON ocorrencias  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

COMMIT;
