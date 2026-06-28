import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (dadosDoFormulario) => {
    try {
      // Dispara os dados reais para o Spring Boot
      const response = await fetch('prg04luizcarlosdecastrocarvalho-backend-production.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosDoFormulario) // envia { login, senha }
      });

      if (response.ok) {
        const usuarioLogado = await response.json();

        console.log("EXATAMENTE O QUE O SPRING BOOT DEVOLVEU NO LOGIN:", usuarioLogado);
        
        localStorage.setItem('tipoUsuario', usuarioLogado.tipoUsuario); 
        localStorage.setItem('idUsuario', usuarioLogado.id);
        localStorage.setItem('nomeUsuario', usuarioLogado.nome);
        
        alert(`Bem-vindo, ${usuarioLogado.nome}!`);
        navigate('/'); 
      } else {
        alert('Usuário ou senha incorretos!');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      alert('Erro ao conectar com o banco de dados.');
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow border-0 p-4">
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 fw-normal">Login de usuário</h1>
            </div>

            {/* Passa a função que lida com a API */}
            <LoginForm onLoginSuccess={handleLogin} />

          </div>
          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none text-dark small">← Voltar para a Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}