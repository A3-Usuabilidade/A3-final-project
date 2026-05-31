import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Inicio from './paginas/Inicio.jsx'
import LayoutAuth from './layouts/LayoutAuth.jsx'
import Entrar from './paginas/auth/Entrar.jsx'
import Cadastro from './paginas/auth/Cadastro.jsx'
import RotaProtegida from './componentes/RotaProtegida.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route element={<LayoutAuth />}>
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
        <Route element={<RotaProtegida />}>
          <Route path="/loja" element={<p className="text-white p-8">Em breve — Loja</p>} />
          <Route path="/checkout" element={<p className="text-white p-8">Em breve — Checkout</p>} />
          <Route path="/biblioteca" element={<p className="text-white p-8">Em breve — Biblioteca</p>} />
          <Route path="/perfil" element={<p className="text-white p-8">Em breve — Perfil</p>} />
        </Route>
        <Route element={<RotaProtegida apenasAdmin />}>
          <Route path="/admin" element={<p className="text-white p-8">Em breve — Admin</p>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
