# Prova Surpresa - Sistema de Provas Online

Sistema completo para criação e realização de provas online, desenvolvido com Node.js, Express e MySQL no backend, e HTML, CSS e JavaScript puro no frontend.

## 📋 Funcionalidades

### Para Alunos:
- Cadastro e login
- Visualizar provas disponíveis
- Realizar provas
- Enviar respostas

### Para Professores:
- Cadastro e login
- Criar provas com múltiplas perguntas
- Adicionar alternativas com marcação de correta
- Incluir imagens nas questões (opcional)

## 🚀 Como Executar

### 1. Configurar o Banco de Dados

Execute o script SQL no MySQL:

```bash
cd Backend/sql
mysql -u root -p < ddl.sql
```

Ou execute o conteúdo do arquivo `ddl.sql` no MySQL Workbench.

### 2. Configurar a Conexão com o Banco

Edite o arquivo `Backend/src/repository/conection.js` com suas credenciais do MySQL:

```javascript
let conection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha_aqui',  // Altere aqui
  database: 'bdprovaweb'
})
```

### 3. Instalar Dependências do Backend

```bash
cd Backend
npm install
```

### 4. Iniciar o Servidor Backend

```bash
npm start
```

O servidor vai iniciar na porta 5010.

### 5. Abrir o Frontend

Abra o arquivo `Frontend/index.html` no navegador ou use um servidor local:

```bash
cd Frontend
# Se tiver o Live Server instalado no VS Code, clique com botão direito em index.html e selecione "Open with Live Server"
```

## 📁 Estrutura do Projeto

```
ProvaSurpresa/
├── Backend/
│   ├── sql/
│   │   └── ddl.sql                    # Script de criação do banco
│   ├── src/
│   │   ├── app.js                     # Configuração do Express
│   │   ├── rotas.js                   # Registro de rotas
│   │   ├── controller/
│   │   │   ├── loginController.js     # Login e registro
│   │   │   ├── provaController.js     # Gerenciamento de provas
│   │   │   └── respostaController.js  # Envio de respostas
│   │   ├── repository/
│   │   │   ├── conection.js           # Conexão MySQL
│   │   │   ├── loginRepository.js
│   │   │   ├── provaRepository.js
│   │   │   ├── perguntaRepository.js
│   │   │   ├── alternativaRepository.js
│   │   │   └── provaRespostaRepository.js
│   │   └── utils/
│   │       └── jwt.js                 # Autenticação JWT
│   └── package.json
└── Frontend/
    ├── index.html                      # Página de login
    ├── register.html                   # Página de cadastro
    ├── home.html                       # Lista de provas
    ├── criar-prova.html                # Criar prova (professor)
    ├── fazer-prova.html                # Realizar prova (aluno)
    ├── styles/
    │   ├── global.css
    │   ├── login.css
    │   ├── home.css
    │   ├── criar-prova.css
    │   └── fazer-prova.css
    └── scripts/
        ├── api.js
        ├── login.js
        ├── register.js
        ├── home.js
        ├── criar-prova.js
        └── fazer-prova.js
```

## 🔑 Como Testar

1. **Cadastrar um Professor:**
   - Acesse a página de cadastro
   - Email: `professor@teste.com`
   - Senha: `123456`
   - Tipo: Professor

2. **Criar uma Prova:**
   - Faça login como professor
   - Clique em "Criar Nova Prova"
   - Adicione título, perguntas e alternativas
   - Marque a alternativa correta
   - Clique em "Criar Prova"

3. **Cadastrar um Aluno:**
   - Saia da conta do professor
   - Cadastre um novo usuário como "Aluno"

4. **Fazer a Prova:**
   - Faça login como aluno
   - Selecione uma prova
   - Responda as questões
   - Envie as respostas

## 🛠️ Tecnologias Utilizadas

### Backend:
- Node.js
- Express.js
- MySQL2
- JSON Web Token (JWT)
- Multer

### Frontend:
- HTML5
- CSS3
- JavaScript (Vanilla)

## 📝 Endpoints da API

### Autenticação:
- `POST /login` - Fazer login
- `POST /register` - Cadastrar usuário

### Provas:
- `GET /provas` - Listar todas as provas
- `GET /provas/:id` - Obter detalhes de uma prova
- `POST /provas` - Criar nova prova (requer autenticação de professor)

### Respostas:
- `POST /respostas` - Enviar respostas (requer autenticação)
- `GET /respostas/me` - Ver minhas respostas (requer autenticação)

## 🔐 Autenticação

O sistema usa JWT (JSON Web Token) para autenticação. O token deve ser enviado no header `x-access-token` em todas as requisições autenticadas.

## 👥 Autores

Desenvolvido para a disciplina de Desenvolvimento Web.

## 📄 Licença

Este projeto é para fins educacionais.
