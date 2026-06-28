import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CadastroReserva() {
  const navigate = useNavigate();
  
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [quartos, setQuartos] = useState([]);
  
  const [quartoId, setQuartoId] = useState('');
  const [dataCheckIn, setDataCheckIn] = useState('');
  const [dataCheckOut, setDataCheckOut] = useState('');
  const [valor, setValor] = useState('0.00');
  const [formaPagamento, setFormaPagamento] = useState('PIX');

useEffect(() => {
    // 1. Coleta os dados salvos pelo Login no localStorage
    const tipoUsuario = localStorage.getItem('tipoUsuario'); 
    const idUsuario = localStorage.getItem('idUsuario');
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    
    // Agora valida apenas se a pessoa está autenticada (independente de ser ADMIN ou CLIENTE)
    if (!tipoUsuario) {
      alert('Acesso negado! Você precisa estar logado para fazer uma reserva.');
      navigate('/login');
      return;
    }

    // 2. Monta o usuário dinamicamente com base em quem está usando o sistema
    const usuarioTratado = {
      id: idUsuario ? Number(idUsuario) : 1, // Usa o ID guardado ou 1 por segurança
      nome: nomeUsuario || `Usuário (${tipoUsuario})`,
      login: tipoUsuario
    };

    setUsuarioLogado(usuarioTratado);

    // 3. Busca os quartos cadastrados no Backend
    fetch('http://localhost:8080/quartos/findall')
      .then(res => res.json())
      .then(data => { setQuartos(data.content || data || []) })
      .catch(err => console.error("Erro ao buscar quartos:", err));
  }, [navigate]);

  // Cálculo automático do valor total baseado na diária e nos dias selecionados
  useEffect(() => {
    if (dataCheckIn && dataCheckOut && quartoId) {
      const quartoSelecionado = quartos.find(q => q.id === Number(quartoId));
      
      if (quartoSelecionado && quartoSelecionado.precoDiaria) {
        const checkIn = new Date(dataCheckIn);
        const checkOut = new Date(dataCheckOut);
        
        const diferencaTempo = checkOut.getTime() - checkIn.getTime();
        const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
        
        if (diferencaDias > 0) {
          const total = diferencaDias * quartoSelecionado.precoDiaria;
          setValor(total.toFixed(2)); 
        } else {
          setValor('0.00'); 
        }
      }
    } else {
      setValor('0.00');
    }
  }, [dataCheckIn, dataCheckOut, quartoId, quartos]);

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
      }
    };

    console.log("JSON QUE SERÁ ENVIADO AO JAVA:", novaReserva); 

    fetch('http://localhost:8080/reservas/save', {
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
          
          {/* Slot de Cliente automatizado (Apenas Leitura) */}
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

          {/* Mapeamento de Quarto */}
          <div className="mb-3">
            <label className="form-label">Quarto</label>
            <select className="form-select" value={quartoId} onChange={e => setQuartoId(e.target.value)} required>
              <option value="">Selecione o quarto...</option>
              {quartos.map(q => <option key={q.id} value={q.id}>Nº {q.numero} - {q.tipo}</option>)}
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