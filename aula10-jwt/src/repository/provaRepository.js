import { conection } from './conection.js'

async function createProva(loginId, titulo) {
  const [result] = await conection.execute('INSERT INTO prova (login, titulo) VALUES (?, ?)', [loginId, titulo])
  return { id: result.insertId }
}

async function getProvas() {
  const [rows] = await conection.execute('SELECT p.id, p.titulo, p.login FROM prova p')
  return rows
}

async function getProvaById(id) {
  const [[prova]] = await conection.execute('SELECT * FROM prova WHERE id = ?', [id])
  if (!prova) return null

  const [perguntas] = await conection.execute('SELECT * FROM pergunta WHERE prova = ? ORDER BY ordem', [id])

  for (let p of perguntas) {
    const [alternativas] = await conection.execute('SELECT * FROM alternativa WHERE pergunta = ?', [p.id])
    p.alternativas = alternativas
  }

  prova.perguntas = perguntas
  return prova
}

export default {
  createProva,
  getProvas,
  getProvaById
}
