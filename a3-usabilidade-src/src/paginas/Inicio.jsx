import { Link } from 'react-router-dom';
import Logo from '../componentes/Logo.jsx';
import cyberpunk from '../recursos/imagens/jogos/cyberpunk-2077.jpg';
import minecraft from '../recursos/imagens/jogos/minecraft.jpg';
import witcher from '../recursos/imagens/jogos/the-witcher-3.jpg';
import gta from '../recursos/imagens/jogos/gta-v.jpg';
import elden from '../recursos/imagens/jogos/elden-ring.jpg';

const CARDS = [
  { nome: 'Cyberpunk 2077', src: cyberpunk, x: -360, w: 220, h: 300, rotate: '-8deg', scale: 0.85, opacity: '0.55', z: 10 },
  { nome: 'Minecraft', src: minecraft, x: -190, w: 260, h: 360, rotate: '-4deg', scale: 0.95, opacity: '0.85', z: 20 },
  { nome: 'The Witcher 3', src: witcher, x: 0, w: 320, h: 460, rotate: '0deg', scale: 1, opacity: '1', z: 40 },
  { nome: 'Grand Theft Auto V', src: gta, x: 190, w: 260, h: 360, rotate: '4deg', scale: 0.95, opacity: '0.85', z: 20 },
  { nome: 'Elden Ring', src: elden, x: 360, w: 220, h: 300, rotate: '8deg', scale: 0.85, opacity: '0.55', z: 10 },
];

export default function Inicio() {
  return (
    <div className="bg-surface min-h-screen flex flex-col relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <header className="w-full pt-10 px-12 absolute top-0 z-50 flex justify-between items-center">
        <nav className="flex gap-8 text-on-surface-variant font-medium text-lg">
          <Link to="/loja" className="hover:text-on-surface transition-colors">
            Games
          </Link>
          <Link to="/loja" className="hover:text-on-surface transition-colors">
            Store
          </Link>
        </nav>

        <div className="flex items-center justify-center gap-3 absolute left-1/2 -translate-x-1/2">
          <Logo className="h-8 w-[22px] text-on-surface" />
          <span className="text-4xl font-bold text-on-surface tracking-tight">Nexus</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/entrar"
            className="px-6 py-2.5 rounded-full border border-outline-variant text-on-surface font-medium hover:bg-surface-container-high transition-colors"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:opacity-90 transition shadow-lg shadow-primary/30"
          >
            Cadastrar
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-48 pb-20 relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center mb-24 px-4">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto text-on-surface tracking-tight">
            Sua biblioteca e loja de jogos
            <br />
            mais <span className="text-primary">autêntica</span>.
          </h1>
        </div>

        <div className="relative w-full h-[500px] flex justify-center items-center">
          {CARDS.map((card) => (
            <div
              key={card.nome}
              className="absolute rounded-2xl overflow-hidden ring-1 ring-outline-variant/20"
              style={{
                left: `calc(50% + ${card.x}px)`,
                width: card.w,
                height: card.h,
                transform: `translateX(-50%) rotate(${card.rotate}) scale(${card.scale})`,
                opacity: card.opacity,
                zIndex: card.z,
                boxShadow:
                  card.z >= 40
                    ? '0 25px 50px -12px rgba(0,0,0,0.7)'
                    : '0 12px 30px -8px rgba(0,0,0,0.4)',
              }}
              aria-label={`Capa do jogo ${card.nome}`}
            >
              <img
                src={card.src}
                alt={card.nome}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full py-8 text-center z-20">
        <div className="flex justify-center items-center gap-8 text-sm text-on-surface-variant">
          <span>Nexus © 2024</span>
          <span className="hover:text-on-surface transition-colors cursor-default">
            Termos de Uso
          </span>
          <span className="hover:text-on-surface transition-colors cursor-default">
            Privacidade
          </span>
        </div>
      </footer>
    </div>
  );
}
