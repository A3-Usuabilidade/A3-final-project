import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function IconeCarrinho({ tom = 'escuro' }) {
  const classeCor = tom === 'claro' ? 'text-white' : 'text-black';
  return (
    <svg viewBox="0 0 26 26" className={`h-5 w-5 shrink-0 ${classeCor}`} fill="currentColor" aria-hidden="true">
      <path d="M18.908 14.3C19.8826 14.3 20.7403 13.767 21.1821 12.961L25.8344 4.524C26.3152 3.666 25.6915 2.6 24.7038 2.6H5.47097L4.24942 0H0V2.6H2.59903L7.2773 12.467L5.52295 15.639C4.5743 17.381 5.82184 19.5 7.7971 19.5H23.3913V16.9H7.7971L9.22657 14.3H18.908ZM6.70551 5.2H22.4946L18.908 11.7H9.78537L6.70551 5.2ZM7.7971 20.8C6.36764 20.8 5.21106 21.97 5.21106 23.4C5.21106 24.83 6.36764 26 7.7971 26C9.22657 26 10.3961 24.83 10.3961 23.4C10.3961 21.97 9.22657 20.8 7.7971 20.8ZM20.7923 20.8C19.3628 20.8 18.2062 21.97 18.2062 23.4C18.2062 24.83 19.3628 26 20.7923 26C22.2217 26 23.3913 24.83 23.3913 23.4C23.3913 21.97 22.2217 20.8 20.7923 20.8Z" />
    </svg>
  );
}

function IconeUsuario({ tom = 'escuro' }) {
  const classeCor = tom === 'claro' ? 'text-white' : 'text-black';
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${classeCor}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.8-3.4 5-5 8-5s6.2 1.6 8 5" />
    </svg>
  );
}

