import { conection } from './conection.js'

async function createPergunta(provaId, ordem, pergunta, imagem) {
  const [result] = await conection.execute(
    'INSERT INTO pergunta (prova, ordem, pergunta, imagem) VALUES (?, ?, ?, ?)',
    [provaId, ordem, pergunta, imagem || null]
  )
  return { id: result.insertId }
}

async function listByProva(provaId) {
  const [rows] = await conection.execute('SELECT * FROM pergunta WHERE prova = ? ORDER BY ordem', [provaId])
  return rows
}

export default {
  createPergunta,
  listByProva
}
