# 🗄️ Banco de Dados — PostgreSQL

Migrations e seeds para o Sistema Disciplinar Escolar.

## 📦 Ordem das migrations

Execute na ordem numérica:

```bash
psql escola_disciplinar -f database/migrations/001_create_tables.sql
psql escola_disciplinar -f database/migrations/002_create_indexes.sql
psql escola_disciplinar -f database/migrations/003_seed_data.sql
```

## 🐘 Subindo com Docker

```bash
docker run --name escola-pg \
  -e POSTGRES_DB=escola_disciplinar \
  -e POSTGRES_USER=escola \
  -e POSTGRES_PASSWORD=escola123 \
  -p 5432:5432 \
  -v escola_pgdata:/var/lib/postgresql/data \
  -d postgres:16-alpine

# Rodar as migrations
docker cp database/migrations escola-pg:/migrations
docker exec -it escola-pg psql -U escola -d escola_disciplinar -f /migrations/001_create_tables.sql
docker exec -it escola-pg psql -U escola -d escola_disciplinar -f /migrations/002_create_indexes.sql
docker exec -it escola-pg psql -U escola -d escola_disciplinar -f /migrations/003_seed_data.sql
```

## 📋 Arquivos

| Arquivo                              | Descrição                                   |
|--------------------------------------|---------------------------------------------|
| `migrations/001_create_tables.sql` | Cria tabelas e trigger de `atualizado_em` |
| `migrations/002_create_indexes.sql`| Índices para performance + extensão pg_trgm |
| `migrations/003_seed_data.sql`     | Dados iniciais (3 usuários, 6 turmas, 6 alunos, 7 ocorrências) |
| `schema.sql`                        | Schema consolidado para consulta rápida    |
| `queries/`                          | Queries de exemplo úteis                   |

## 🧱 Modelo ER

```
┌──────────────┐        ┌──────────────┐
│   usuarios   │        │    turmas    │
├──────────────┤        ├──────────────┤
│ id (PK)      │        │ id (PK)      │
│ login        │        │ nome         │
│ senha_hash   │        │ serie        │
│ perfil       │        │ ano_letivo   │
└──────┬───────┘        └──────┬───────┘
       │                       │
       │ registrado_por_id     │ turma_id
       │                       │
       │                ┌──────▼───────┐
       │                │    alunos    │
       │                ├──────────────┤
       │                │ id (PK)      │
       │                │ matricula    │
       │                │ nome         │
       │                │ turma_id (FK)│
       │                └──────┬───────┘
       │                       │
       │                       │ aluno_id
       │                       │
       │                ┌──────▼────────┐
       └───────────────►│  ocorrencias  │
                        ├───────────────┤
                        │ id (PK)       │
                        │ aluno_id (FK) │
                        │ data          │
                        │ tipo          │
                        │ gravidade     │
                        │ descricao     │
                        │ medida        │
                        │ status        │
                        └───────────────┘
```

## 🔍 Queries úteis

Ver `queries/exemplos.sql` para queries prontas (top alunos com mais ocorrências, histórico individual, etc).
