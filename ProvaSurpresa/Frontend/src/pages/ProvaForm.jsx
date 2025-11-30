import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function ProvaForm() {
  const [titulo, setTitulo] = useState('')
  const [perguntas, setPerguntas] = useState([
    { ordem: 1, pergunta: '', imagem: '', alternativas: [
      { descricao: '', correta: false },
      { descricao: '', correta: false },
      { descricao: '', correta: false },
      { descricao: '', correta: false }
    ]}
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const addPergunta = () => {
    setPerguntas([
      ...perguntas,
      {
        ordem: perguntas.length + 1,
        pergunta: '',
        imagem: '',
        alternativas: [
          { descricao: '', correta: false },
          { descricao: '', correta: false },
          { descricao: '', correta: false },
          { descricao: '', correta: false }
        ]
      }
    ])
  }

  const removePergunta = (index) => {
    const newPerguntas = perguntas.filter((_, i) => i !== index)
    setPerguntas(newPerguntas.map((p, i) => ({ ...p, ordem: i + 1 })))
  }

  const updatePergunta = (index, field, value) => {
    const newPerguntas = [...perguntas]
    newPerguntas[index][field] = value
    setPerguntas(newPerguntas)
  }

  const updateAlternativa = (perguntaIndex, altIndex, field, value) => {
    const newPerguntas = [...perguntas]
    newPerguntas[perguntaIndex].alternativas[altIndex][field] = value
    
    // Se marcar como correta, desmarcar as outras
    if (field === 'correta' && value === true) {
      newPerguntas[perguntaIndex].alternativas.forEach((alt, i) => {
        if (i !== altIndex) alt.correta = false
      })
    }
    
    setPerguntas(newPerguntas)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validação
    if (!titulo.trim()) {
      setError('Título da prova é obrigatório')
      return
    }
    
    for (let i = 0; i < perguntas.length; i++) {
      const p = perguntas[i]
      if (!p.pergunta.trim()) {
        setError(`Pergunta ${i + 1} está vazia`)
        return
      }
      
      const hasCorrect = p.alternativas.some(alt => alt.correta)
      if (!hasCorrect) {
        setError(`Pergunta ${i + 1} não tem alternativa correta marcada`)
        return
      }
      
      const emptyAlts = p.alternativas.filter(alt => !alt.descricao.trim())
      if (emptyAlts.length > 0) {
        setError(`Pergunta ${i + 1} tem alternativas vazias`)
        return
      }
    }

    setLoading(true)

    try {
      await api.post('/provas', { titulo, perguntas })
      navigate('/')
    } catch (err) {
      console.error(err)
      setError('Erro ao criar prova. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== 'professor') {
    return (
      <div className="app">
        <nav className="navbar">
          <h2>Prova Surpresa</h2>
          <button onClick={handleLogout}>Sair</button>
        </nav>
        <div className="container">
          <div className="error">
            Acesso negado. Apenas professores podem criar provas.
          </div>
          <Link to="/">
            <button className="btn">Voltar</button>
          </Link>
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
        <h1>Criar Nova Prova</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="form-group">
              <label htmlFor="titulo">Título da Prova</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {perguntas.map((pergunta, pIndex) => (
            <div key={pIndex} className="card">
              <h3>Pergunta {pIndex + 1}</h3>
              
              <div className="form-group">
                <label>Texto da Pergunta</label>
                <textarea
                  value={pergunta.pergunta}
                  onChange={(e) => updatePergunta(pIndex, 'pergunta', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>URL da Imagem (opcional)</label>
                <input
                  type="text"
                  value={pergunta.imagem}
                  onChange={(e) => updatePergunta(pIndex, 'imagem', e.target.value)}
                  disabled={loading}
                />
              </div>

              <h4>Alternativas</h4>
              {pergunta.alternativas.map((alt, aIndex) => (
                <div key={aIndex} className="form-group">
                  <label>Alternativa {String.fromCharCode(65 + aIndex)}</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={alt.descricao}
                      onChange={(e) => updateAlternativa(pIndex, aIndex, 'descricao', e.target.value)}
                      required
                      disabled={loading}
                      style={{ flex: 1 }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={alt.correta}
                        onChange={(e) => updateAlternativa(pIndex, aIndex, 'correta', e.target.checked)}
                        disabled={loading}
                      />
                      Correta
                    </label>
                  </div>
                </div>
              ))}
              
              {perguntas.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removePergunta(pIndex)}
                  disabled={loading}
                >
                  Remover Pergunta
                </button>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addPergunta}
              disabled={loading}
            >
              Adicionar Pergunta
            </button>
            
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Prova'}
            </button>
            
            <Link to="/">
              <button type="button" className="btn btn-secondary" disabled={loading}>
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProvaForm
