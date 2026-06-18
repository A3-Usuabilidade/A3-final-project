import { Moon, SunMedium } from 'lucide-react';
import useTheme from '../hooks/useTheme.js';

function juntarClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ThemeToggle({
  dark: darkControlado,
  onToggle,
  variant = 'surface',
  position = 'floating',
  className = '',
}) {
  const { dark: darkHook, toggleTheme } = useTheme();

  const dark = typeof darkControlado === 'boolean' ? darkControlado : darkHook;
  const variantesVisuais = {
    surface: dark
      ? 'border-[#aed4ff]/40 bg-white text-black shadow-[0_12px_30px_rgba(57,140,235,0.16)]'
      : 'border-[#398ceb]/30 bg-black text-white shadow-[0_12px_30px_rgba(57,140,235,0.18)]',
    auth: dark
      ? 'border-[#aed4ff]/40 bg-white text-black shadow-[0_18px_38px_rgba(57,140,235,0.20)] backdrop-blur-md'
      : 'border-[#398ceb]/30 bg-black/92 text-white shadow-[0_18px_38px_rgba(57,140,235,0.18)] backdrop-blur-md',
  };
  const posicoes = {
    floating: 'fixed bottom-4 right-4',
    authTopRight: 'fixed top-4 right-4',
    static: 'relative',
  };

  const classeVisual = variantesVisuais[variant] || variantesVisuais.surface;
  const classePosicao = posicoes[position] || posicoes.floating;
  const iconeClasse = dark ? 'text-black' : 'text-white';

  function lidarComToggle() {
    if (typeof onToggle === 'function') {
      onToggle();
      return;
    }

    toggleTheme();
  }

  return (
    <button
      type="button"
      onClick={lidarComToggle}
      className={juntarClasses(
        classePosicao,
        classeVisual,
        'group z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border p-0 shadow-lg transition-all duration-500 ease-in-out hover:scale-[1.03] hover:brightness-95 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]',
        className,
      )}
      title={dark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      aria-label={dark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      <span
        className={juntarClasses(
          'grid h-6 w-6 place-items-center transition-transform duration-300 ease-out',
          dark ? 'rotate-0 scale-100' : 'rotate-12 scale-100',
        )}
      >
        {dark ? (
          <SunMedium
            className={iconeClasse}
            size={24}
            strokeWidth={2.1}
            aria-hidden="true"
          />
        ) : (
          <Moon
            className={iconeClasse}
            size={22}
            strokeWidth={2.1}
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
