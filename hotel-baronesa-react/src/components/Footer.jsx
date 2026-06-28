import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-4 mt-auto">
      <div className="container text-center text-white">
        <div className="d-flex justify-content-center gap-4">
          <Link to="/atividade-3" className="text-white tex-decoration-none text-muted">Atividade 3</Link>
          <Link to="/sandbox" className="text-white text-decoration-none">Sandbox</Link>
          <Link to="/paleta" className="text-white text-decoration-none">Cores</Link>
        </div>
        <p className="mt-3 mb-0 small">&copy; 2026 Hotel Baronesa.</p>
      </div>
    </footer>
  );
}