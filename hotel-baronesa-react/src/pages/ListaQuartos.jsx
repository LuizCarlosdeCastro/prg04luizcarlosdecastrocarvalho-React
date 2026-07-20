import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ListaQuartos() {
  const [quartos, setQuartos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://prg04luizcarlosdecastrocarvalho-backend.onrender.com/quartos/findall')
      .then(res => res.json())
      .then(data => {
        setQuartos(data.content || data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar quartos:", err);
        setLoading(false);
      });
  }, []);

    const obterImagemQuarto = (categoriaNome) => {
    const nome = categoriaNome?.toLowerCase() || '';
  
     if (nome.includes('assombrado')) {
      return '/assets/images/assombrado.png'; 
    }
    if (nome.includes('luxo') || nome.includes('suite')) {
      return '/assets/images/suite_luxo.png'; 
  }
 
  return '/assets/images/quarto_padrao.png'; 
};

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Nossos Quartos Disponíveis</h1>
        <Link to="/reservas/nova" className="btn btn-primary" 
        style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
        >Reservar um Quarto</Link>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}

      {!loading && quartos.length === 0 && (
        <div className="alert alert-warning text-center">
          Nenhum quarto cadastrado no banco de dados ainda. Insira registros na tabela 'quartos' para visualizar.
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {quartos.map(quarto => {
  // Acessa o nome de dentro do relacionamento da categoria
  const nomeCategoria = quarto.categoria?.nome || 'Padrão';
  const ehAssombrado = nomeCategoria.toLowerCase().includes('assombrado');

  return (
    <div className="col" key={quarto.id}>
      <div className={`card h-100 shadow-sm border-0 ${ehAssombrado ? 'border border-dark bg-dark text-white' : ''}`}
           style={ehAssombrado ? { boxShadow: '0 10px 20px rgba(88, 24, 122, 0.3)' } : {}}>
        
        <img 
          src={obterImagemQuarto(nomeCategoria)} 
          className="card-img-top" 
          alt="Foto do Quarto" 
          style={{ height: '220px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
        />
        
        <div className="card-body">
          <h5 className="card-title">Quarto Nº {quarto.numero}</h5>
          <p className={`card-text mb-2 ${ehAssombrado ? 'text-warning' : 'text-muted'}`}>
            Categoria: <strong>{nomeCategoria}</strong>
          </p>
          
          <h6 className={`fw-bold mb-3 ${ehAssombrado ? 'text-danger' : 'text-primary'}`}>
            R$ {quarto.precoDiaria?.toFixed(2)} / diária
          </h6>

          <span className={`badge rounded-pill ${ehAssombrado ? 'bg-danger text-dark fw-bold animate-pulse' : 'bg-success'}`}>
            {ehAssombrado ? '👻 Cuidado: Atividades Paranormais' : 'Disponível'}
          </span>
        </div>
      </div>
    </div>
  );
})}
      </div>
    </div>
  );
}