-- ============================================================
-- Schema consolidado — Sistema Disciplinar Escolar
-- PostgreSQL 14+
-- Apenas para REFERÊNCIA. Use as migrations 001/002/003 para criar.
-- ============================================================

-- Usuários do sistema
CREATE TABLE usuarios (
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

-- Turmas
CREATE TABLE turmas (
    id                    SERIAL PRIMARY KEY,
    nome                  VARCHAR(50) NOT NULL,
    serie                 VARCHAR(50) NOT NULL,
    turno                 VARCHAR(20) NOT NULL CHECK (turno IN ('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')),
    ano_letivo            INTEGER NOT NULL,
    professor_responsavel VARCHAR(150),
    status                VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
    criado_em             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nome, ano_letivo)
);

-- Alunos
CREATE TABLE alunos (
    id                   SERIAL PRIMARY KEY,
    matricula            VARCHAR(30) UNIQUE NOT NULL,
    nome                 VARCHAR(150) NOT NULL,
    turma_id             INTEGER NOT NULL REFERENCES turmas(id),
    data_nascimento      DATE,
    responsavel          VARCHAR(150),
    telefone_responsavel VARCHAR(30),
    email_responsavel    VARCHAR(150),
    status               VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    observacoes          TEXT,
    criado_em            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ocorrências
CREATE TABLE ocorrencias (
    id                     SERIAL PRIMARY KEY,
    aluno_id               INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    data_ocorrencia        DATE NOT NULL DEFAULT CURRENT_DATE,
    hora_ocorrencia        TIME,
    tipo                   VARCHAR(50) NOT NULL,
    gravidade              VARCHAR(20) NOT NULL DEFAULT 'LEVE',
    descricao              TEXT NOT NULL,
    medida_aplicada        VARCHAR(100),
    local_ocorrencia       VARCHAR(100),
    registrado_por_id      INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    responsavel_notificado BOOLEAN NOT NULL DEFAULT FALSE,
    data_notificacao       TIMESTAMP,
    status                 VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    criado_em              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
