import { conection } from './conection.js'

async function createAlternativa(perguntaId, descricao, correta) {
  const [result] = await conection.execute(
    'INSERT INTO alternativa (pergunta, descricao, correta) VALUES (?, ?, ?)',
    [perguntaId, descricao, correta ? 1 : 0]
  )
  return { id: result.insertId }
}

async function listByPergunta(perguntaId) {
  const [rows] = await conection.execute('SELECT * FROM alternativa WHERE pergunta = ?', [perguntaId])
  return rows
}

export default {
  createAlternativa,
  listByPergunta
}
