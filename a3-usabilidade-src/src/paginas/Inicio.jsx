import { Link } from 'react-router-dom';
import ThemeToggle from '../componentes/ThemeToggle.jsx';

export default function Inicio() {
  return (
    <>
      <nav className="flex gap-4 p-4 bg-surface min-h-screen">
        <Link to="/" className="text-on-surface">Home</Link>
        <Link to="/entrar" className="text-on-surface">Login</Link>
        <Link to="/cadastro" className="text-on-surface">Cadastrar</Link>
      </nav>
      <ThemeToggle />
    </>
  );
}
