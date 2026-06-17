import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../componentes/Logo.jsx';
import BotaoSair from '../componentes/BotaoSair.jsx';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/jogos', label: 'Jogos' },
  { to: '/admin/empresas', label: 'Empresas' },
  { to: '/admin/usuarios', label: 'Usuarios' },
];

export default function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col bg-surface-container-lowest border-r border-outline-variant">
        <div className="p-6 flex items-center gap-2">
          <Logo className="h-7" />
          <span className="text-lg font-bold text-on-surface">NEXUS</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface border-l-4 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-l-4 border-transparent'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <BotaoSair className="w-full" />
        </div>
      </aside>

      {/* Mobile hamburger — hidden when overlay is open */}
      {!menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="md:hidden fixed top-4 left-4 z-50 bg-surface-container border border-outline-variant rounded-lg p-2"
        >
          <Menu size={20} className="text-on-surface" />
        </button>
      )}

      {/* Mobile overlay */}
      {menuAberto && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuAberto(false)}
          />
          <aside className="relative w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-2">
                <Logo className="h-7" />
                <span className="text-lg font-bold text-on-surface">NEXUS</span>
              </div>
              <button onClick={() => setMenuAberto(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-surface-container-high text-on-surface border-l-4 border-primary'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-l-4 border-transparent'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-outline-variant">
              <BotaoSair className="w-full" />
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-surface p-6 pt-16 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
