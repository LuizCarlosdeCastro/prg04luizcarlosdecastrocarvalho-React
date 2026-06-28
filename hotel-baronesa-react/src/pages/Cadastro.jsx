import { useNavigate, Link } from 'react-router-dom';
import CadastroForm from '../components/CadastroForm';

export default function Cadastro() {
  const navigate = useNavigate();

  const handleCadastro = async (dadosDoFormulario) => {
    try {
      // Dispara a requisição POST para salvar na API do Spring Boot
      const response = await fetch('prg04luizcarlosdecastrocarvalho-backend-production.up.railway.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosDoFormulario)
      });

      if (response.ok) {
        alert('Usuário cadastrado com absoluto sucesso!');
        // Após cadastrar, joga o fluxo de volta para o login ou home
        navigate('/login'); 
      } else {
        alert('Erro ao tentar cadastrar. Verifique se o login já existe.');
      }
    } catch (error) {
      console.error('Erro de conexão com o back-end:', error);
      alert('Não foi possível conectar com o servidor do banco de dados.');
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="row justify-content-center w-100">
        <div className="col-11 col-sm-9 col-md-7 col-lg-5">
          <div className="card shadow border-0 p-4">
            <div className="text-center mb-4">
              <h1 className="h3 mb-2 fw-normal">Novo Cadastro</h1>
              <p className="text-muted small">Crie sua conta para acessar o Hotel Baronesa</p>
            </div>

            {/* Injeta o formulário passando a função de manipulação da API */}
            <CadastroForm onCadastroSuccess={handleCadastro} />

          </div>
          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none text-dark small">← Voltar para a Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}