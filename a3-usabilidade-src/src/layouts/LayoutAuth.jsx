import { Outlet } from 'react-router-dom';
import ThemeToggle from '../componentes/ThemeToggle.jsx';

export default function LayoutAuth() {
  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 90% 90%, oklch(0.65 0.12 245) 0%, var(--background) 50%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.06,
        }}
      />

      <div className="w-full relative z-10 flex flex-col items-center">
        <Outlet />
      </div>

      <ThemeToggle />

      <div className="relative z-10 text-center text-on-surface-variant text-sm mt-8 space-x-2">
        <a href="#" className="hover:text-on-surface transition-colors">Termos de Uso</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-on-surface transition-colors">Política de Privacidade</a>
        <span>&bull;</span>
        <a href="#" className="hover:text-on-surface transition-colors">Suporte</a>
      </div>
      <p className="relative z-10 text-center text-on-surface-variant/60 text-xs mt-2 mb-4">
        &copy; 2026 NEXUS DIGITAL STORE. TODOS OS DIREITOS RESERVADOS.
      </p>
    </div>
  );
}
