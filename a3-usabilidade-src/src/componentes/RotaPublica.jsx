import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Carregando from './ui/Carregando.jsx';

export default function RotaPublica() {
  const { estaAutenticado, carregando } = useAuth();

  if (carregando) return <Carregando />;
  if (estaAutenticado) return <Navigate to="/loja" replace />;

  return <Outlet />;
}
