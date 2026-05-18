import { Link } from 'react-router-dom';

export default function Navbar() {
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
            <li className="nav-item">
              <Link className="nav-link" to="/atividade-3">Atividade 3</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sandbox">Sandbox</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/paleta">Paleta</Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-dark d-flex align-items-center" to="/login">
                <img src="/assets/images/Hotel_Guest.ico" alt="" width="20" className="me-2" />
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}