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
// Only professors can create provas
router.post('/provas', getAuthentication(u => u && u.role === 'professor'), async (req, resp) => {
  try {
    const { titulo, perguntas } = req.body

    // Basic validation
    if (!titulo || typeof titulo !== 'string' || !titulo.trim()) {
      return resp.status(400).json({ error: 'titulo_obrigatorio', message: 'O título da prova é obrigatório' })
    }

    if (!Array.isArray(perguntas) || perguntas.length === 0) {
      return resp.status(400).json({ error: 'perguntas_obrigatorias', message: 'A prova deve conter ao menos uma pergunta' })
    }

    // enforce reasonable limits and sanitize
    const MAX_PERGUNTAS = 100
    const MAX_ALTERNATIVAS = 10
    const MAX_TITULO = 200
    const MAX_PERGUNTA_LEN = 1000
    const MAX_ALTERNATIVA_LEN = 500

    if (titulo.trim().length > MAX_TITULO) {
      return resp.status(400).json({ error: 'titulo_longo', message: `O título não pode exceder ${MAX_TITULO} caracteres` })
    }

    if (perguntas.length > MAX_PERGUNTAS) {
      return resp.status(400).json({ error: 'muitas_perguntas', message: `Número máximo de perguntas é ${MAX_PERGUNTAS}` })
    }

    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i]
      const perguntaText = typeof p.pergunta === 'string' ? p.pergunta.trim() : ''
      if (!perguntaText) {
        return resp.status(400).json({ error: 'pergunta_invalida', message: `Pergunta ${i + 1} está vazia ou inválida` })
      }
      if (perguntaText.length > MAX_PERGUNTA_LEN) {
        return resp.status(400).json({ error: 'pergunta_longa', message: `Pergunta ${i + 1} excede ${MAX_PERGUNTA_LEN} caracteres` })
      }

      if (!Array.isArray(p.alternativas) || p.alternativas.length === 0) {
        return resp.status(400).json({ error: 'alternativas_obrigatorias', message: `Pergunta ${i + 1} deve ter ao menos uma alternativa` })
      }
      if (p.alternativas.length > MAX_ALTERNATIVAS) {
        return resp.status(400).json({ error: 'muitas_alternativas', message: `Pergunta ${i + 1} excede o máximo de ${MAX_ALTERNATIVAS} alternativas` })
      }

      let temCorreta = false
      for (let j = 0; j < p.alternativas.length; j++) {
        const a = p.alternativas[j]
        const desc = typeof a.descricao === 'string' ? a.descricao.trim() : ''
        if (!desc) {
          return resp.status(400).json({ error: 'alternativa_invalida', message: `Pergunta ${i + 1}, alternativa ${j + 1} tem descrição vazia` })
        }
        if (desc.length > MAX_ALTERNATIVA_LEN) {
          return resp.status(400).json({ error: 'alternativa_longa', message: `Pergunta ${i + 1}, alternativa ${j + 1} excede ${MAX_ALTERNATIVA_LEN} caracteres` })
        }

        // coerce correta to boolean
        if (a.correta === true || a.correta === 'true') temCorreta = true
      }

      if (!temCorreta) {
        return resp.status(400).json({ error: 'alternativa_correta_obrigatoria', message: `Pergunta ${i + 1} deve ter ao menos uma alternativa marcada como correta` })
      }
    }
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
