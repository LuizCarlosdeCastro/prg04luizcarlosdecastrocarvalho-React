import { useState } from 'react';

export default function CadastroForm({ onCadastroSuccess }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('COMUM'); // Padrão comum

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Agrupa e envia os dados exatamente como as propriedades mapeadas no Spring Boot
    onCadastroSuccess({ nome, email, login, senha, tipoUsuario });
  };

  const handleLimpar = () => {
    setNome('');
    setEmail('');
    setLogin('');
    setSenha('');
    setTipoUsuario('COMUM');
  };

  return (
    <form id="cadastro" onSubmit={handleSubmit}>
      <div className="mb-3 text-start">
        <label htmlFor="nomeInput" className="form-label fw-bold">Nome Completo:</label>
        <input 
          type="text" 
          className="form-control" 
          id="nomeInput" 
          required 
          placeholder="Digite seu nome completo" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="emailInput" className="form-label fw-bold">E-mail:</label>
        <input 
          type="email" 
          className="form-control" 
          id="emailInput" 
          required 
          placeholder="nome@exemplo.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="loginInput" className="form-label fw-bold">Login/Usuário:</label>
        <input 
          type="text" 
          className="form-control" 
          id="loginInput" 
          required 
          placeholder="Crie um usuário de login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="passwordInput" className="form-label fw-bold">Senha:</label>
        <input 
          type="password" 
          className="form-control" 
          id="passwordInput" 
          required
          minLength={6} 
          maxLength={18} 
          placeholder="Crie uma senha estável" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="form-text">Mínimo de 6 caracteres.</div>
      </div>

      <div className="mb-4 text-start">
        <label htmlFor="tipoSelect" className="form-label fw-bold">Tipo de Perfil:</label>
        <select 
          id="tipoSelect" 
          className="form-select" 
          value={tipoUsuario} 
          onChange={(e) => setTipoUsuario(e.target.value)}
        >
          <option value="COMUM">Usuário Comum (Cliente)</option>
          <option value="ADMIN">Administrador (Hotel)</option>
        </select>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-success" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
          Cadastrar Usuário
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={handleLimpar}
        >
          Limpar campos
        </button>
      </div>
    </form>
  );
}