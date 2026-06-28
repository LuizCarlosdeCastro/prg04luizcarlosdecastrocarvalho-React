import { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  // 1. Criamos os estados para capturar o que é digitado
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // 2. Passamos os dados digitados para a função que está lá na página de Login
    onLoginSuccess({ login, senha });
  };

  return (
    <form id="login" onSubmit={handleSubmit}>
      {/* Alterado de 'Nome'/'E-mail' para apenas 'Login', que é o que seu back-end pede */}
      <div className="mb-3 text-start">
        <label htmlFor="loginInput" className="form-label fw-bold">Login:</label>
        <input 
          type="text" 
          className="form-control" 
          id="loginInput" 
          required 
          placeholder="Digite seu usuário/login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)} // Atualiza o estado
        />
      </div>

      <div className="mb-4 text-start">
        <label htmlFor="password" className="form-label fw-bold">Senha:</label>
        <input 
          type="password" 
          className="form-control" 
          id="password" 
          required
          minLength={6} 
          maxLength={18} 
          placeholder="Digite sua senha" 
          value={senha}
          onChange={(e) => setSenha(e.target.value)} // Atualiza o estado
        />
        <div className="form-text">Mínimo de 6 caracteres.</div>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
          Enviar
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => { setLogin(''); setSenha(''); }}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}