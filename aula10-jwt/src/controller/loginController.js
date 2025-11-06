import express from 'express'
import loginRepository from '../repository/loginRepository.js'
import { generateToken } from '../utils/jwt.js'

const router = express.Router()

router.post('/login', async (req, resp) => {
  try {
    const { email, senha } = req.body
    const user = await loginRepository.findByEmail(email)
    if (!user || user.senha !== senha)
      return resp.status(401).json({ error: 'invalid_credentials' })

    // remove senha from response
    const safeUser = { id: user.id, email: user.email, role: user.role }
    const token = generateToken(safeUser)
    return resp.json({ token, user: safeUser })
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

router.post('/register', async (req, resp) => {
  try {
    const { email, senha, role } = req.body
    const existing = await loginRepository.findByEmail(email)
    if (existing)
      return resp.status(400).json({ error: 'email_exists' })

    const r = await loginRepository.create({ email, senha, role })
    const user = await loginRepository.findById(r.id)
    return resp.status(201).json(user)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

export default router
