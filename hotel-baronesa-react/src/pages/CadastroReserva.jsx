import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CadastroReserva() {
  const navigate = useNavigate();
  
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [quartos, setQuartos] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]); // 🆕 Guarda os serviços vindos do Back
  const [servicosSelecionados, setServicosSelecionados] = useState([]); // 🆕 Guarda os serviços marcados pelo usuário
  
  const [quartoId, setQuartoId] = useState('');
  const [dataCheckIn, setDataCheckIn] = useState('');
  const [dataCheckOut, setDataCheckOut] = useState('');
  const [valor, setValor] = useState('0.00');
  const [formaPagamento, setFormaPagamento] = useState('PIX');

  useEffect(() => {
    const tipoUsuario = localStorage.getItem('tipoUsuario'); 
    const idUsuario = localStorage.getItem('idUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    
    if (!tipoUsuario) {
      alert('Acesso negado! Você precisa estar logado para fazer uma reserva.');
      navigate('/login');
      return;
    }

    const usuarioTratado = {
      id: idUsuario ? Number(idUsuario) : 1,
      nome: nomeUsuario || `Usuário (${tipoUsuario})`,
      login: tipoUsuario
    };

    setUsuarioLogado(usuarioTratado);

    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/quartos/findall')
      .then(res => res.json())
      .then(data => { setQuartos(data.content || data || []) })
      .catch(err => console.error("Erro ao buscar quartos:", err));

    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/servicos-adicionais/findall')
      .then(res => res.json())
      .then(data => { setServicosDisponiveis(data.content || data || []) })
      .catch(err => console.error("Erro ao buscar serviços adicionais:", err));
  }, [navigate]);

  const handleCheckboxServico = (servico) => {
    const jaSelecionado = servicosSelecionados.some(s => s.id === servico.id);
    if (jaSelecionado) {
      setServicosSelecionados(servicosSelecionados.filter(s => s.id !== servico.id));
    } else {
      setServicosSelecionados([...servicosSelecionados, servico]);
    }
  };

  useEffect(() => {
    if (dataCheckIn && dataCheckOut && quartoId) {
      const quartoSelecionado = quartos.find(q => q.id === Number(quartoId));
      
      if (quartoSelecionado && quartoSelecionado.precoDiaria) {
        const checkIn = new Date(dataCheckIn);
        const checkOut = new Date(dataCheckOut);
        
        const diferencaTempo = checkOut.getTime() - checkIn.getTime();
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        
        if (diferencaDias > 0) {
          const valorQuarto = diferencaDias * quartoSelecionado.precoDiaria;
          
          const valorServicos = servicosSelecionados.reduce((total, s) => total + (s.preco || 0), 0);
          
          const totalFinal = valorQuarto + valorServicos;
          setValor(totalFinal.toFixed(2)); 
        } else {
          setValor('0.00'); 
        }
      }
    } else {
      setValor('0.00');
    }
  }, [dataCheckIn, dataCheckOut, quartoId, quartos, servicosSelecionados]);

  const handleSalvar = (e) => {
    e.preventDefault();

    const idDoLocalStorage = localStorage.getItem('idUsuario');
    const idFinalCliente = usuarioLogado?.id || (idDoLocalStorage ? Number(idDoLocalStorage) : null);

    if (!idFinalCliente) {
      alert("Erro local: Não foi possível detectar o ID do seu usuário logado. Por favor, faça login novamente.");
      navigate('/login');
      return;
    }

    
    const novaReserva = {
      dataCheckIn,
      dataCheckOut,
      status: "CONFIRMADA",
      cliente: { id: idFinalCliente }, 
      quarto: { id: Number(quartoId) },
      pagamento: {
        valor: Number(valor),
        formaPagamento
      },
      
      servicosAdicionais: servicosSelecionados.map(s => ({ id: s.id }))
    };

    console.log("JSON QUE SERÁ ENVIADO AO JAVA:", novaReserva); 

    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/reservas/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaReserva)
    })
    .then(res => {
      if (res.ok) {
        alert('Reserva e Pagamento cadastrados com sucesso!');
        navigate('/quartos');
      } else {
        alert('Erro ao salvar reserva no servidor.');
      }
    })
    .catch(err => console.error("Erro na requisição:", err));
  };

  if (!usuarioLogado) return null;

  return (
    <div className="container my-5">
      <div className="card shadow p-4 border-0">
        <h2 className="mb-4">Nova Reserva</h2>
        <form onSubmit={handleSalvar}>
          
          
          <div className="mb-3">
            <label className="form-label">Cliente Responsável</label>
            <input 
              type="text" 
              className="form-control bg-light fw-bold text-dark" 
              value={`${usuarioLogado.nome} (${usuarioLogado.login})`} 
              readOnly 
            />
            <small className="text-muted">A reserva será registrada diretamente no seu perfil.</small>
          </div>

          
          <div className="mb-3">
            <label className="form-label">Quarto</label>
            <select className="form-select" value={quartoId} onChange={e => setQuartoId(e.target.value)} required>
              <option value="">Selecione o quarto...</option>
            
              {quartos.map(q => (
                <option key={q.id} value={q.id}>
                  Nº {q.numero} - {q.categoria?.nome || 'Padrão'} (R$ {q.precoDiaria?.toFixed(2)}/dia)
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Data Check-In</label>
              <input type="date" className="form-control" value={dataCheckIn} onChange={e => setDataCheckIn(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Data Check-Out</label>
              <input type="date" className="form-control" value={dataCheckOut} onChange={e => setDataCheckOut(e.target.value)} required />
            </div>
          </div>

          
          {servicosDisponiveis.length > 0 && (
            <div className="mb-3 mt-2">
              <label className="form-label fw-bold text-secondary">Serviços Opcionais / Adicionais</label>
              <div className="p-3 border rounded bg-light">
                {servicosDisponiveis.map(s => {
                  const checkado = servicosSelecionados.some(item => item.id === s.id);
                  return (
                    <div className="form-check mb-2" key={s.id}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`servico-${s.id}`}
                        checked={checkado}
                        onChange={() => handleCheckboxServico(s)}
                      />
                      <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`servico-${s.id}`}>
                        <span>{s.nome}</span>
                        <span className="text-primary fw-bold">+ R$ {s.preco?.toFixed(2)}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <hr className="my-4" />
          <h4 className="text-muted">Informações do Pagamento</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Valor Total (R$)</label>
              <input type="text" className="form-control bg-light fw-bold text-dark" value={valor} readOnly placeholder="0.00" required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Forma de Pagamento</label>
              <select className="form-select" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartão de Crédito/Débito</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mt-3 w-100"
            style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
          >
            Confirmar Reserva e Registrar Pagamento
          </button>
        </form>
      </div>
    </div>
  );
}