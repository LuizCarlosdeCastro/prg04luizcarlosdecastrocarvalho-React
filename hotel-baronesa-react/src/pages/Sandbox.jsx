import { Link } from 'react-router-dom';

export default function Sandbox() {
  return (
    <div className="container my-5 text-center">
      <div className="card shadow p-4 border-0 bg-white mx-auto" style={{ maxWidth: '650px' }}>
        <h2 className="h3 mb-4">Área de Testes (Sandbox)</h2>
        
        <div className="mb-5">
          <p className="fw-bold">Testando áudio (Vivaldi):</p>
          <audio preload="metadata" controls autoPlay loop className="w-100">
            <source src="/assets/midia/vivaldi.mp3" type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </div>

        <div className="mb-4">
          <p className="fw-bold">Testando vídeos (YouTube):</p>
          <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
            <iframe 
              src="https://www.youtube.com/embed/r0CWl2EhR6Q?si=JPeky3nZe07kUZCn" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/" className="text-decoration-none small text-dark">← Voltar para a Home</Link>
        </div>
      </div>
    </div>
  );
}