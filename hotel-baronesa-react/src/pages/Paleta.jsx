import { Link } from 'react-router-dom';

export default function Paleta() {
  return (
    <div className="container my-5 text-center">
      <div className="card shadow p-4 border-0 bg-white mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="h2 mb-3">Cor principal do projeto</h1>
        <h2 className="h4 text-muted mb-4">Cor secundária</h2>
        <p className="lead">Cor complementar</p>
        
        <p className="text-muted">
          A ideia é ser um projeto de hotel, estou baseando as cores no personagem 
          <strong> 'o porteiro'</strong> do jogo deadlock, com uma paleta.
        </p>
        
        <div className="d-flex flex-column align-items-center gap-4 mt-4">
          <img 
            src="/assets/images/paleta.png" 
            alt="paleta do projeto" 
            className="img-fluid rounded shadow-sm" 
            style={{ border: '4px solid #000000', maxWidth: '300px' }} 
          />
          <img 
            src="/assets/images/doorman.jpeg" 
            alt="personagem doorman" 
            className="img-fluid rounded shadow" 
            style={{ maxWidth: '100%' }}
          />
        </div>

        <div className="mt-4">
          <Link to="/" className="text-decoration-none small text-dark">← Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
}