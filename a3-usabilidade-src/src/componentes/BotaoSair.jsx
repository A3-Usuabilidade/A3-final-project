import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

export default function BotaoSair({ className = '' }) {
  const { sair } = useAuth();
  const navigate = useNavigate();

  const handleSair = () => {
    sair();
    navigate('/');
  };

  return (
    <button
      onClick={handleSair}
      title="Fazer logout"
      className={`group text-sm text-on-surface-variant hover:text-on-surface transition-all duration-300 px-4 py-2 rounded-lg hover:bg-surface-container-high/50 hover:backdrop-blur-sm flex items-center gap-2.5 cursor-pointer ${className}`}
    >
      <LogOut size={16} className="shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-error" />
      Sair
    </button>
  );
}
