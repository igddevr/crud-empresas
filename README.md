# 🏢 Sistema de Gerenciamento de Empresas (CRUD Corporativo)

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://crud-empresas.vercel.app)
[![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render)](https://crud-empresas-api-gry5.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)

Aplicação corporativa Full Stack desenvolvida para cadastro, consulta, edição e exclusão de empresas. O sistema adota uma arquitetura desacoplada com deploy independente para frontend e backend, além de uma camada de dados híbrida com chaveamento automático de repositórios.

🔗 **Aplicação em Produção:** [https://crud-empresas.vercel.app]

---

## 📌 Arquitetura do Projeto

O sistema foi estruturado com separação clara de responsabilidades:

1. **Frontend (Vercel):** Single Page Application (SPA) desenvolvida com React e Vite, hospedada com distribuição global via CDN e comunicação HTTPS.
2. **Backend (Render):** API RESTful em Node.js e Express, com suporte a CORS e modularização de rotas e controllers.
3. **Persistência de Dados Híbrida (Repository Pattern):**
   - **Ambiente de Demonstração (Cloud):** Base SQLite (`better-sqlite3`) inicializada e populada automaticamente em arquivo local com dados fictícios para viabilizar testes públicos com custo zero e segurança.
   - **Ambiente Corporativo (On-Premises):** Integração com banco legado Firebird 2.5 via driver nativo, mantendo a compatibilidade de regras e nomenclatura de tabelas.

[ Usuário / Navegador ]
│
▼
[ Frontend - Vercel ] (React + Vite - Dark Mode)
│
▼ (Chamadas REST / Axios)
[ Backend API - Render ] (Node.js + Express)
│
├──> [Cloud Demo]: SQLite (better-sqlite3) -> demo.db
└──> [Local / On-Premises]: Driver nativo Firebird 2.5

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React.js** (Vite)
- **Axios** para requisições HTTP
- **CSS3** estruturado para tema escuro (_Dark Mode_)
- Modais reativos para inserção e atualização cadastral

### Backend

- **Node.js** com **Express**
- **CORS** para permissão de requisições cross-origin
- **Repository Service Pattern** para abstração da camada de banco de dados

### Bancos de Dados

- **SQLite (better-sqlite3):** Utilizado em produção na nuvem com transações atômicas e migração automática na inicialização.
- **Firebird 2.5:** Banco relacional configurado para o cenário de execução corporativa interna.

---

## ⚙️ Funcionalidades

- [x] **Listagem Paginada:** Navegação entre registros por meio de controle de paginação.
- [x] **Filtro em Tempo Real:** Pesquisa flexível combinando Razão Social ou CNPJ.
- [x] **Cadastro de Empresas:** Validação de campos obrigatórios (CNPJ, Inscrição Estadual, Razão Social, Regime Tributário, CNAE).
- [x] **Edição Cadastral:** Atualização pontual de registros com pré-carregamento dos dados em modal.
- [x] **Exclusão Segura:** Remoção de empresas diretamente na camada de persistência.
- [x] **Ambiente Sandbox:** Demonstração pública isolada que previne exposição de dados sensíveis corporativos.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Node.js instalado (v18+)
Git

### 1. Clonar o projeto

git clone [https://github.com/igddevr/crud-empresas.git]
cd crud-empresas

### 2. Configurar e rodar o Backend

cd backend
npm install

Crie o arquivo .env na pasta backend/:

PORT=3000
USE_DEMO_DB=true

Inicie o servidor:

npm start ou: node src/server.js

O SQLite criará o arquivo demo.db e carregará as empresas demonstrativas automaticamente.

### 3. Configurar e rodar o Frontend

Abra outro terminal e acesse a pasta do cliente:

cd frontend
npm install
npm run dev

Abra o navegador no endereço indicado (por padrão http://localhost:5173).

### 📄 Licença

Projeto desenvolvido para fins de demonstração técnica e portfólio profissional.