function IconeMenu() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function NavbarLoja({ busca, setBusca, quantidadeCarrinho, menuMobileAberto, setMenuMobileAberto, estaTemaEscuro }) {
  const barraClasse = estaTemaEscuro
    ? 'bg-white text-black ring-black/10 shadow-[0_8px_24px_rgba(57,140,235,0.22)]'
    : 'bg-black/92 text-white ring-[#aed4ff]/20 shadow-[0_8px_24px_rgba(57,140,235,0.16)]';
  const barraBuscaClasse = estaTemaEscuro
    ? 'bg-white text-black ring-black/10 shadow-[0_14px_34px_rgba(57,140,235,0.20)]'
    : 'bg-black/86 text-white ring-[#398ceb]/25 shadow-[0_14px_34px_rgba(57,140,235,0.18)]';
  const textoPlaceholderClasse = estaTemaEscuro ? 'placeholder:text-black/70' : 'placeholder:text-white/60';
  const hoverItemClasse = estaTemaEscuro ? 'hover:bg-[#aed4ff]' : 'hover:bg-[#398ceb]/18';
  const painelMenuClasse = estaTemaEscuro
    ? 'border-black/10 bg-white text-black shadow-[0_24px_56px_rgba(57,140,235,0.18)]'
    : 'border-[#aed4ff]/18 bg-black/94 text-white shadow-[0_24px_56px_rgba(57,140,235,0.18)]';
  const itemMenuClasse = estaTemaEscuro
    ? 'text-black hover:bg-[#aed4ff]/60 focus-visible:outline-[#398ceb]'
    : 'text-white hover:bg-[#398ceb]/14 focus-visible:outline-[#398ceb]';
  const tomIcone = estaTemaEscuro ? 'escuro' : 'claro';
  const logoClasse = estaTemaEscuro ? 'text-white' : 'text-black';
  const tituloClasse = estaTemaEscuro ? 'text-white' : 'text-black';

  return (
    <header className="mx-auto w-full max-w-7xl pt-6 sm:pt-8">
      <div className="flex items-center gap-2 sm:hidden">
        <Link
          to="/loja"
          aria-label="Ir para a loja Nexus"
          className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-full pl-4 pr-4 outline-none ring-1 transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#398ceb] ${barraClasse}`}
        >
          <span className="grid h-6 w-[17px] place-items-center">
            <Logo className={`h-6 w-[17px] ${estaTemaEscuro ? 'text-black' : 'text-white'}`} />
          </span>
          <span className="text-[1rem] font-black tracking-[0.02em]">NEXUS</span>
        </Link>

        <label className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full px-4 ring-1 focus-within:ring-2 focus-within:ring-[#398ceb] ${barraClasse}`}>
          <span className="sr-only">Buscar jogos</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar..."
            className={`min-w-0 flex-1 bg-transparent text-sm font-semibold focus:outline-none ${textoPlaceholderClasse}`}
          />
        </label>

        <button
          type="button"
          onClick={() => setMenuMobileAberto((estadoAtual) => !estadoAtual)}
          aria-label="Abrir menu"
          aria-expanded={menuMobileAberto}
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${barraClasse}`}
        >
          <IconeMenu />
          {quantidadeCarrinho > 0 && (
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#398ceb] px-1 text-[10px] font-bold text-black">
              {quantidadeCarrinho}
            </span>
          )}
        </button>
      </div>

      {menuMobileAberto && (
        <div className="mt-3 sm:hidden">
          <div className={`rounded-[1.5rem] border p-2 backdrop-blur-md ${painelMenuClasse}`}>
            <Link
              to="/checkout"
              onClick={() => setMenuMobileAberto(false)}
              className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${itemMenuClasse}`}
            >
              <span>Carrinho</span>
              <span className="flex items-center gap-2">
                {quantidadeCarrinho > 0 && (
                  <span className="rounded-full bg-[#398ceb] px-2 py-0.5 text-[11px] font-bold text-black">
                    {quantidadeCarrinho}
                  </span>
                )}
                <IconeCarrinho tom={tomIcone} />
              </span>
            </Link>
            <Link
              to="/biblioteca"
              onClick={() => setMenuMobileAberto(false)}
              className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${itemMenuClasse}`}
            >
              <span>Biblioteca</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </Link>
            <Link
              to="/pedidos"
              onClick={() => setMenuMobileAberto(false)}
              className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${itemMenuClasse}`}
            >
              <span>Meus Pedidos</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h8" /></svg>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMenuMobileAberto(false)}
              className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${itemMenuClasse}`}
            >
              <span>Lista de Desejos</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </Link>
            <Link
              to="/perfil"
              onClick={() => setMenuMobileAberto(false)}
              className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${itemMenuClasse}`}
            >
              <span>Perfil</span>
              <IconeUsuario tom={tomIcone} />
            </Link>
          </div>
        </div>
      )}

      <div className="hidden sm:block">
        <div className="flex items-start justify-between gap-6">
          <Link
            to="/loja"
            aria-label="Ir para a loja Nexus"
            className="inline-flex items-center gap-2.5 rounded-full px-1 py-1 outline-none transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#398ceb]"
          >
            <span className="grid h-8 w-[22px] place-items-center">
              <Logo className={`h-8 w-[22px] ${logoClasse}`} />
            </span>
            <span className={`text-[1.45rem] font-black tracking-[0.01em] ${logoClasse}`}>NEXUS</span>
          </Link>

          <div className={`flex h-12 items-center rounded-full px-3 ring-1 ${barraClasse}`}>
            <Link
              to="/checkout"
              aria-label={`Abrir carrinho com ${quantidadeCarrinho} item(ns)`}
              title="Abrir carrinho"
              className={`relative grid h-9 w-9 place-items-center rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${hoverItemClasse}`}
            >
              <IconeCarrinho tom={tomIcone} />
              {quantidadeCarrinho > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#398ceb] px-1 text-[10px] font-bold text-black">
                  {quantidadeCarrinho}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              aria-label="Lista de desejos"
              title="Lista de Desejos"
              className={`grid h-9 w-9 place-items-center rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${hoverItemClasse}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </Link>
            <Link
              to="/biblioteca"
              aria-label="Biblioteca"
              title="Biblioteca"
              className={`grid h-9 w-9 place-items-center rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${hoverItemClasse}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </Link>
            <Link
              to="/pedidos"
              aria-label="Meus pedidos"
              title="Meus Pedidos"
              className={`grid h-9 w-9 place-items-center rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${hoverItemClasse}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h8" /></svg>
            </Link>
            <Link
              to="/perfil"
              aria-label="Abrir perfil"
              title="Perfil"
              className={`ml-3 grid h-9 w-9 place-items-center rounded-full transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${hoverItemClasse}`}
            >
              <IconeUsuario tom={tomIcone} />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[58rem] flex-col items-center">
          <h1 className={`text-center text-5xl font-black tracking-[-0.02em] ${tituloClasse}`}>Catálogo</h1>
          <label className={`mt-9 flex h-16 w-full items-center gap-3 rounded-full px-7 ring-1 focus-within:ring-2 focus-within:ring-[#398ceb] ${barraBuscaClasse}`}>
            <span className="sr-only">Buscar jogos</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar jogos..."
              className={`min-w-0 flex-1 bg-transparent text-lg font-semibold focus:outline-none ${textoPlaceholderClasse}`}
            />
          </label>
        </div>
      </div>
    </header>
  );
}
