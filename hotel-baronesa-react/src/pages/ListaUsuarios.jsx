import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';

export default function ListaUsuarios() {
  // Seus dados continuam aqui na página principal (ou viriam de uma API no futuro)
  const listaDeClientes = [
    { id: 1, nome: "Luiz Carlos", email: "luiz@ifba.edu.br", status: "Ativo", badge: "bg-success" },
    { id: 2, nome: "Jonatas Ferreira", email: "jonatas@ifba.com", status: "Ativo", badge: "bg-success" },
    { id: 3, nome: "Jose Gata", email: "jose@outlook.com", status: "Inativo", badge: "bg-secondary" },
    { id: 4, nome: "Maria Silva", email: "maria@gmail.com", status: "Ativo", badge: "bg-success" },
    { id: 5, nome: "Lara Bastos", email: "lara@hotmail.com", status: "Pendente", badge: "bg-danger" },
  ];

  return (
    <div className="container my-5">
      <div className="card shadow p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Lista de Usuários</h1>
          <Link to="/cadastro" className="btn btn-success d-flex align-items-center gap-2" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
            <img src="/assets/images/add.ico" alt="" width="20" />
            Novo Usuário
          </Link>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">🔍</span>
              <input type="text" id="BuscaUsuario" className="form-control" placeholder="Pesquisar por nome ou e-mail..." />
            </div>
          </div>
        </div>

        {/* Chamando o componente da tabela e passando os dados */}
        <UserTable dadosUsuarios={listaDeClientes} />

        <div className="mt-3">
          <Link to="/" className="text-decoration-none text-muted small">← Voltar para Pagina inicial</Link>
        </div>
      </div>
    </div>
  );
}