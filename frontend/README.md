# 🎨 Frontend

SPA simples em HTML + CSS + JavaScript vanilla. Consome a API em `http://localhost:3000/api`.

## ▶️ Como rodar

### Opção 1: Python (mais simples)
```bash
cd frontend
python3 -m http.server 8080
```

### Opção 2: Nginx via Docker
```bash
docker run -p 8080:80 -v $(pwd)/frontend:/usr/share/nginx/html:ro nginx:alpine
```

### Opção 3: docker-compose (recomendado — sobe tudo)
```bash
cd ..
docker-compose up -d
```

Acesse: http://localhost:8080

## ⚙️ Configurar URL da API

A API é detectada automaticamente como `<protocolo>://<host>:3000/api`. Para mudar, edite no `index.html`:

```javascript
const API = 'https://meu-backend-em-producao.com/api';
```

## 🎯 Funcionalidades implementadas

- Login com JWT (token guardado em `localStorage`)
- Auto-login na próxima visita
- Dashboard com estatísticas e busca rápida
- Histórico individual do aluno (clique no resultado da busca)
- Listagem de alunos, turmas, ocorrências
- Página de usuários (visível só para ADMIN)
- Layout responsivo (desktop e mobile)

## 🚧 Próximas features sugeridas

- Formulários para criar/editar (atualmente é só leitura no frontend)
- Filtros por período nas ocorrências
- Gráficos com Chart.js
- Exportar relatórios em PDF
- Notificações push para responsáveis (integração com Twilio/SendGrid)
