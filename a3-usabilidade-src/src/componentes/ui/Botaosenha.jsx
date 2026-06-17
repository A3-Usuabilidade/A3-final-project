import { Eye, EyeOff } from 'lucide-react';

export default function BotaoSenha({ visivel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
    >
      {visivel ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );
}
