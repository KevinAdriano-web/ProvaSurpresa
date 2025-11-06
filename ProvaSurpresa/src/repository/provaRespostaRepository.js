import { conection } from './conection.js'

async function createResposta(loginId, provaId) {
  const [result] = await conection.execute(
    'INSERT INTO prova_resposta (login, prova) VALUES (?, ?)',
    [loginId, provaId]
  )
  return { id: result.insertId }
}

async function addRespostaItem(provaRespostaId, perguntaId, alternativaId) {
  const [result] = await conection.execute(
    'INSERT INTO prova_resposta_item (prova_resposta, pergunta, alternativa) VALUES (?, ?, ?)',
    [provaRespostaId, perguntaId, alternativaId]
  )
  return { id: result.insertId }
}

async function listByLogin(loginId) {
  const [rows] = await conection.execute('SELECT * FROM prova_resposta WHERE login = ? ORDER BY criacao DESC', [loginId])
  return rows
}

export default {
  createResposta,
  addRespostaItem,
  listByLogin
}
