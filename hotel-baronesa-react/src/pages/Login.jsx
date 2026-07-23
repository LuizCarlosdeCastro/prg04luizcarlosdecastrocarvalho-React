import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (usuarioLogado) => {
    console.log("Usuário logado com sucesso:", usuarioLogado);
    
    alert(`Bem-vindo, ${usuarioLogado.nome}!`);
    
    navigate('/'); 
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow border-0 p-4">
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 fw-normal">Login de usuário</h1>
            </div>

            <LoginForm onLoginSuccess={handleLoginSuccess} />

          </div>
          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none text-dark small">← Voltar para a Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}