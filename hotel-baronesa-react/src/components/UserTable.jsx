import React, { useState } from 'react';

export default function UserTable({ dadosUsuarios = [], recarregarDados }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  
  const [formDados, setFormDados] = useState({
    nome: '',
    email: '',
    senha: '',
    login: '',
    tipoUsuario: 'CLIENTE'
  });

const handleAbrirEdicao = (user) => {
  setUsuarioEditando(user);
  setFormDados({
    nome: user.nome || '',
    email: user.email || '',
    senha: '', 
    login: user.login || user.email || '',
    tipoUsuario: user.tipoUsuario || (user.status === 'Admin' ? 'ADMIN' : 'CLIENTE')
  });
  setModalAberto(true);
};

  const handleFecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDados({ ...formDados, [name]: value });
  };

  const handleSalvarEdicao = async (e) => {
  e.preventDefault();
  if (!usuarioEditando) return;

  const payload = {
    nome: formDados.nome,
    email: formDados.email,
    login: formDados.login,
    tipoUsuario: formDados.tipoUsuario,
    senha: formDados.senha.trim() !== '' ? formDados.senha : usuarioEditando.senha
  };

  try {
    const response = await fetch(
      `https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/usuarios/${usuarioEditando.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao atualizar usuário no servidor.');
    }

    alert('Usuário atualizado com sucesso!');
    handleFecharModal();
    
    if (recarregarDados) recarregarDados();

  } catch (error) {
    console.error('Erro na atualização:', error);
    alert('Erro ao atualizar usuário. Verifique as informações fornecidas.');
  }
};

  const handleExcluir = async (id) => {
    const confirmou = window.confirm(`Tem certeza que deseja excluir o usuário #${id}?`);
    if (!confirmou) return;

    try {
      const response = await fetch(
        `https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/usuarios/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error('Falha ao excluir o usuário.');
      }

      alert('Usuário excluído com sucesso!');
      
      if (recarregarDados) recarregarDados();

    } catch (error) {
      console.error('Erro na exclusão:', error);
      alert('Não foi possível excluir o usuário.');
    }
  };

  return (
    <div className="table-responsive">
      <table className="table user-table align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Status</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {dadosUsuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge rounded-pill ${user.badge}`}>
                  {user.status}
                </span>
              </td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-warning me-1"
                  onClick={() => handleAbrirEdicao(user)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleExcluir(user.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAberto && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuário #{usuarioEditando?.id}</h5>
                <button type="button" className="btn-close" onClick={handleFecharModal}></button>
              </div>
              <form onSubmit={handleSalvarEdicao}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={formDados.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Login</label>
                    <input
                      type="text"
                      className="form-control"
                      name="login"
                      value={formDados.login}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formDados.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      name="senha"
                      value={formDados.senha}
                      onChange={handleInputChange}
                      placeholder="Digite uma nova senha"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Tipo de Usuário</label>
                    <select
                      className="form-select"
                      name="tipoUsuario"
                      value={formDados.tipoUsuario}
                      onChange={handleInputChange}
                    >
                      <option value="CLIENTE">Cliente / Padrão</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleFecharModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}