import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';

export default function ListaUsuarios() {
  const [usuariosReais, setUsuariosReais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/usuarios/findall') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha ao buscar usuários do servidor.');
        }
        return response.json();
      })
      .then((data) => {
        const listaDeUsuarios = data.content || []; 

        const dadosFormatados = listaDeUsuarios.map((user) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          status: user.tipoUsuario === 'ADMIN' ? 'Admin' : 'Ativo',
          badge: user.tipoUsuario === 'ADMIN' ? 'bg-primary' : 'bg-success'
        }));
        
        setUsuariosReais(dadosFormatados);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
        setErro(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Lista Atualizada de Usuários</h1>
          <Link to="/cadastro" className="btn btn-success d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
            <img src="/assets/images/add.ico" alt="" width="20" />
            Novo Usuário
          </Link>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">🔍</span>
              <input type="text" id="BuscaUsuario" className="form-control" placeholder="Pesquisar por nome ou e-mail..." />
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Carregando usuários do banco de dados...</p>
          </div>
        )}

        {erro && (
          <div className="alert alert-danger text-center" role="alert">
            {erro} - Certifique-se de que o backend está rodando!
          </div>
        )}

        {!loading && !erro && (
          <UserTable dadosUsuarios={usuariosReais} />
        )}

        <div className="mt-3">
          <Link to="/" className="text-decoration-none text-muted small">← Voltar para Pagina inicial</Link>
        </div>
      </div>
    </div>
  );
}