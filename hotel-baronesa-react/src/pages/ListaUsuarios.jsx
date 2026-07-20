import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';

export default function ListaUsuarios() {
  const [usuariosReais, setUsuariosReais] = useState([]);
  const [reservasReais, setReservasReais] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('usuarios'); 

  useEffect(() => {
    Promise.all([
      fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/usuarios/findall'),
      fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/reservas/findall') 
    ])
      .then(async ([resUsuarios, resReservas]) => {
        if (!resUsuarios.ok || !resReservas.ok) {
          throw new Error('Falha ao buscar dados do servidor.');
        }
        
        const dataUsuarios = await resUsuarios.json();
        const dataReservas = await resReservas.json();

        const listaDeUsuarios = dataUsuarios.content || []; 
        const dadosFormatados = listaDeUsuarios.map((user) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          status: user.tipoUsuario === 'ADMIN' ? 'Admin' : 'Ativo',
          badge: user.tipoUsuario === 'ADMIN' ? 'bg-primary' : 'bg-success'
        }));

        const listaDeReservas = dataReservas.content || dataReservas || [];

        setUsuariosReais(dadosFormatados);
        setReservasReais(listaDeReservas);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados do painel:', error);
        setErro(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container my-5">
      
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow border-0 p-3 bg-dark text-white">
            <small className="text-muted text-uppercase fw-bold">Total de Usuários</small>
            <h3 className="fw-bold mb-0 mt-1">{usuariosReais.length}</h3>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow border-0 p-3 bg-primary text-white" style={{ backgroundColor: 'var(--cor-primaria)' }}>
            <small className="text-white-50 text-uppercase fw-bold">Total de Reservas</small>
            <h3 className="fw-bold mb-0 mt-1">{reservasReais.length}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow p-4 border-0">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Painel Administrativo</h1>
          <Link to="/cadastro" className="btn btn-success d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
            <img src="/assets/images/add.ico" alt="" width="20" />
            Novo Usuário
          </Link>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button 
              className={`nav-link fw-bold ${abaAtiva === 'usuarios' ? 'active text-primary' : 'text-muted'}`}
              onClick={() => setAbaAtiva('usuarios')}
              style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
            >
              👥 Usuários ({usuariosReais.length})
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link fw-bold ${abaAtiva === 'reservas' ? 'active text-primary' : 'text-muted'}`}
              onClick={() => setAbaAtiva('reservas')}
              style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
            >
              📅 Histórico de Reservas ({reservasReais.length})
            </button>
          </li>
        </ul>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">🔍</span>
              <input 
                type="text" 
                id="BuscaPainel" 
                className="form-control" 
                placeholder={abaAtiva === 'usuarios' ? "Pesquisar por nome ou e-mail..." : "Pesquisar por hóspede ou quarto..."} 
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Carregando dados do servidor...</p>
          </div>
        )}

        {erro && (
          <div className="alert alert-danger text-center" role="alert">
            {erro} - Certifique-se de que o backend está rodando!
          </div>
        )}

        {!loading && !erro && (
          <>
            {abaAtiva === 'usuarios' ? (
              <UserTable dadosUsuarios={usuariosReais} />
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Hóspede</th>
                      <th>Quarto</th>
                      <th>Período</th>
                      <th>Serviços</th>
                      <th className="text-end">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasReais.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">Nenhuma reserva localizada.</td>
                      </tr>
                    ) : (
                      reservasReais.map((reserva) => {
                        const categoriaNome = reserva.quarto?.categoria?.nome || 'Padrão';
                        const ehAssombrado = categoriaNome.toLowerCase().includes('assombrado');

                        return (
                          <tr key={reserva.id}>
                            <td><span className="badge bg-light text-dark border">#{reserva.id}</span></td>
                            <td>
                              <div className="fw-bold">{reserva.cliente?.nome || 'Desconhecido'}</div>
                              <small className="text-muted">{reserva.cliente?.login}</small>
                            </td>
                            <td>
                              <div>Nº {reserva.quarto?.numero || 'N/A'}</div>
                              <small className={`badge ${ehAssombrado ? 'bg-danger text-dark fw-bold' : 'bg-primary-subtle text-primary'}`}>
                                {ehAssombrado ? '👻 ' : ''}{categoriaNome}
                              </small>
                            </td>
                            <td>
                              <small className="d-block text-muted">Entrada: {reserva.dataCheckIn}</small>
                              <small className="d-block text-muted">Saída: {reserva.dataCheckOut}</small>
                            </td>
                            <td>
                              {reserva.servicosAdicionais && reserva.servicosAdicionais.length > 0 ? (
                                <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                                  {reserva.servicosAdicionais.map((serv, idx) => (
                                    <span key={idx} className="badge bg-light text-secondary border" style={{ fontSize: '10px' }}>
                                      {serv.nome}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                            <td className="text-end fw-bold text-primary">
                              R$ {reserva.pagamento?.valor?.toFixed(2) || '0.00'}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="mt-3">
          <Link to="/" className="text-decoration-none text-muted small">← Voltar para Página inicial</Link>
        </div>
      </div>
    </div>
  );
}