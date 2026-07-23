import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formDados, setFormDados] = useState({
    id: '',
    nome: '',
    email: '',
    login: '',
    senha: '',
    tipoUsuario: 'CLIENTE'
  });

  const BASE_URL = 'https://prg04luizcarlosdecastrocarvalho-backend.onrender.com';

  useEffect(() => {
    const idUsuario = localStorage.getItem('idUsuario');
    const token = localStorage.getItem('token');

    if (!idUsuario) {
      alert('Sessão expirada ou usuário não identificado. Faça login novamente.');
      navigate('/login');
      return;
    }

    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch(`${BASE_URL}/usuarios/findbyid/${idUsuario}`, { headers })
      .then(async (res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os dados do perfil.');
        return res.json();
      })
      .then((data) => {
        setFormDados({
          id: data.id,
          nome: data.nome || '',
          email: data.email || '',
          login: data.login || data.email || '',
          senha: '', 
          tipoUsuario: data.tipoUsuario || 'CLIENTE'
        });
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar perfil:', err);
        alert(err.message);
        setCarregando(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formDados.senha || formDados.senha.trim() === '') {
      alert('Por favor, informe a sua senha atual (ou uma nova senha) para confirmar as alterações.');
      return;
    }

    setSalvando(true);
    const token = localStorage.getItem('token');

    const payload = {
      nome: formDados.nome,
      email: formDados.email,
      login: formDados.login,
      senha: formDados.senha,
      tipoUsuario: formDados.tipoUsuario
    };

    try {
      const response = await fetch(`${BASE_URL}/usuarios/update/${formDados.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Falha ao atualizar dados.');
      }

      localStorage.setItem('nomeUsuario', formDados.nome);

      alert('Perfil atualizado com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error('Erro na atualização do perfil:', error);
      alert(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0 p-4">
        <div className="d-flex align-items-center mb-4 gap-3">
          <div 
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3"
            style={{ width: '60px', height: '60px', backgroundColor: 'var(--cor-primaria)' }}
          >
            {formDados.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="h4 mb-0 fw-bold">Meu Perfil</h2>
            <small className="text-muted">Gerencie suas informações pessoais</small>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nome Completo</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              value={formDados.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">E-mail</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formDados.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Usuário / Login</label>
            <input
              type="text"
              className="form-control"
              name="login"
              value={formDados.login}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Senha / Nova Senha</label>
            <input
              type="password"
              className="form-control"
              name="senha"
              value={formDados.senha}
              onChange={handleChange}
              placeholder="Digite sua senha atual ou uma nova"
              required
            />
            <small className="text-muted d-block mt-1">
              Obrigatório para confirmar as alterações.
            </small>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}