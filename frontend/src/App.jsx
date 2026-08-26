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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cnpj: '',
    inscricaoEstadual: '',
    regimeTributario: '',
    cnae: ''
  })

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.razaoSocial.trim() || !formData.cnpj.trim()) {
    alert('Razão Social e CNPJ são campos obrigatórios!');
    return;
    }

    try {
      await api.post('/empresas', formData)

      setIsModalOpen(false)
      setFormData({
        razaoSocial: '',
        cnpj: '',
        inscricaoEstadual: '',
        regimeTributario: '',
        cnae: ''
      });

      setSuccessMessage('Empresa cadastrada com sucesso!')
      setTimeout(() => setSuccessMessage(null), 3000)
      fetchEmpresas()
    } catch (err) {
      setError('Erro ao cadastrar empresa. Por favor, tente novamente mais tarde.')
    }
  };
  
  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
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
      {successMessage && <div className="toast-success">{successMessage}</div>}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cadastrar Nova Empresa</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Razão Social *</label>
                <input
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div className="form-group">
                <label>CNPJ *</label>
                <input
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="Apenas números"
                  required
                />
              </div>

              <div className="form-group">
                <label>Inscrição Estadual</label>
                <input
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Regime Tributário</label>
                <select 
                name="regimeTributario" 
                className="select-regime"
                value={formData.regimeTributario}
                onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="N">Normal / Simples (N)</option>
                  <option value="H">Habilitado / Especial (H)</option>
                </select>
              </div>

              <div className="form-group">
                <label>CNAE</label>
                <input
                  name="cnae"
                  value={formData.cnae}
                  onChange={handleChange}
                  placeholder="Ex: 6201-5/00"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="header">
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

        <button className="add-button"
        onClick={() => setIsModalOpen(true)}
      >
        + Adicionar Empresa
      </button>
      
      </div>

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
