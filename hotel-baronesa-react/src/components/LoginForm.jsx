export default function LoginForm({ onLoginSuccess }) {
  return (
    <form id="login" onSubmit={onLoginSuccess}>
      <div className="mb-3 text-start">
        <label htmlFor="nome" className="form-label fw-bold">Nome:</label>
        <input type="text" className="form-control" id="nome" required placeholder="Digite seu nome" />
      </div>

      <div className="mb-3 text-start">
        <label htmlFor="email" className="form-label fw-bold">E-mail:</label>
        <input type="email" className="form-control" id="email" required placeholder="Digite seu e-mail" />
      </div>

      <div className="mb-4 text-start">
        <label htmlFor="password" className="form-label fw-bold">Senha:</label>
        <input type="password" className="form-control" id="password" minLength={6} maxLength={18} placeholder="Digite sua senha" />
        <div className="form-text">Mínimo de 6 caracteres.</div>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
          Enviar
        </button>
        <button type="reset" className="btn btn-outline-secondary">
          Limpar
        </button>
      </div>
    </form>
  );
}