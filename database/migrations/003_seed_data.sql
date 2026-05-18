-- ============================================================
-- Migration 003 — Seed de dados iniciais
-- (mesmos dados de exemplo da versão Apps Script)
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Usuários
-- Senhas em bcrypt (cost 10). Senhas em claro:
--   admin / escola123
--   maria / prof123
--   joao  / coord123
-- ------------------------------------------------------------
INSERT INTO usuarios (login, senha_hash, nome, email, perfil) VALUES
    ('admin', '$2b$10$rR0sLhMxQz1bO3yE6Q2KhuVx8.J0kPYx4XQK1JhqAaB.kZBQR1HJK', 'Administrador do Sistema', 'admin@escola.com.br',     'ADMIN'),
    ('maria', '$2b$10$F3sH5KqxNbX3wYwO6vGqYemY.5tXJ7CqVqZ4LwJg6yK0YHzKqWQXK', 'Maria Silva',              'maria@escola.com.br',     'PROFESSOR'),
    ('joao',  '$2b$10$L9pK2HsLnZ5rT3wPb1QyKuW.2vGqJ8YeNbX3lR9hT0vJqAaB1KqXC', 'João Souza',               'joao.coord@escola.com.br','COORDENADOR')
ON CONFLICT (login) DO NOTHING;

-- ------------------------------------------------------------
-- Turmas
-- ------------------------------------------------------------
INSERT INTO turmas (nome, serie, turno, ano_letivo, professor_responsavel, status) VALUES
    ('6A', '6º Ano',  'MANHA', 2026, 'Maria Silva',     'ATIVA'),
    ('6B', '6º Ano',  'TARDE', 2026, 'Carlos Oliveira', 'ATIVA'),
    ('7A', '7º Ano',  'MANHA', 2026, 'Ana Pereira',     'ATIVA'),
    ('8A', '8º Ano',  'MANHA', 2026, 'Roberto Costa',   'ATIVA'),
    ('9A', '9º Ano',  'TARDE', 2026, 'Juliana Rocha',   'ATIVA'),
    ('1EM','1º E.M.', 'MANHA', 2026, 'Pedro Mendes',    'ATIVA')
ON CONFLICT (nome, ano_letivo) DO NOTHING;

-- ------------------------------------------------------------
-- Alunos
-- ------------------------------------------------------------
INSERT INTO alunos (matricula, nome, turma_id, data_nascimento, responsavel, telefone_responsavel, status) VALUES
    ('2026001', 'Noel Ferreira Santos',     (SELECT id FROM turmas WHERE nome='7A' AND ano_letivo=2026), '2013-04-15', 'Carlos Ferreira',  '(11) 98765-4321', 'ATIVO'),
    ('2026002', 'Gabriel Rocha Lima',       (SELECT id FROM turmas WHERE nome='7A' AND ano_letivo=2026), '2013-07-22', 'Sandra Rocha',     '(11) 98765-1111', 'ATIVO'),
    ('2026003', 'Mariana Costa Almeida',    (SELECT id FROM turmas WHERE nome='8A' AND ano_letivo=2026), '2012-09-10', 'José Costa',       '(11) 98765-2222', 'ATIVO'),
    ('2026004', 'Lucas Pereira Souza',      (SELECT id FROM turmas WHERE nome='6A' AND ano_letivo=2026), '2014-02-28', 'Patricia Pereira', '(11) 98765-3333', 'ATIVO'),
    ('2026005', 'Beatriz Oliveira Dias',    (SELECT id FROM turmas WHERE nome='9A' AND ano_letivo=2026), '2011-11-05', 'Roberto Oliveira', '(11) 98765-4444', 'ATIVO'),
    ('2026006', 'Rafael Mendes Cardoso',    (SELECT id FROM turmas WHERE nome='1EM' AND ano_letivo=2026), '2010-06-18', 'Fernanda Mendes',  '(11) 98765-5555', 'ATIVO')
ON CONFLICT (matricula) DO NOTHING;

-- ------------------------------------------------------------
-- Ocorrências (com histórico do Noel — exemplo do enunciado)
-- ------------------------------------------------------------
INSERT INTO ocorrencias (aluno_id, data_ocorrencia, tipo, gravidade, descricao, medida_aplicada, registrado_por_id, responsavel_notificado, status) VALUES
    ((SELECT id FROM alunos WHERE matricula='2026001'), '2026-03-10', 'INDISCIPLINA',     'LEVE',  'Conversas excessivas durante a aula de Matemática',                              'ADVERTENCIA_VERBAL',    (SELECT id FROM usuarios WHERE login='maria'), TRUE,  'CONCLUIDO'),
    ((SELECT id FROM alunos WHERE matricula='2026001'), '2026-04-02', 'ATRASO',           'LEVE',  'Chegou 30 minutos atrasado pela terceira vez no mês',                            'ADVERTENCIA_ESCRITA',   (SELECT id FROM usuarios WHERE login='joao'),  TRUE,  'CONCLUIDO'),
    ((SELECT id FROM alunos WHERE matricula='2026001'), '2026-05-08', 'BRIGA',            'GRAVE', 'Briga corporal com colega Gabriel Rocha Lima no intervalo. Ambos foram separados pelos inspetores.', 'SUSPENSAO_2_DIAS',     (SELECT id FROM usuarios WHERE login='joao'),  TRUE,  'ABERTO'),
    ((SELECT id FROM alunos WHERE matricula='2026002'), '2026-05-08', 'BRIGA',            'GRAVE', 'Briga corporal com colega Noel Ferreira Santos no intervalo.',                   'SUSPENSAO_2_DIAS',      (SELECT id FROM usuarios WHERE login='joao'),  TRUE,  'CONCLUIDO'),
    ((SELECT id FROM alunos WHERE matricula='2026003'), '2026-04-20', 'DESRESPEITO',      'MEDIA', 'Falou palavrões com a professora durante a aula',                                'ADVERTENCIA_ESCRITA',   (SELECT id FROM usuarios WHERE login='maria'), TRUE,  'CONCLUIDO'),
    ((SELECT id FROM alunos WHERE matricula='2026004'), '2026-04-15', 'CELULAR_AULA',     'LEVE',  'Uso de celular durante a prova',                                                 'CONFISCO_RETORNO_RESP', (SELECT id FROM usuarios WHERE login='maria'), TRUE,  'CONCLUIDO'),
    ((SELECT id FROM alunos WHERE matricula='2026005'), '2026-05-12', 'AGRESSAO_VERBAL',  'GRAVE', 'Ofendeu colega com palavras de baixo calão',                                     'SUSPENSAO_1_DIA',       (SELECT id FROM usuarios WHERE login='joao'),  FALSE, 'EM_ANALISE')
;

COMMIT;
