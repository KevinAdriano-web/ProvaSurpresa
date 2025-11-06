import express from 'express'
import provaRespostaRepository from '../repository/provaRespostaRepository.js'
import { getAuthentication } from '../utils/jwt.js'

const router = express.Router()

// Submit a prova resposta: body { prova, itens: [ { pergunta, alternativa } ] }
router.post('/respostas', getAuthentication(null), async (req, resp) => {
  try {
    const loginId = req.user.id
    const { prova, itens } = req.body

    const r = await provaRespostaRepository.createResposta(loginId, prova)
    const provaRespostaId = r.id

    if (Array.isArray(itens)) {
      for (let it of itens) {
        await provaRespostaRepository.addRespostaItem(provaRespostaId, it.pergunta, it.alternativa)
      }
    }

    resp.status(201).json({ id: provaRespostaId })
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

router.get('/respostas/me', getAuthentication(null), async (req, resp) => {
  try {
    const loginId = req.user.id
    const rows = await provaRespostaRepository.listByLogin(loginId)
    resp.json(rows)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

export default router
