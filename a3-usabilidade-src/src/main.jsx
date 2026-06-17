import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Inicio from './paginas/Inicio.jsx'
import LayoutAuth from './layouts/LayoutAuth.jsx'
import Entrar from './paginas/auth/Entrar.jsx'
import Cadastro from './paginas/auth/Cadastro.jsx'
import RotaProtegida from './componentes/RotaProtegida.jsx'
import Perfil from './paginas/Perfil.jsx'
import LayoutApp from './layouts/LayoutApp.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Dashboard from './paginas/admin/Dashboard.jsx'
import GerenciarJogos from './paginas/admin/GerenciarJogos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutApp />}>
          <Route path="/" element={<Inicio />} />
        <Route element={<LayoutAuth />}>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
        <Route element={<RotaProtegida />}>
          <Route path="/loja" element={<p className="text-white p-8">Em breve — Loja</p>} />
          <Route path="/checkout" element={<p className="text-white p-8">Em breve — Checkout</p>} />
          <Route path="/biblioteca" element={<p className="text-white p-8">Em breve — Biblioteca</p>} />
          <Route path="/perfil" element={<Perfil />} /> 
        </Route>
        <Route element={<RotaProtegida apenasAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,)