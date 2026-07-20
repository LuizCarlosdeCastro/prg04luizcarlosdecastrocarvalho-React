import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function MinhasReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    // 1. Verifica se o usuário está logado
    const idUsuarioLogado = localStorage.getItem('idUsuario');
    const nome = localStorage.getItem('nomeUsuario');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (!idUsuarioLogado) {
      alert('Você precisa estar logado para visualizar suas reservas.');
      navigate('/login');
      return;
    }

    setNomeUsuario(nome || `Usuário (${tipoUsuario})`);

    // 2. Busca TODAS as reservas do backend
    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/reservas/findall')
      .then(res => res.json())
      .then(data => {
        const todasAsReservas = data.content || data || [];
        
        // 3. Filtra dinamicamente para exibir APENAS as reservas deste cliente específico
        const reservasFiltradas = todasAsReservas.filter(
          reserva => reserva.cliente && reserva.cliente.id === Number(idUsuarioLogado)
        );
        
        setReservas(reservasFiltradas);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar reservas:", err);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Minhas Reservas</h1>
          <p className="text-muted small">Olá, {nomeUsuario}. Aqui estão suas estadias agendadas.</p>
        </div>
        <Link to="/reservas/nova" className="btn btn-primary" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
          Nova Reserva
        </Link>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {!loading && reservas.length === 0 && (
        <div className="card text-center p-5 border-0 shadow-sm bg-light">
          <div className="card-body">
            <h5 className="card-title text-muted">Nenhuma reserva encontrada</h5>
            <p className="card-text text-secondary">Você ainda não realizou nenhuma reserva em nosso hotel.</p>
            <Link to="/quartos" className="btn btn-outline-primary btn-sm mt-2">Ver Quartos Disponíveis</Link>
          </div>
        </div>
      )}

      {!loading && reservas.length > 0 && (
        <div className="row g-4">
          {reservas.map(reserva => {
            const nomeCategoria = reserva.quarto?.categoria?.nome || 'Padrão';
            const ehAssombrado = nomeCategoria.toLowerCase().includes('assombrado');

            return (
              <div className="col-12 col-md-6" key={reserva.id}>
                {/* Se o quarto for assombrado, ganha uma roupagem visual diferenciada e misteriosa */}
                <div className={`card h-100 border-0 shadow-sm ${ehAssombrado ? 'bg-dark text-white border-start border-4 border-danger' : ''}`}>
                  <div className="card-body p-4">
                    
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title mb-1">Quarto Nº {reserva.quarto?.numero || 'N/A'}</h5>
                        <span className={`badge ${ehAssombrado ? 'bg-danger text-dark fw-bold' : 'bg-primary'}`}>
                          {ehAssombrado ? '👻 ' : ''}{nomeCategoria}
                        </span>
                      </div>
                      <span className={`badge rounded-pill bg-success px-3 py-2`}>
                        {reserva.status || 'CONFIRMADA'}
                      </span>
                    </div>

                    <hr className={ehAssombrado ? 'border-secondary' : ''} />

                    <div className="row mb-3 text-sm">
                      <div className="col-6">
                        <small className={ehAssombrado ? 'text-warning' : 'text-muted'}>📅 Check-In</small>
                        <p className="fw-bold mb-0">{reserva.dataCheckIn}</p>
                      </div>
                      <div className="col-6">
                        <small className={ehAssombrado ? 'text-warning' : 'text-muted'}>📅 Check-Out</small>
                        <p className="fw-bold mb-0">{reserva.dataCheckOut}</p>
                      </div>
                    </div>

                    {/* Exibe os Serviços Adicionais contratados, caso existam */}
                    {reserva.servicosAdicionais && reserva.servicosAdicionais.length > 0 && (
                      <div className="mb-3">
                        <small className={`d-block mb-1 ${ehAssombrado ? 'text-warning' : 'text-muted'}`}>🛠️ Serviços Adicionais Incluídos:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {reserva.servicosAdicionais.map((s, idx) => (
                            <span key={idx} className={`badge ${ehAssombrado ? 'bg-secondary text-light' : 'bg-light text-dark border'}`}>
                              {s.nome || `Serviço #${s.id}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`p-3 rounded d-flex justify-content-between align-items-center ${ehAssombrado ? 'bg-black text-white' : 'bg-light text-dark'}`}>
                      <div>
                        <small className="d-block text-muted text-uppercase style={{ fontSize: '10px' }}">Total Pago ({reserva.pagamento?.formaPagamento})</small>
                        <span className={`h5 fw-bold mb-0 ${ehAssombrado ? 'text-danger' : 'text-primary'}`}>
                          R$ {reserva.pagamento?.valor?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}