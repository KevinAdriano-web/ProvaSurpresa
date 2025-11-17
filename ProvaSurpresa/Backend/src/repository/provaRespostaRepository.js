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

async function listByLoginWithScore(loginId) {
  if (!conection) throw new Error('No DB connection')

  // Detect which datetime column exists in `prova_resposta` (some DBs might have different column names)
  const [[dbRow]] = await conection.execute('SELECT DATABASE() AS db')
  const dbName = dbRow ? dbRow.db : null

  let dateCol = null
  try {
    if (dbName) {
      const [cols] = await conection.execute(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'prova_resposta' AND COLUMN_NAME IN ('criacao','dt_resposta')`,
        [dbName]
      )
      if (cols && cols.length > 0) dateCol = cols[0].COLUMN_NAME
    }
  } catch (err) {
    // ignore and fallback
    console.error('Could not detect date column for prova_resposta:', err && err.message ? err.message : err)
  }

  const dateExpr = dateCol ? `pr.\`${dateCol}\`` : 'NULL'
  const groupBy = dateCol ? `pr.id, ${dateExpr}, p.titulo` : `pr.id, p.titulo`
  const orderBy = dateCol ? `${dateExpr} DESC` : `pr.id DESC`

  const sql = `SELECT pr.id, ${dateExpr} AS dt_resposta, p.titulo AS prova_titulo, COUNT(pri.id) AS total, IFNULL(SUM(a.correta),0) AS corretas\n    FROM prova_resposta pr\n    LEFT JOIN prova_resposta_item pri ON pr.id = pri.prova_resposta\n    LEFT JOIN alternativa a ON pri.alternativa = a.id\n    LEFT JOIN prova p ON pr.prova = p.id\n    WHERE pr.login = ?\n    GROUP BY ${groupBy}\n    ORDER BY ${orderBy}`

  const [rows] = await conection.execute(sql, [loginId])
  return rows
}

async function computeScore(provaRespostaId) {
  const [[totalRow]] = await conection.execute(
    'SELECT COUNT(*) AS total FROM prova_resposta_item WHERE prova_resposta = ?',
    [provaRespostaId]
  )

  const [[corretasRow]] = await conection.execute(
    `SELECT IFNULL(SUM(a.correta),0) AS corretas
     FROM prova_resposta_item pri
     JOIN alternativa a ON pri.alternativa = a.id
     WHERE pri.prova_resposta = ?`,
    [provaRespostaId]
  )

  return { total: totalRow.total || 0, corretas: corretasRow.corretas || 0 }
}

export default {
  createResposta,
  addRespostaItem,
  listByLogin,
  listByLoginWithScore,
  computeScore
}
