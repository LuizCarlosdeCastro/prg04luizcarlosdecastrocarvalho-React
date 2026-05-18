export default function UserTable({ dadosUsuarios }) {
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
                <button className="btn btn-sm btn-warning me-1">Editar</button>
                <button className="btn btn-sm btn-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}