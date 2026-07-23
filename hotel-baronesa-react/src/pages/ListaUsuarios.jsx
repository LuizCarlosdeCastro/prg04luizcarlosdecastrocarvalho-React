import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import UserTable from '../components/UserTable';

export default function ListaUsuarios() {
  const [usuariosReais, setUsuariosReais] = useState([]);
  const [reservasReais, setReservasReais] = useState([]);
  const [servicosReais, setServicosReais] = useState([]);
  const [categoriasQuarto, setCategoriasQuarto] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('usuarios');

  const [modalQuartoAberto, setModalQuartoAberto] = useState(false);
  const [modalServicoAberto, setModalServicoAberto] = useState(false);

  const [formQuarto, setFormQuarto] = useState({
    numero: '',
    precoDiaria: '',
    categoriaId: ''
  });

  const [formServico, setFormServico] = useState({
    nome: '',
    preco: ''
  });

  const BASE_URL = 'https://prg04luizcarlosdecastrocarvalho-backend.onrender.com';

  const carregarDados = useCallback(() => {
    Promise.all([
      fetch(`${BASE_URL}/usuarios/findall`),
      fetch(`${BASE_URL}/reservas/findall`),
      fetch(`${BASE_URL}/servicos-adicionais/findall`),
      fetch(`${BASE_URL}/categorias/findall`).catch(() => null) // Fallback caso rota não exista
    ])
      .then(async ([resUsuarios, resReservas, resServicos, resCategorias]) => {
        if (!resUsuarios.ok || !resReservas.ok) {
          throw new Error('Falha ao buscar dados do servidor.');
        }

        const dataUsuarios = await resUsuarios.json();
        const dataReservas = await resReservas.json();
        const dataServicos = resServicos.ok ? await resServicos.json() : [];
        const dataCategorias = (resCategorias && resCategorias.ok) ? await resCategorias.json() : [];

        const listaDeUsuarios = dataUsuarios.content || dataUsuarios || [];
        const dadosFormatados = listaDeUsuarios.map((user) => ({
          id: user.id,
          nome: user.nome,
          email: user.email,
          login: user.login,
          tipoUsuario: user.tipoUsuario,
          status: user.tipoUsuario === 'ADMIN' ? 'Admin' : 'Ativo',
          badge: user.tipoUsuario === 'ADMIN' ? 'bg-primary' : 'bg-success'
        }));

        setUsuariosReais(dadosFormatados);
        setReservasReais(dataReservas.content || dataReservas || []);
        setServicosReais(dataServicos);
        setCategoriasQuarto(dataCategorias);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados:', error);
        setErro(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleSalvarQuarto = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        numero: formQuarto.numero,
        precoDiaria: parseFloat(formQuarto.precoDiaria),
        categoria: { id: parseInt(formQuarto.categoriaId) }
      };

      const res = await fetch(`${BASE_URL}/quartos/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar quarto.');

      alert('Quarto cadastrado com sucesso!');
      setModalQuartoAberto(false);
      setFormQuarto({ numero: '', precoDiaria: '', categoriaId: '' });
      carregarDados();
    } catch (err) {
      alert('Erro ao cadastrar quarto. Verifique se o número é único.');
    }
  };

  const handleSalvarServico = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: formServico.nome,
        preco: parseFloat(formServico.preco)
      };

      const res = await fetch(`${BASE_URL}/servicos-adicionais/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar serviço.');

      alert('Serviço adicional criado!');
      setModalServicoAberto(false);
      setFormServico({ nome: '', preco: '' });
      carregarDados();
    } catch (err) {
      alert('Erro ao criar serviço adicional.');
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0 p-3" style={{ borderLeft: '5px solid var(--cor-primaria)' }}>
            <small className="text-muted text-uppercase fw-bold">Total de Usuários</small>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: 'var(--cor-primaria)' }}>{usuariosReais.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0 p-3" style={{ borderLeft: '5px solid #198754' }}>
            <small className="text-muted text-uppercase fw-bold">Total de Reservas</small>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: '#198754' }}>{reservasReais.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow border-0 p-3" style={{ borderLeft: '5px solid #ffc107' }}>
            <small className="text-muted text-uppercase fw-bold">Serviços Adicionais</small>
            <h3 className="fw-bold mb-0 mt-1" style={{ color: '#ffc107' }}>{servicosReais.length}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 className="h3 mb-0">Painel Administrativo</h1>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={() => setModalQuartoAberto(true)}>
              ➕ Novo Quarto
            </button>
            <button className="btn btn-outline-warning text-dark" onClick={() => setModalServicoAberto(true)}>
              ✨ Novo Serviço
            </button>
            <Link to="/cadastro" className="btn btn-success" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}>
              👤 Novo Usuário
            </Link>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link fw-bold ${abaAtiva === 'usuarios' ? 'active text-primary' : 'text-muted'}`}
              onClick={() => setAbaAtiva('usuarios')}
            >
              👥 Usuários ({usuariosReais.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-bold ${abaAtiva === 'reservas' ? 'active text-primary' : 'text-muted'}`}
              onClick={() => setAbaAtiva('reservas')}
            >
              📅 Reservas ({reservasReais.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-bold ${abaAtiva === 'servicos' ? 'active text-primary' : 'text-muted'}`}
              onClick={() => setAbaAtiva('servicos')}
            >
              🛎️ Serviços ({servicosReais.length})
            </button>
          </li>
        </ul>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Carregando dados...</p>
          </div>
        )}

        {erro && <div className="alert alert-danger text-center">{erro}</div>}

        {!loading && !erro && (
          <>
            {abaAtiva === 'usuarios' && <UserTable dadosUsuarios={usuariosReais} recarregarDados={carregarDados} />}

            {abaAtiva === 'reservas' && (
              <div className="table-responsive">
                <table className="table user-table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Hóspede</th>
                      <th>Quarto</th>
                      <th>Período</th>
                      <th>Valor Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasReais.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">Nenhuma reserva encontrada.</td></tr>
                    ) : (
                      reservasReais.map((reserva) => (
                        <tr key={reserva.id}>
                          <td>{reserva.id}</td>
                          <td><div className="fw-bold">{reserva.cliente?.nome || 'Desconhecido'}</div></td>
                          <td>Nº {reserva.quarto?.numero || 'N/A'}</td>
                          <td>
                            {reserva.dataCheckIn} <br/>
                            <small className="text-muted">até {reserva.dataCheckOut}</small>
                          </td>
                          <td className="fw-bold" style={{ color: 'var(--cor-primaria)' }}>
                            R$ {reserva.pagamento?.valor?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {abaAtiva === 'servicos' && (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome do Serviço</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicosReais.map((servico) => (
                      <tr key={servico.id}>
                        <td>{servico.id}</td>
                        <td className="fw-bold">{servico.nome}</td>
                        <td>R$ {servico.preco?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {modalQuartoAberto && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastrar Novo Quarto</h5>
                <button type="button" className="btn-close" onClick={() => setModalQuartoAberto(false)}></button>
              </div>
              <form onSubmit={handleSalvarQuarto}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Número do Quarto</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: 101"
                      value={formQuarto.numero}
                      onChange={(e) => setFormQuarto({ ...formQuarto, numero: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Preço da Diária (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="150.00"
                      value={formQuarto.precoDiaria}
                      onChange={(e) => setFormQuarto({ ...formQuarto, precoDiaria: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Categoria</label>
                    <select
                      className="form-select"
                      value={formQuarto.categoriaId}
                      onChange={(e) => setFormQuarto({ ...formQuarto, categoriaId: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma categoria...</option>
                      {categoriasQuarto.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome || cat.tipo || `Categoria #${cat.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalQuartoAberto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salvar Quarto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalServicoAberto && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Serviço Adicional</h5>
                <button type="button" className="btn-close" onClick={() => setModalServicoAberto(false)}></button>
              </div>
              <form onSubmit={handleSalvarServico}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nome do Serviço</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Café da manhã no quarto"
                      value={formServico.nome}
                      onChange={(e) => setFormServico({ ...formServico, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="50.00"
                      value={formServico.preco}
                      onChange={(e) => setFormServico({ ...formServico, preco: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalServicoAberto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Salvar Serviço
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