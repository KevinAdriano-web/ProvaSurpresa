import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Configurar dotenv para carregar o arquivo .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../../.env') })

console.log('🔍 Variáveis carregadas do .env:')
console.log('- Host:', process.env.MYSQL_HOST)
console.log('- User:', process.env.MYSQL_USER)
console.log('- Password:', process.env.MYSQL_PASSWORD ? '***' : '(VAZIA - ERRO!)')
console.log('- Database:', process.env.MYSQL_DATABASE)

// Remover aspas da senha se houver
let senha = process.env.MYSQL_PASSWORD || ''
if (senha.startsWith("'") && senha.endsWith("'")) {
  senha = senha.slice(1, -1)
}

let conection = null

try {
  conection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: senha,
    database: process.env.MYSQL_DATABASE || 'provaweb2'
  })

  console.log('✓ Conectado ao banco de dados:', process.env.MYSQL_DATABASE)
} catch (err) {
  console.error('✗ Falha ao conectar ao banco de dados. A API continuará rodando, mas chamadas ao DB vão falhar.')
  console.error(err && err.stack ? err.stack : err)
  // manter `conection` como null para evitar travamentos; o código do repositório deve tratar nulls ou lançará erro ao usar
}

export { conection }

