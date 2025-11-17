import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

function MinhasRespostas() {
  const [respostas, setRespostas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadRespostas()
  }, [])

  const loadRespostas = async () => {
    try {
      setLoading(true)
      const response = await api.get('/respostas/me')
      setRespostas(response.data)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar respostas')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Prova Surpresa</h2>
        <div>
          <Link to="/">Provas</Link>
          {user?.role === 'professor' && (
            <Link to="/provas/criar">Criar Prova</Link>
          )}
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="container">
        <h1>Minhas Respostas</h1>
        
        {error && <div className="error">{error}</div>}
        
        {loading ? (
          <p>Carregando respostas...</p>
        ) : respostas.length === 0 ? (
          <div className="card">
            <p>Você ainda não respondeu nenhuma prova.</p>
            <Link to="/">
              <button className="btn">Ver Provas Disponíveis</button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {respostas.map((resposta) => (
              <div key={resposta.id} className="card">
                <h3>{resposta.prova_titulo || 'Prova sem título'}</h3>
                <p>
                  <strong>Data:</strong> {formatDate(resposta.dt_resposta)}
                </p>
                <p>
                  <strong>ID da Resposta:</strong> {resposta.id}
                </p>
                {typeof resposta.corretas !== 'undefined' && (
                  <p>
                    <strong>Pontuação:</strong> {resposta.corretas} / {resposta.total}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MinhasRespostas
