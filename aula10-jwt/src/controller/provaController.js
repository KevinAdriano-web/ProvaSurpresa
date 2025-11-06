import express from 'express'
import provaRepository from '../repository/provaRepository.js'
import perguntaRepository from '../repository/perguntaRepository.js'
import alternativaRepository from '../repository/alternativaRepository.js'
import { getAuthentication } from '../utils/jwt.js'

const router = express.Router()

router.get('/provas', async (req, resp) => {
  try {
    const provas = await provaRepository.getProvas()
    resp.json(provas)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

router.get('/provas/:id', async (req, resp) => {
  try {
    const id = req.params.id
    const prova = await provaRepository.getProvaById(id)
    if (!prova) return resp.status(404).end()
    resp.json(prova)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

// Protected: create prova with perguntas and alternativas
router.post('/provas', getAuthentication(null), async (req, resp) => {
  try {
    const { titulo, perguntas } = req.body
    const loginId = req.user.id
    const r = await provaRepository.createProva(loginId, titulo)
    const provaId = r.id

    if (Array.isArray(perguntas)) {
      for (let p of perguntas) {
        const pRes = await perguntaRepository.createPergunta(provaId, p.ordem || 0, p.pergunta, p.imagem)
        if (Array.isArray(p.alternativas)) {
          for (let a of p.alternativas) {
            await alternativaRepository.createAlternativa(pRes.id, a.descricao, a.correta)
          }
        }
      }
    }

    const created = await provaRepository.getProvaById(provaId)
    resp.status(201).json(created)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

export default router
