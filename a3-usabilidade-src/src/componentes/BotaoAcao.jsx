import { Pencil, Trash2 } from 'lucide-react';

const VARIANTES = {
  editar: {
    cor: 'text-primary border-primary/30 bg-surface-container',
    Icone: Pencil,
  },
  excluir: {
    cor: 'text-error border-error/40 bg-surface-container',
    Icone: Trash2,
  },
};

export default function BotaoAcao({ label, onClick, variante = 'editar' }) {
  const config = VARIANTES[variante];
  const { Icone } = config;

  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-start text-xs font-medium cursor-pointer border rounded-lg px-2.5 py-1.5 w-[88px] h-[34px] overflow-hidden transition-all duration-300 active:translate-x-[2px] active:translate-y-[2px] ${config.cor}`}
    >
      <span className="transition-all duration-300 group-hover:opacity-0 whitespace-nowrap">
        {label}
      </span>
      <Icone
        size={14}
        className="absolute right-[10px] transition-all duration-300 group-hover:right-[calc(50%-7px)]"
      />
    </button>
  );
}
