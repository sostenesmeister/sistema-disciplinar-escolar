# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

## [1.0.0] — 2026-05-18

### Adicionado
- Versão inicial com Google Apps Script + Google Sheets
- Migrations PostgreSQL (`001_create_tables.sql`, `002_create_indexes.sql`, `003_seed_data.sql`)
- Backend Node.js + Express + PostgreSQL com autenticação JWT
- Endpoints CRUD para alunos, turmas, ocorrências e usuários
- Dashboard com estatísticas e busca rápida
- Frontend SPA standalone
- Docker Compose para subir tudo (Postgres + backend + frontend)
- Documentação completa
