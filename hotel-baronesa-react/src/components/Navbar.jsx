import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [tipoUsuarioLogado, setTipoUsuarioLogado] = useState(null);

  useEffect(() => {
    setTipoUsuarioLogado(localStorage.getItem('tipoUsuario'));
  }, [location]);

  const handleLogout = () => {
    localStorage.clear(); 
    setTipoUsuarioLogado(null);
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
          <ul className="navbar-nav ms-auto align-items-center">
            
            {tipoUsuarioLogado === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/usuarios">Usuários</Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/quartos">Ver Quartos</Link>
            </li>

            {tipoUsuarioLogado !== null && tipoUsuarioLogado !== "" && (
              <li className="nav-item">
                 <Link className="nav-link" to="/reservas/minhas">Minhas Reservas</Link>
              </li>
              )}

            <li className="nav-item">
              <Link className="nav-link" to="/reservas/nova">Nova Reserva</Link>
            </li>

            <li className="nav-item ms-lg-3">
              {tipoUsuarioLogado ? (
                <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
                  Sair
                </button>
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