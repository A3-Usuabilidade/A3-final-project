import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, Library, MessageSquare, Heart, User, LogOut, Menu, X } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import Logo from './Logo.jsx';

const linksPublicos = [
  { to: '/', label: 'Início' },
  { to: '/entrar', label: 'Login' },
  { to: '/cadastro', label: 'Cadastrar' },
];

const linksAutenticados = [
  { to: '/loja', label: 'Loja', icon: Store },
  { to: '/biblioteca', label: 'Biblioteca', icon: Library },
  { to: '/avaliacoes', label: 'Avaliações', icon: MessageSquare },
  { to: '/wishlist', label: 'Desejos', icon: Heart },
];

export default function Navbar() {
  const { usuario, estaAutenticado, ehAdmin, sair } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const handleSair = () => {
    sair();
    navigate('/entrar');
  };

  const links = estaAutenticado ? linksAutenticados : linksPublicos;

  const ehAtivo = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo + Nome */}
          <Link
            to={estaAutenticado ? '/loja' : '/'}
            className="flex items-center gap-2 shrink-0 group"
            aria-label="Ir para a página inicial"
          >
            <Logo className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-on-surface font-bold text-base tracking-tight hidden sm:inline">
              NEXUS
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {links.map((link) => {
              const ativo = ehAtivo(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    ativo
                      ? 'bg-surface-container-high text-on-surface'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  aria-current={ativo ? 'page' : undefined}
                >
                  {Icon && <Icon size={16} />}
                  {link.label}
                </Link>
              );
            })}

            {estaAutenticado && ehAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  ehAtivo('/admin')
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Ações do usuário (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {estaAutenticado ? (
              <>
                <Link
                  to="/perfil"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    ehAtivo('/perfil')
                      ? 'bg-surface-container-high text-on-surface'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  aria-label="Perfil"
                >
                  <User size={16} />
                  <span className="max-w-24 truncate">{usuario?.nome || 'Perfil'}</span>
                </Link>
                <button
                  onClick={handleSair}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all cursor-pointer"
                  aria-label="Sair"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            ) : null}
          </div>

          {/* Botão Mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <nav className="md:hidden border-t border-outline-variant bg-surface-container-low px-4 py-3 space-y-1" aria-label="Menu mobile">
          {links.map((link) => {
            const ativo = ehAtivo(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuAberto(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  ativo
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {Icon && <Icon size={16} />}
                {link.label}
              </Link>
            );
          })}

          {estaAutenticado && ehAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            >
              Admin
            </Link>
          )}

          {estaAutenticado && (
            <div className="pt-2 mt-2 border-t border-outline-variant space-y-1">
              <Link
                to="/perfil"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
              >
                <User size={16} />
                {usuario?.nome || 'Perfil'}
              </Link>
              <button
                onClick={() => { handleSair(); setMenuAberto(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-all cursor-pointer"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
