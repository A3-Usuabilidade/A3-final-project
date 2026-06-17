import { useNavigate } from 'react-router-dom';
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
      <svg
        className="w-4 h-4 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-error"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      Sair
    </button>
  );
}
