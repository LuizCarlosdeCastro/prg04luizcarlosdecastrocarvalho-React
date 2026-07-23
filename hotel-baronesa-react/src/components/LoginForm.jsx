import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCarregando(true);

    try {
      const response = await fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha })
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');
      }

      const data = await response.json();

      localStorage.setItem('nomeUsuario', data.nome || 'Usuário');
      localStorage.setItem('tipoUsuario', data.tipoUsuario || 'CLIENTE');
      localStorage.setItem('idUsuario', data.id || '');

      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      navigate('/');
    } catch (error) {
      alert(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form id="login" onSubmit={handleSubmit}>
      <div className="mb-3 text-start">
        <label htmlFor="loginInput" className="form-label fw-bold">Login:</label>
        <input 
          type="text" 
          className="form-control" 
          id="loginInput" 
          required 
          placeholder="Digite seu usuário/login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)} 
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
          onChange={(e) => setSenha(e.target.value)} 
        />
        <div className="form-text">Mínimo de 6 caracteres.</div>
      </div>

      <div className="d-grid gap-2">
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
          disabled={carregando}
        >
          {carregando ? 'Entrando...' : 'Enviar'}
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={() => { setLogin(''); setSenha(''); }}
          disabled={carregando}
        >
          Limpar
        </button>
      </div>
    </form>
  );
}