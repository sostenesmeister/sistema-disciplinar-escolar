# 🔧 Backend — Sistema Disciplinar Escolar

API REST em **Node.js + Express + PostgreSQL** com autenticação JWT.

## 🚀 Stack

- **Node.js** 18+ (ES Modules)
- **Express** 4 — framework HTTP
- **pg** — cliente PostgreSQL
- **bcryptjs** — hash de senhas
- **jsonwebtoken** — tokens JWT
- **zod** — validação de payloads
- **helmet**, **cors**, **morgan**, **express-rate-limit** — segurança e logs

## 📦 Instalação

```bash
cd backend
cp .env.example .env
# edite .env com suas credenciais PostgreSQL
npm install
```

## 🗄️ Rodar migrations (cria tabelas e dados iniciais)

```bash
npm run migrate
npm run seed
```

> O seed substitui os hashes do migration 003 por hashes válidos gerados no momento, garantindo que o login funcione.

## ▶️ Rodar em desenvolvimento

```bash
npm run dev
```

API em http://localhost:3000

## 📡 Endpoints

### Autenticação

| Método | Rota              | Descrição                          |
|--------|-------------------|-------------------------------------|
| POST   | /api/auth/login   | Loga e retorna JWT                  |
| GET    | /api/auth/me      | Retorna dados do usuário logado     |

### Alunos

| Método | Rota                       | Perfis             |
|--------|----------------------------|--------------------|
| GET    | /api/alunos                | Todos              |
| GET    | /api/alunos/:id            | Todos              |
| GET    | /api/alunos/:id/historico  | Todos              |
| POST   | /api/alunos                | ADMIN, COORDENADOR |
| PUT    | /api/alunos/:id            | ADMIN, COORDENADOR |
| DELETE | /api/alunos/:id            | ADMIN              |

### Turmas

| Método | Rota             | Perfis    |
|--------|------------------|-----------|
| GET    | /api/turmas      | Todos     |
| GET    | /api/turmas/:id  | Todos     |
| POST   | /api/turmas      | ADMIN     |
| PUT    | /api/turmas/:id  | ADMIN     |
| DELETE | /api/turmas/:id  | ADMIN     |

### Ocorrências

| Método | Rota                   | Perfis        |
|--------|------------------------|---------------|
| GET    | /api/ocorrencias       | Todos         |
| GET    | /api/ocorrencias/:id   | Todos         |
| POST   | /api/ocorrencias       | Todos         |
| PUT    | /api/ocorrencias/:id   | Todos         |
| DELETE | /api/ocorrencias/:id   | ADMIN         |

### Usuários

| Método | Rota              | Perfis    |
|--------|-------------------|-----------|
| GET    | /api/usuarios     | ADMIN     |
| POST   | /api/usuarios     | ADMIN     |
| PUT    | /api/usuarios/:id | ADMIN     |
| DELETE | /api/usuarios/:id | ADMIN     |

### Dashboard

| Método | Rota                          | Descrição                          |
|--------|-------------------------------|-------------------------------------|
| GET    | /api/dashboard                | Estatísticas + ocorrências recentes |
| GET    | /api/dashboard/busca?q=noel   | Busca rápida de aluno por nome      |

## 🧪 Exemplo de uso (curl)

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"login":"admin","senha":"escola123"}' | jq -r .token)

# 2. Listar alunos
curl http://localhost:3000/api/alunos \
  -H "Authorization: Bearer $TOKEN"

# 3. Buscar histórico do Noel
curl 'http://localhost:3000/api/dashboard/busca?q=noel' \
  -H "Authorization: Bearer $TOKEN"

# 4. Criar nova ocorrência
curl -X POST http://localhost:3000/api/ocorrencias \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "aluno_id": 1,
    "tipo": "INDISCIPLINA",
    "gravidade": "LEVE",
    "descricao": "Conversas durante a prova",
    "medida_aplicada": "ADVERTENCIA_VERBAL"
  }'
```

## 🐳 Docker

```bash
docker build -t escola-backend .
docker run -p 3000:3000 --env-file .env escola-backend
```
