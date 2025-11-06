import { conection } from './conection.js'

async function findByEmail(email) {
  const [rows] = await conection.execute('SELECT * FROM login WHERE email = ?', [email])
  return rows[0]
}

async function create(user) {
  const [result] = await conection.execute(
    'INSERT INTO login (email, senha, role) VALUES (?, ?, ?)',
    [user.email, user.senha, user.role || 'user']
  )
  return { id: result.insertId }
}

async function findById(id) {
  const [rows] = await conection.execute('SELECT id, email, role FROM login WHERE id = ?', [id])
  return rows[0]
}

export default {
  findByEmail,
  create,
  findById
}
