import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ListaUsuarios from './pages/ListaUsuarios.jsx';
import Cadastro from './pages/Cadastro';

import CadastroReserva from './pages/CadastroReserva';
import ListaQuartos from './pages/ListaQuartos';
import MinhasReservas from './pages/MinhasReservas'; 

import Atividade3 from './pages/Atividade3';
import Sandbox from './pages/Sandbox';
import Paleta from './pages/Paleta';

import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="usuarios" element={<ListaUsuarios />} />

          <Route path="quartos" element={<ListaQuartos />} />
          <Route path="reservas/nova" element={<CadastroReserva />} />
          
          
          <Route path="reservas/minhas" element={<MinhasReservas />} />
          
          <Route path="atividade-3" element={<Atividade3 />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="paleta" element={<Paleta />} />
          <Route path="cadastro" element={<Cadastro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}