import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [tipoUsuarioLogado, setTipoUsuarioLogado] = useState(null);
  const [nomeUsuarioLogado, setNomeUsuarioLogado] = useState('');

  useEffect(() => {
    setTipoUsuarioLogado(localStorage.getItem('tipoUsuario'));
    
    const nomeSalvo = localStorage.getItem('nomeUsuario');
    setNomeUsuarioLogado(nomeSalvo || '');
  }, [location]);

  const handleLogout = () => {
    localStorage.clear(); 
    setTipoUsuarioLogado(null);
    setNomeUsuarioLogado('');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: 'var(--cor-primaria)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/images/icone.png" alt="Logo" width="40" height="40" className="d-inline-block align-text-top me-2" />
          <span className="h4 mb-0">Hotel Baronesa</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            
            {tipoUsuarioLogado === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/usuarios">
                  📊 Dashboard
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/quartos">Ver Quartos</Link>
            </li>

            {tipoUsuarioLogado && (
              <li className="nav-item">
                <Link className="nav-link" to="/reservas/minhas">Minhas Reservas</Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/reservas/nova">Nova Reserva</Link>
            </li>

            <li className="nav-item ms-lg-2">
              {tipoUsuarioLogado ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    id="dropdownMenuUser"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span 
                      className="bg-light text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '28px', height: '28px', fontSize: '14px' }}
                    >
                      {nomeUsuarioLogado.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span>{nomeUsuarioLogado || 'Minha Conta'}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownMenuUser">
                    <li className="px-3 py-2 border-bottom">
                      <small className="text-muted d-block">Logado como</small>
                      <strong className="text-dark d-block text-truncate" style={{ maxWidth: '180px' }}>
                        {nomeUsuarioLogado}
                      </strong>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 mt-1" to="/perfil">
                        ✏️ Editar Perfil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        🚪 Sair
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link className="btn btn-outline-light d-flex align-items-center" to="/cadastro">
                    Cadastrar
                  </Link>
                  <Link className="btn btn-dark d-flex align-items-center" to="/login">
                    <img src="/assets/images/Hotel_Guest.ico" alt="" width="20" className="me-2" />
                    Login
                  </Link>
                </div>
              )}
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}