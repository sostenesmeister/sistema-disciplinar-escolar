# 🏫 Sistema Disciplinar Escolar

Sistema de gestão disciplinar escolar para controle de ocorrências, advertências e histórico de alunos. Permite que professores, coordenadores e diretores registrem fatos disciplinares (brigas, indisciplina, atraso, etc.), consultem o histórico de cada aluno e gerenciem turmas.

## ✨ Funcionalidades

- 🔐 **Login com perfis** (ADMIN, COORDENADOR, PROFESSOR)
- 📊 **Dashboard** com estatísticas (turmas, alunos, ocorrências, casos em aberto)
- 👨‍🎓 **Cadastro de alunos** organizados por turma
- 🏫 **Gestão de turmas** (controlada pelo administrador)
- ⚠️ **Registro de ocorrências** disciplinares com tipo, descrição, medida aplicada
- 🔍 **Busca rápida** por aluno com histórico completo
- 👥 **Gestão de usuários** do sistema (ADMIN only)
- 📜 **Histórico individual** de cada aluno: advertências, suspensões, etc.

## 📁 Estrutura do projeto

```
sistema-disciplinar-escolar/
├── apps-script/              # Versão atual rodando em Google Apps Script
│   ├── Codigo.gs             # Backend (Apps Script + Sheets como banco)
│   └── Index.html            # Frontend SPA (HTML+CSS+JS vanilla)
│
├── database/                 # Migrations e seeds para PostgreSQL
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_create_indexes.sql
│   │   └── 003_seed_data.sql
│   └── schema.sql            # Schema completo (referência)
│
├── backend/                  # API Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── server.js
│   │   ├── db.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── alunos.js
│   │   │   ├── turmas.js
│   │   │   ├── ocorrencias.js
│   │   │   ├── usuarios.js
│   │   │   └── dashboard.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # Frontend HTML standalone (consome a API)
│   └── index.html
│
├── docker-compose.yml        # Sobe PostgreSQL + backend em containers
└── README.md
```

## 🚀 Como rodar — Versão PostgreSQL/Node.js

### Pré-requisitos
- Docker e Docker Compose **ou** Node.js 18+ e PostgreSQL 14+

### Opção 1: Docker (recomendado)
```bash
git clone https://github.com/sostenesmeister/sistema-disciplinar-escolar.git
cd sistema-disciplinar-escolar
cp backend/.env.example backend/.env
docker-compose up -d
```

Acesse:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:3000

### Opção 2: Manual
```bash
# 1. Criar banco de dados PostgreSQL
createdb escola_disciplinar

# 2. Rodar migrations
psql escola_disciplinar < database/migrations/001_create_tables.sql
psql escola_disciplinar < database/migrations/002_create_indexes.sql
psql escola_disciplinar < database/migrations/003_seed_data.sql

# 3. Subir backend
cd backend
cp .env.example .env
# Edite .env com suas credenciais do PostgreSQL
npm install
npm run dev

# 4. Servir frontend
cd ../frontend
python3 -m http.server 8080
```

## 🔑 Credenciais padrão (após seed)

| Usuário | Senha       | Perfil       |
|---------|-------------|--------------|
| admin   | escola123   | ADMIN        |
| maria   | prof123     | PROFESSOR    |
| joao    | coord123    | COORDENADOR  |

⚠️ **Mude as senhas em produção!** Os hashes no seed são apenas para desenvolvimento.

## 🗄️ Modelo de dados (PostgreSQL)

```
turmas (id, nome, serie, turno, ano_letivo, professor_responsavel, status)
   │
   └── alunos (id, matricula, nome, turma_id, data_nascimento, responsavel, telefone, status)
            │
            └── ocorrencias (id, aluno_id, data, tipo, descricao, medida,
                             responsavel_registro, responsavel_notificado, status)

usuarios (id, login, senha_hash, nome, email, perfil, ativo)
```

## 🎯 Versão Google Apps Script

A primeira versão do sistema usa **Google Sheets como banco de dados** e roda como Web App via Google Apps Script. Está em `apps-script/` e tem uma URL pública que pode ser testada sem instalação.

Veja [`apps-script/README.md`](./apps-script/README.md) para detalhes.

## 📝 Licença

MIT — use, modifique e distribua livremente.

## 👤 Autor

Desenvolvido por [@sostenesmeister](https://github.com/sostenesmeister)
