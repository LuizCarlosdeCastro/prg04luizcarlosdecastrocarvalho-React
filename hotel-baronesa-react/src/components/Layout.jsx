import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        {/* O Outlet precisa estar aqui para renderizar as páginas */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}