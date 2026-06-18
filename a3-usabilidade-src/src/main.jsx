import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import AdminLayout from './layouts/AdminLayout.jsx';
import LayoutAuth from './layouts/LayoutAuth.jsx';
import LayoutApp from './layouts/LayoutApp.jsx';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import RotaPublica from './componentes/RotaPublica.jsx';
import ThemeToggleGlobal from './componentes/ThemeToggleGlobal.jsx';
import Cadastro from './paginas/auth/Cadastro.jsx';
import Entrar from './paginas/auth/Entrar.jsx';
import RecuperarSenha from './paginas/auth/RecuperarSenha.jsx';
import RedefinirSenha from './paginas/auth/RedefinirSenha.jsx';
import Inicio from './paginas/Inicio.jsx';
import Loja from './paginas/Loja.jsx';
import Perfil from './paginas/Perfil.jsx';
import Wishlist from './paginas/Wishlist.jsx';
import Biblioteca from './paginas/Biblioteca.jsx';
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

          <Route element={<RotaPublica />}>
            <Route element={<LayoutAuth />}>
              <Route path="/entrar" element={<Entrar />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/recuperar-senha" element={<RecuperarSenha />} />
              <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            </Route>
          </Route>

          <Route element={<LayoutApp />}>
            <Route element={<RotaProtegida />}>
              <Route path="/loja" element={<Loja />} />
              <Route path="/checkout" element={<p className="p-8 text-white">Em breve - Checkout</p>} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/wishlist" element={<Wishlist />} />
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
