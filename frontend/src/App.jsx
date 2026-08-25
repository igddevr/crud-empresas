import { useState, useEffect } from 'react'
import api from './services/api'
import './App.css'

import { Trash2 } from 'lucide-react';

function App() {
  const [empresas, setEmpresas] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  async function fetchEmpresas() {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get(`/empresas?page=${page}&limit=20&search=${appliedSearch}`)
      setEmpresas(response.data.data)
    } catch (err) {
      setError('Erro ao buscar empresas. Por favor, tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  };

  async function handleSearch() {
    setAppliedSearch(searchInput)
    setPage(1)
  };
  
  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      fetchEmpresas()
      return
    }

    try {
      await api.delete(`/empresas/${id}`)
      fetchEmpresas()
    } catch (err) {
      setError('Erro ao excluir empresa. Por favor, tente novamente mais tarde.')
    }
  };

  useEffect(() => {
    fetchEmpresas()
  }, [page, appliedSearch])


  return (
    <div className="App">
      
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form 
      className="search-form" 
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}>
        
        <input
          className="search-input"
          type="text"
          placeholder="Pesquisar por Razão Social ou CNPJ"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button className="search-button" type="submit">
          Pesquisar
        </button>

        {appliedSearch && (
          <button 
            className="clear-button"
            type="button"
            onClick={() => {
              setAppliedSearch('')
              setSearchInput('')
              setPage(1)
            }}
          >
            Limpar
          </button>
        )}

      </form>
      
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Razão Social</th>
              <th>CNPJ</th>
              <th>Inscrição Estadual</th>
              <th>Regime</th>
              <th>CNAE</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.ID}>
                <td>{empresa.ID}</td>
                <td>{empresa.RAZAO_SOCIAL}</td>
                <td>{empresa.CNPJ}</td>
                <td>{empresa.INSCRICAO_ESTADUAL}</td>
                <td>{empresa.REGIME_TRIBUTARIO}</td>
                <td>{empresa.CNAE}</td>
                <td>
                  <button onClick={() => handleDelete(empresa.ID)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        
        <button 
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
        >
          Anterior
        </button>

        <span> 
          Página <strong>{page}</strong>
        </span>

        <button 
          onClick={() => setPage(page + 1)}
          disabled={empresas.length < 20 || loading}
        >
          Próxima
        </button>

      </div>
    
    </div>
  )

}
export default App
