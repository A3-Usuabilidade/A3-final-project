import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../componentes/Logo.jsx';
import imgCyberpunk from '../recursos/imagens/jogos/cyberpunk-2077.jpg';
import imgMinecraft from '../recursos/imagens/jogos/minecraft.jpg';
import imgWitcher from '../recursos/imagens/jogos/the-witcher-3.jpg';
import imgGta from '../recursos/imagens/jogos/gta-v.jpg';
import imgElden from '../recursos/imagens/jogos/elden-ring.jpg';

/* ─── dados dos cards (fan de capas) ─── */
const CAPAS = [
  {
    nome: 'Cyberpunk 2077',
    src: imgCyberpunk,
    style: {
      left: 'calc(50% - 370px)',
      width: 200,
      height: 280,
      rotate: '-9deg',
      scale: 0.82,
      opacity: 0.5,
      zIndex: 1,
      animDelay: '0.1s',
      floatClass: 'card-float-a',
    },
  },
  {
    nome: 'Minecraft',
    src: imgMinecraft,
    style: {
      left: 'calc(50% - 205px)',
      width: 240,
      height: 330,
      rotate: '-4deg',
      scale: 0.92,
      opacity: 0.78,
      zIndex: 2,
      animDelay: '0.2s',
      floatClass: 'card-float-b',
    },
  },
  {
    nome: 'The Witcher 3',
    src: imgWitcher,
    style: {
      left: '50%',
      width: 300,
      height: 420,
      rotate: '0deg',
      scale: 1,
      opacity: 1,
      zIndex: 5,
      animDelay: '0s',
      floatClass: 'card-float-c',
    },
  },
  {
    nome: 'Grand Theft Auto V',
    src: imgGta,
    style: {
      left: 'calc(50% + 165px)',
      width: 240,
      height: 330,
      rotate: '4deg',
      scale: 0.92,
      opacity: 0.78,
      zIndex: 2,
      animDelay: '0.15s',
      floatClass: 'card-float-b',
    },
  },
  {
    nome: 'Elden Ring',
    src: imgElden,
    style: {
      left: 'calc(50% + 330px)',
      width: 200,
      height: 280,
      rotate: '9deg',
      scale: 0.82,
      opacity: 0.5,
      zIndex: 1,
      animDelay: '0.05s',
      floatClass: 'card-float-a',
    },
  },
];

