import { Link } from 'react-router-dom';

export default function Atividade3() {
  return (
    <div className="container my-5 text-center">
      <div className="card shadow p-4 border-0 bg-white mx-auto" style={{ maxWidth: '500px' }}>
        <h1 className="h2 mb-2">Atividade 3</h1>
        <hr />
        
        <h2 className="h4 my-4">Top Comidas</h2>
        <div className="text-start mx-auto mb-4" style={{ maxWidth: '200px' }}>
          <ol className="list-group list-group-numbered">
            <li className="list-group-item border-0 bg-transparent">Lasanha</li>
            <li className="list-group-item border-0 bg-transparent">Chocolate</li>
            <li className="list-group-item border-0 bg-transparent">Pizza</li>
          </ol>
        </div>

        <img 
          src="/assets/images/gatoengraçado.jpeg" 
          alt="Gato engraçado e duas pelúcias" 
          className="img-fluid rounded shadow mb-4 mx-auto d-block"
        />

        <div className="mt-3">
          <Link to="/" className="text-decoration-none small text-dark">← Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
}