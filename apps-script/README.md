# 📊 Versão Google Apps Script

Esta é a primeira versão do Sistema Disciplinar Escolar, construída em **Google Apps Script** com **Google Sheets** como banco de dados. Roda como um Web App público — basta abrir a URL.

## 🌐 URL pública (live)

> https://script.google.com/macros/s/AKfycbx_aEJjnkUcSZT5-MSG0ykcAI8fxS9XnuY-HSYQiuPZb926gQb6DZ5YQBOVJcg-lwqh9g/exec

**Credenciais de teste:**
- `admin` / `escola123` (administrador — vê tudo)
- `maria` / `prof123` (professor)
- `joao` / `coord123` (coordenador)

## 📂 Arquivos

- `Codigo.gs` — Backend (Apps Script). Contém:
  - `criarSistemaEscolar()` — cria todas as abas/planilhas iniciais com dados de exemplo
  - `doGet()` — serve o Web App
  - `fazerLogin()`, `getDashboardData()`, `getHistoricoAluno()`, `getOcorrencias()`, `getAlunos()`, `getTurmas()`, `getUsuarios()`, `salvarNovaOcorrencia()` — endpoints do backend
- `Index.html` — Frontend SPA (HTML/CSS/JS vanilla)

## 🚀 Como instalar do zero

1. Crie uma planilha nova em [sheets.new](https://sheets.new)
2. Vá em **Extensões > Apps Script**
3. Cole o conteúdo de `Codigo.gs` no arquivo `Código.gs`
4. Crie um novo arquivo HTML chamado `Index.html` e cole o conteúdo de `Index.html`
5. Salve (Ctrl+S)
6. Clique em **Executar** > selecione a função `criarSistemaEscolar` e rode (autorize quando pedir)
7. Implante: **Implantar > Nova implantação > Tipo: App da Web > Quem tem acesso: Qualquer pessoa**
8. Copie a URL gerada

## 🗂️ Estrutura das abas no Sheets

| Aba          | Conteúdo                                           |
|--------------|----------------------------------------------------|
| LOGIN        | Tela de boas-vindas com credenciais de demonstração |
| DASHBOARD    | Visão geral com contadores e busca rápida          |
| TURMAS       | Cadastro de turmas                                 |
| ALUNOS       | Cadastro de alunos vinculados a turmas             |
| OCORRENCIAS  | Registros de ocorrências disciplinares             |
| USUARIOS     | Usuários do sistema com perfis e senhas (hash)     |

## ⚠️ Limitações

- Performance limitada a poucos milhares de registros (Sheets é planilha, não banco)
- Sem índices nem joins eficientes
- Apps Script tem timeout de 6 minutos por execução
- Não escala bem para múltiplas escolas/usuários simultâneos

**Por isso a versão PostgreSQL/Node.js foi criada — veja na raiz do repositório.**