export default function Inicio() {
  return (
    <>
      {/* animações CSS inline — sem framer-motion */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(0px); }
          50%       { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(-8px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(0px); }
          50%       { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(-12px); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(0px); }
          50%       { transform: translateX(-50%) rotate(var(--r)) scale(var(--s)) translateY(-16px); }
        }
        .card-float-a { animation: floatA 5.2s ease-in-out infinite; }
        .card-float-b { animation: floatB 4.6s ease-in-out infinite; }
        .card-float-c { animation: floatC 4.0s ease-in-out infinite; }
        .hero-fade    { animation: fadeSlideUp 0.7s ease both; }
        .hero-fade-1  { animation: fadeSlideUp 0.7s 0.10s ease both; }
        .hero-fade-2  { animation: fadeSlideUp 0.7s 0.22s ease both; }
        .hero-fade-3  { animation: fadeSlideUp 0.7s 0.38s ease both; }
        .card-hover:hover {
          opacity: 1 !important;
          z-index: 10 !important;
          box-shadow: 0 28px 56px -10px rgba(57,140,235,0.45) !important;
          transition: opacity 0.25s, box-shadow 0.25s;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden flex flex-col"
           style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #edf4fc 100%)' }}>

        {/* fundo escuro */}
        <div className="dark:block hidden absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(180deg, #05070b 0%, #080c14 100%)' }} />

        {/* glow azul central */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(57,140,235,0.18) 0%, transparent 70%)' }}
             aria-hidden="true" />

        {/* ── HEADER ── */}
        <header className="relative z-20 w-full">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
            <Link to="/" className="flex items-center gap-2.5 select-none">
              <Logo className="h-9 w-7 text-slate-900 dark:text-white" />
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                NEXUS
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-white/55">
              <Link to="/loja" className="hover:text-[#398CEB] transition-colors">Loja</Link>
              <Link to="/loja" className="hover:text-[#398CEB] transition-colors">Jogos</Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                to="/entrar"
                className="inline-flex h-10 items-center rounded-full border border-slate-300/80 bg-white/80 px-5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:border-[#398CEB]/40 hover:text-[#2f7fd9] dark:border-white/10 dark:bg-white/6 dark:text-white dark:hover:border-[#398CEB]/45 dark:hover:text-[#AED4FF]"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="hidden sm:inline-flex h-10 items-center rounded-full bg-[#398CEB] px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(57,140,235,0.3)] transition hover:bg-[#4a95ef] active:scale-95"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <main className="relative z-10 flex flex-col items-center flex-1 px-5 pb-10 pt-10 sm:pt-14">
          {/* badge */}
          <span
            className="hero-fade inline-flex items-center rounded-full border border-[#398CEB]/20 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7fd9] shadow-sm backdrop-blur dark:border-[#AED4FF]/20 dark:bg-white/6 dark:text-[#AED4FF]"
          >
            Plataforma de jogos digitais
          </span>

          {/* título */}
          <h1
            className="hero-fade-1 mt-5 max-w-3xl text-center text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Sua loja e biblioteca
            <span className="block text-[#398CEB]">em um só lugar.</span>
          </h1>

          {/* subtítulo */}
          <p className="hero-fade-2 mt-4 max-w-xl text-center text-base leading-7 text-slate-500 dark:text-white/60 sm:text-lg">
            Explore jogos, gerencie sua coleção e descubra novos títulos com uma experiência limpa e consistente.
          </p>

          {/* CTAs */}
          <div className="hero-fade-3 mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/cadastro"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#398CEB] px-7 text-sm font-bold text-white shadow-[0_12px_32px_rgba(57,140,235,0.32)] transition hover:bg-[#4a95ef] active:scale-95"
            >
              Criar conta grátis
            </Link>
            <Link
              to="/loja"
              className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-7 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:border-[#398CEB]/35 hover:text-[#2f7fd9] dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:border-[#398CEB]/40 dark:hover:text-[#AED4FF]"
            >
              Ver jogos
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>

          {/* ── FAN DE CAPAS ── */}
          <div
            className="hero-fade-3 relative w-full mt-12 sm:mt-16"
            style={{ height: 460 }}
            aria-hidden="true"
          >
            {CAPAS.map((capa) => {
              const s = capa.style;
              return (
                <div
                  key={capa.nome}
                  className={`absolute card-hover ${s.floatClass}`}
                  style={{
                    left: s.left,
                    width: s.width,
                    height: s.height,
                    zIndex: s.zIndex,
                    opacity: s.opacity,
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: s.zIndex >= 5
                      ? '0 24px 48px -8px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)'
                      : '0 10px 28px -6px rgba(0,0,0,0.4)',
                    /* variáveis CSS para a keyframe usar */
                    '--r': s.rotate,
                    '--s': s.scale,
                    transform: `translateX(-50%) rotate(${s.rotate}) scale(${s.scale})`,
                    animationDelay: s.animDelay,
                    cursor: 'default',
                    transition: 'opacity 0.25s, box-shadow 0.25s',
                  }}
                  title={capa.nome}
                >
                  <img
                    src={capa.src}
                    alt={capa.nome}
                    className="w-full h-full object-cover"
                    loading="eager"
                    draggable="false"
                  />
                  {/* brilho de borda no card central */}
                  {s.zIndex >= 5 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: 'inset 0 0 0 1px rgba(174,212,255,0.18)',
                        borderRadius: 16,
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* sombra de chão */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-[60px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 100%, rgba(57,140,235,0.14) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="relative z-20 border-t border-slate-200/70 bg-white/50 backdrop-blur-sm dark:border-white/8 dark:bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-sm text-slate-500 dark:text-white/45 sm:px-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-5 text-slate-800 dark:text-white/60" />
              <span className="font-bold text-slate-800 dark:text-white/70">NEXUS</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <Link to="/entrar" className="hover:text-slate-800 dark:hover:text-white transition-colors">Entrar</Link>
              <Link to="/cadastro" className="hover:text-slate-800 dark:hover:text-white transition-colors">Criar conta</Link>
              <Link to="/loja" className="hover:text-slate-800 dark:hover:text-white transition-colors">Loja</Link>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-white/30">
              © 2026 Nexus Digital Store
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
