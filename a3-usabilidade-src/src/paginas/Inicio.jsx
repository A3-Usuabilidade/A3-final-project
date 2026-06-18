import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../componentes/Logo.jsx';

/* ─── capas dos jogos (extras → src/recursos/imagens/jogos) ─── */
import imgWitcher  from '../recursos/imagens/jogos/the-witcher-3-cover.jpg';
import imgGta      from '../recursos/imagens/jogos/gta-v-cover.jpg';
import imgElden    from '../recursos/imagens/jogos/elden-ring.jpg';
import imgCyberpunk from '../recursos/imagens/jogos/cyberpunk-2077.jpg';
import imgHorizon  from '../recursos/imagens/jogos/horizon-zero-dawn.jpg';

/*
 * Fan de 5 cards:
 *  - central: maior, sem rotação, opacidade 1, z alto
 *  - laterais internos: médios, rotação ±4°
 *  - laterais externos: menores, rotação ±9°, opacidade baixa
 * Hover: scale-up via CSS class, sem framer-motion
 */
const CAPAS = [
  {
    nome: 'Cyberpunk 2077',
    src: imgCyberpunk,
    left: 'calc(50% - 380px)',
    w: 195,
    h: 275,
    rotate: '-10deg',
    scale: 0.8,
    opacity: 0.45,
    z: 1,
  },
  {
    nome: 'Horizon Zero Dawn',
    src: imgHorizon,
    left: 'calc(50% - 205px)',
    w: 240,
    h: 340,
    rotate: '-4deg',
    scale: 0.93,
    opacity: 0.75,
    z: 2,
  },
  {
    nome: 'The Witcher 3',
    src: imgWitcher,
    left: '50%',
    w: 295,
    h: 415,
    rotate: '0deg',
    scale: 1,
    opacity: 1,
    z: 5,
  },
  {
    nome: 'Grand Theft Auto V',
    src: imgGta,
    left: 'calc(50% + 165px)',
    w: 240,
    h: 340,
    rotate: '4deg',
    scale: 0.93,
    opacity: 0.75,
    z: 2,
  },
  {
    nome: 'Elden Ring',
    src: imgElden,
    left: 'calc(50% + 345px)',
    w: 195,
    h: 275,
    rotate: '10deg',
    scale: 0.8,
    opacity: 0.45,
    z: 1,
  },
];

export default function Inicio() {
  return (
    <>
      <style>{`
        /* entrada suave — sem framer-motion */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .anim-0 { animation: fadeUp .6s .00s ease both; }
        .anim-1 { animation: fadeUp .6s .10s ease both; }
        .anim-2 { animation: fadeUp .6s .22s ease both; }
        .anim-3 { animation: fadeUp .6s .36s ease both; }

        /* hover nos cards: leve escala + sobe opacidade */
        .capa-card {
          transition: transform .28s ease, opacity .28s ease, box-shadow .28s ease, z-index 0s .28s;
        }
        .capa-card:hover {
          transform: translateX(-50%) rotate(var(--r)) scale(calc(var(--s) + 0.06)) !important;
          opacity: 1 !important;
          box-shadow: 0 28px 56px -8px rgba(57,140,235,.42) !important;
          z-index: 20 !important;
          transition: transform .28s ease, opacity .28s ease, box-shadow .28s ease, z-index 0s 0s;
        }
      `}</style>

      <div
        className="relative min-h-screen flex flex-col overflow-hidden text-white"
        style={{ background: 'linear-gradient(160deg, #05070b 55%, #0d1f3c 100%)' }}
      >
        {/* glow azul superior */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[420px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(57,140,235,.22) 0%, transparent 68%)' }}
          aria-hidden="true"
        />

        {/* ───────────── HEADER ───────────── */}
        <header className="relative z-20 w-full">
          <div className="mx-auto flex max-w-7xl items-center px-8 py-6 sm:px-12">

            {/* NAV — esquerda, bold azul */}
            <nav className="flex items-center gap-7 mr-auto" aria-label="Navegação principal">
              <Link
                to="/loja"
                className="text-sm font-black uppercase tracking-wider text-[#398CEB] hover:text-[#AED4FF] transition-colors"
              >
                Jogos
              </Link>
              <Link
                to="/loja"
                className="text-sm font-black uppercase tracking-wider text-[#398CEB] hover:text-[#AED4FF] transition-colors"
              >
                Loja
              </Link>
            </nav>

            {/* LOGO — centralizada absoluta */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 select-none"
              aria-label="Nexus — página inicial"
            >
              <Logo className="h-12 w-9 text-white drop-shadow-[0_0_18px_rgba(57,140,235,.6)]" />
              <span
                className="text-3xl font-black tracking-[0.04em] text-white"
                style={{ textShadow: '0 0 28px rgba(57,140,235,.45)' }}
              >
                NEXUS
              </span>
            </Link>

            {/* AÇÕES — direita */}
            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/entrar"
                className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/6 px-5 text-sm font-bold text-white/85 backdrop-blur transition hover:border-[#398CEB]/50 hover:text-white"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="hidden sm:inline-flex h-10 items-center rounded-full bg-[#398CEB] px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(57,140,235,.35)] transition hover:bg-[#4a95ef] active:scale-95"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </header>

        {/* ───────────── HERO ───────────── */}
        <main className="relative z-10 flex flex-1 flex-col items-center pt-10 pb-8 px-5">

          {/* badge */}
          <span className="anim-0 inline-flex items-center rounded-full border border-[#398CEB]/25 bg-[#398CEB]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[.18em] text-[#AED4FF]">
            Plataforma de jogos digitais
          </span>

          {/* título */}
          <h1 className="anim-1 mt-5 max-w-3xl text-center text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem]">
            Sua loja e biblioteca
            <span className="block text-[#398CEB]" style={{ textShadow: '0 0 32px rgba(57,140,235,.4)' }}>
              em um só lugar.
            </span>
          </h1>

          {/* subtítulo */}
          <p className="anim-2 mt-4 max-w-lg text-center text-base leading-7 text-white/55 sm:text-lg">
            Explore jogos, gerencie sua coleção e descubra novos títulos com uma experiência limpa e consistente.
          </p>

          {/* CTAs */}
          <div className="anim-3 mt-7 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/cadastro"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#398CEB] px-7 text-sm font-bold text-white shadow-[0_12px_32px_rgba(57,140,235,.35)] transition hover:bg-[#4a95ef] active:scale-95"
            >
              Criar conta grátis
            </Link>
            <Link
              to="/loja"
              className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/6 px-7 text-sm font-bold text-white/80 backdrop-blur transition hover:border-[#398CEB]/45 hover:text-white"
            >
              Ver jogos
              <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </div>

          {/* ───────── FAN DE CAPAS ───────── */}
          <div
            className="anim-3 relative w-full mt-14 sm:mt-16 select-none"
            style={{ height: 460 }}
            aria-label="Capas de jogos em destaque"
          >
            {CAPAS.map((c) => (
              <div
                key={c.nome}
                className="capa-card absolute"
                style={{
                  left: c.left,
                  width: c.w,
                  height: c.h,
                  zIndex: c.z,
                  opacity: c.opacity,
                  borderRadius: 14,
                  overflow: 'hidden',
                  /* variáveis para o :hover no CSS */
                  '--r': c.rotate,
                  '--s': c.scale,
                  transform: `translateX(-50%) rotate(${c.rotate}) scale(${c.scale})`,
                  boxShadow: c.z >= 5
                    ? '0 24px 48px -6px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.06)'
                    : '0 10px 26px -5px rgba(0,0,0,.5)',
                  cursor: 'default',
                }}
                title={c.nome}
              >
                <img
                  src={c.src}
                  alt={`Capa: ${c.nome}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  draggable="false"
                />
                {/* borda interna sutil no card central */}
                {c.z >= 5 && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(174,212,255,.15)', borderRadius: 14 }}
                  />
                )}
              </div>
            ))}

            {/* sombra de chão */}
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-14"
              style={{
                background: 'radial-gradient(ellipse at 50% 100%, rgba(57,140,235,.18) 0%, transparent 70%)',
                filter: 'blur(10px)',
              }}
              aria-hidden="true"
            />
          </div>
        </main>

        {/* ───────────── FOOTER ───────────── */}
        <footer className="relative z-20 border-t border-white/8 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-8 py-5 text-sm text-white/40 sm:px-12 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-5 text-white/50" />
              <span className="font-bold text-white/55">NEXUS</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link to="/entrar" className="hover:text-white transition-colors">Entrar</Link>
              <Link to="/cadastro" className="hover:text-white transition-colors">Criar conta</Link>
              <Link to="/loja" className="hover:text-white transition-colors">Loja</Link>
            </div>
            <p className="text-xs font-medium uppercase tracking-[.12em] text-white/25">
              © 2026 Nexus Digital Store
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
