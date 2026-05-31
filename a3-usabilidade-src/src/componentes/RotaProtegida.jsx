import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Carregando from './ui/Carregando.jsx';

export default function RotaProtegida({ apenasAdmin = false }) {
  const { estaAutenticado, ehAdmin, carregando } = useAuth();

  if (carregando) return <Carregando />;
  if (!estaAutenticado) return <Navigate to="/entrar" replace />;
  if (apenasAdmin && !ehAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
