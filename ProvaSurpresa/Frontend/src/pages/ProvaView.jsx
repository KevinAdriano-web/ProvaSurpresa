import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function ProvaView() {
  const [prova, setProva] = useState(null)
  const [respostas, setRespostas] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadProva()
  }, [id])

  const loadProva = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/provas/${id}`)
      setProva(response.data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar prova')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSelectAlternativa = (perguntaId, alternativaId) => {
    setRespostas({
      ...respostas,
      [perguntaId]: alternativaId
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Check if all questions are answered
    const unanswered = prova.perguntas.filter(p => !respostas[p.id])
    if (unanswered.length > 0) {
      setError('Por favor, responda todas as perguntas antes de submeter')
      return
    }

    setSubmitting(true)

    try {
      const itens = Object.entries(respostas).map(([pergunta, alternativa]) => ({
        pergunta: parseInt(pergunta),
        alternativa: parseInt(alternativa)
      }))

      const r = await api.post('/respostas', {
        prova: parseInt(id),
        itens
      })

      // If API returned score, show it immediately
      if (r.data && r.data.score) {
        setSuccess({ score: r.data.score })
      } else {
        setSuccess(true)
      }

      setTimeout(() => {
        navigate('/minhas-respostas')
      }, 3000)
    } catch (err) {
      console.error(err)
      setError('Erro ao submeter respostas. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <nav className="navbar">
          <h2>Prova Surpresa</h2>
          <button onClick={handleLogout}>Sair</button>
        </nav>
        <div className="container">
          <p>Carregando prova...</p>
        </div>
      </div>
    )
  }

  if (!prova) {
    return (
      <div className="app">
        <nav className="navbar">
          <h2>Prova Surpresa</h2>
          <button onClick={handleLogout}>Sair</button>
        </nav>
        <div className="container">
          <div className="error">Prova não encontrada</div>
          <Link to="/">
            <button className="btn">Voltar</button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="app">
        <nav className="navbar">
          <h2>Prova Surpresa</h2>
          <button onClick={handleLogout}>Sair</button>
        </nav>
        <div className="container">
          <div className="success">
            <h2>Prova submetida com sucesso!</h2>
            {success.score ? (
              <div>
                <p>
                  <strong>Sua pontuação:</strong> {success.score.corretas} / {success.score.total}
                </p>
                <p>Redirecionando para suas respostas...</p>
              </div>
            ) : (
              <p>Redirecionando para suas respostas...</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Prova Surpresa</h2>
        <div>
          <Link to="/">Provas</Link>
          <Link to="/minhas-respostas">Minhas Respostas</Link>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="container">
        <h1>{prova.titulo}</h1>
        <p>Criada por: {prova.login_email}</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {prova.perguntas
            ?.sort((a, b) => a.ordem - b.ordem)
            .map((pergunta, index) => (
              <div key={pergunta.id} className="pergunta-card">
                <h3>Pergunta {index + 1}</h3>
                <p>{pergunta.pergunta}</p>
                
                {pergunta.imagem && (
                  <img
                    src={pergunta.imagem}
                    alt="Imagem da pergunta"
                    style={{ maxWidth: '100%', marginTop: '1rem' }}
                  />
                )}
                
                <div className="alternativas">
                  {pergunta.alternativas?.map((alt, altIndex) => (
                    <label
                      key={alt.id}
                      className={`alternativa ${
                        respostas[pergunta.id] === alt.id ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`pergunta-${pergunta.id}`}
                        value={alt.id}
                        checked={respostas[pergunta.id] === alt.id}
                        onChange={() => handleSelectAlternativa(pergunta.id, alt.id)}
                        disabled={submitting}
                      />
                      <span>
                        {String.fromCharCode(65 + altIndex)}) {alt.descricao}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Submetendo...' : 'Submeter Prova'}
            </button>
            
            <Link to="/">
              <button type="button" className="btn btn-secondary" disabled={submitting}>
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProvaView
