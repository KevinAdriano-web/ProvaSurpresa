# ProvaSurpresa

**Nome do projeto:** ProvaSurpresa

**Descrição:** Plataforma de provas online para criação e aplicação rápida de questionários com pontuação automática, controle de papéis (aluno/professor) e interface web moderna.

## Visão geral

Este repositório contém uma aplicação full-stack com:

- Backend: API REST construída com Node.js e Express, usando MySQL para persistência.
- Frontend: SPA em React + Vite, com autenticação por JWT e chamadas via Axios.

## Estrutura do projeto

```
ProvaSurpresa/
├── Backend/           # API REST em Node.js
│   ├── src/
│   │   ├── controller/
│   │   ├── repository/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── rotas.js
│   ├── sql/
│   └── package.json
│
└── Frontend/          # Interface em React
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    ├── index.html
    └── package.json
```

## Pré-requisitos

- Node.js 16+
- MySQL 8+
- npm ou yarn

## Instalação e execução (local)

### Backend

1. Vá para a pasta do backend:

```powershell
cd 'c:\projects\Projetos - Programação Web\Projeto Forms\ProvaSurpresa-2.0\ProvaSurpresa\Backend'
```

2. Instale dependências e configure variáveis de ambiente em um arquivo `.env` (copie `.env.example`):

```powershell
npm install
# editar .env para definir MYSQL_* e JWT_SECRET e opcionalmente FRONTEND_URL
npm run start
```

O backend por padrão sobe na porta `5010` (pode ser alterada com `PORT`).

### Frontend

```powershell
cd 'c:\projects\Projetos - Programação Web\Projeto Forms\ProvaSurpresa-2.0\ProvaSurpresa\Frontend'
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000` e, em desenvolvimento, as chamadas para `/api` são encaminhadas para `http://localhost:5010` via proxy do Vite.

## Principais melhorias aplicadas

- JWT agora inclui expiração configurável (`JWT_EXPIRES_IN`, padrão `1h`). Em produção `JWT_SECRET` é obrigatório e a aplicação falha na inicialização se não estiver definido.
- CORS no backend pode ser restrito pela variável `FRONTEND_URL` (recomendado em produção). Em desenvolvimento continua liberado por conveniência.
- Conexão com MySQL: a ausência de conexão fará a aplicação encerrar no startup (evita rodar sem persistência). Logs não expõem senhas.

## Endpoints principais

- `POST /login` - Autenticação (retorna JWT)
- `POST /register` - Criar usuário
- `GET /provas` - Listar provas
- `GET /provas/:id` - Obter prova com perguntas e alternativas
- `POST /provas` - Criar prova (requer role `professor`)
- `POST /respostas` - Submeter respostas
- `GET /respostas/me` - Listar respostas do usuário autenticado

## Variáveis de ambiente importantes

- `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` — conexão MySQL
- `JWT_SECRET` — segredo para assinar JWT (obrigatório em `NODE_ENV=production`)
- `JWT_EXPIRES_IN` — tempo de expiração do token (ex.: `1h`, `30m`)
- `FRONTEND_URL` — URL do frontend permitida via CORS (ex.: `http://localhost:3000`)

## Próximos passos recomendados

- Implementar refresh tokens e política de invalidação de tokens para logout server-side.
- Migrar token para cookie `HttpOnly` se desejar maior proteção contra XSS.
- Adicionar rate-limiting nas rotas sensíveis (`/login`, `/register`).
- Criar scripts de migração/seed para o banco de dados e testes automatizados.
