import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import AdminLayout from './layouts/AdminLayout.jsx';
import LayoutAuth from './layouts/LayoutAuth.jsx';
import LayoutApp from './layouts/LayoutApp.jsx';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import ThemeToggleGlobal from './componentes/ThemeToggleGlobal.jsx';
import Cadastro from './paginas/auth/Cadastro.jsx';
import Entrar from './paginas/auth/Entrar.jsx';
import Inicio from './paginas/Inicio.jsx';
import Loja from './paginas/Loja.jsx';
import Perfil from './paginas/Perfil.jsx';
import Dashboard from './paginas/admin/Dashboard.jsx';
import GerenciarJogos from './paginas/admin/GerenciarJogos.jsx';
import GerenciarEmpresas from './paginas/admin/GerenciarEmpresas.jsx';

if (typeof window !== 'undefined') {
  const temaSalvo = window.localStorage.getItem('theme');
  document.documentElement.classList.toggle('dark', temaSalvo === 'dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Inicio />} />

          <Route element={<LayoutAuth />}>
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/cadastro" element={<Cadastro />} />
          </Route>

          <Route element={<LayoutApp />}>
            <Route element={<RotaProtegida />}>
              <Route path="/loja" element={<Loja />} />
              <Route path="/checkout" element={<p className="p-8 text-white">Em breve - Checkout</p>} />
              <Route path="/biblioteca" element={<p className="p-8 text-white">Em breve - Biblioteca</p>} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route element={<RotaProtegida apenasAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="jogos" element={<GerenciarJogos />} />
                <Route path="empresas" element={<GerenciarEmpresas />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ThemeToggleGlobal />
      </>
    </BrowserRouter>
  </StrictMode>,
);
