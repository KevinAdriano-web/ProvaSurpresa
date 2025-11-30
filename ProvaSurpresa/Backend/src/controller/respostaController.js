import express from 'express'
import provaRespostaRepository from '../repository/provaRespostaRepository.js'
import { getAuthentication } from '../utils/jwt.js'

const router = express.Router()

// Enviar uma resposta de prova: body { prova, itens: [ { pergunta, alternativa } ] }
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

    // Calcular pontuação (número de alternativas corretas e total respondido)
    try {
      const score = await provaRespostaRepository.computeScore(provaRespostaId)
      resp.status(201).json({ id: provaRespostaId, score })
    } catch (scoreErr) {
      console.error('Error computing score:', scoreErr)
      // retornar pelo menos o id se a correção falhar
      resp.status(201).json({ id: provaRespostaId })
    }
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

router.get('/respostas/me', getAuthentication(null), async (req, resp) => {
  try {
    const loginId = req.user.id
    const rows = await provaRespostaRepository.listByLoginWithScore(loginId)
    resp.json(rows)
  }
  catch (err) {
    console.error(err)
    resp.status(500).end()
  }
})

export default router
