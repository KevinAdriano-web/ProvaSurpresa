import express from 'express'
import loginRepository from '../repository/loginRepository.js'
import { generateToken } from '../utils/jwt.js'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.post('/login', async (req, resp) => {
  try {
    let { email, senha } = req.body
    email = typeof email === 'string' ? email.trim().toLowerCase() : ''
    senha = typeof senha === 'string' ? senha : ''

    // Validação básica
    if (!email) return resp.status(400).json({ error: 'email_obrigatorio', message: 'Email é obrigatório' })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return resp.status(400).json({ error: 'email_invalido', message: 'Email inválido' })

    if (!senha) return resp.status(400).json({ error: 'senha_obrigatoria', message: 'Senha é obrigatória' })
    if (senha.length > 128) return resp.status(400).json({ error: 'senha_tamanho', message: 'Senha muito longa' })

    const user = await loginRepository.findByEmail(email)
    if (!user) return resp.status(401).json({ error: 'invalid_credentials' })
    const match = await bcrypt.compare(senha, user.senha || '')
    if (!match) return resp.status(401).json({ error: 'invalid_credentials' })

    // remover senha da resposta
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
    let { email, senha, role } = req.body
    email = typeof email === 'string' ? email.trim().toLowerCase() : ''
    senha = typeof senha === 'string' ? senha : ''

    // Validação básica
    if (!email) return resp.status(400).json({ error: 'email_obrigatorio', message: 'Email é obrigatório' })
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return resp.status(400).json({ error: 'email_invalido', message: 'Email inválido' })

    if (!senha) return resp.status(400).json({ error: 'senha_obrigatoria', message: 'Senha é obrigatória' })
    if (senha.length < 6) return resp.status(400).json({ error: 'senha_curta', message: 'A senha deve ter pelo menos 6 caracteres' })
    if (senha.length > 128) return resp.status(400).json({ error: 'senha_tamanho', message: 'Senha muito longa' })

    const existing = await loginRepository.findByEmail(email)
    if (existing)
      return resp.status(400).json({ error: 'email_exists' })

    // Gerar hash da senha antes de armazenar
    const saltRounds = 10
    const hash = await bcrypt.hash(senha, saltRounds)

    const r = await loginRepository.create({ email, senha: hash, role })
    const user = await loginRepository.findById(r.id)
    return resp.status(201).json(user)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

export default router
