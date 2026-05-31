import { Outlet } from 'react-router-dom';
import logoSvg from '../recursos/imagens/logo-nexus.svg';

export default function LayoutAuth() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoSvg} alt="NEXUS" className="h-10 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-on-surface">NEXUS</h1>
          <p className="text-on-surface-variant mt-1">Sign in to your library and store.</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-2xl p-8">
          <Outlet />
        </div>
        <div className="text-center text-on-surface-variant text-sm mt-6 space-x-2">
          <a href="#" className="hover:text-on-surface transition-colors">Termos de Uso</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-on-surface transition-colors">Política de Privacidade</a>
          <span>&bull;</span>
          <a href="#" className="hover:text-on-surface transition-colors">Suporte</a>
        </div>
        <p className="text-center text-on-surface-variant/60 text-xs mt-2">
          &copy; 2026 NEXUS DIGITAL STORE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
