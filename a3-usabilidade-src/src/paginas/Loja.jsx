import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../componentes/Logo.jsx';
import useTheme from '../hooks/useTheme.js';
import useWishlist from '../hooks/useWishlist.js';
import useAvaliacoes from '../hooks/useAvaliacoes.js';
import api from '../servicos/api.js';

const categoriaPadrao = ['Todos'];

const gridAnimacao = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
    },
  },
};

const cardAnimacao = {
  hidden: {
    opacity: 0,
    y: 26,
    scale: 0.96,
    filter: 'blur(6px)',
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
      mass: 0.8,
    },
  },
};

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function normalizarJogo(jogo) {
  const categoria = String(jogo.categoria?.nome || jogo.categoria || jogo.nomeCategoria || '').trim();
  const empresa = String(jogo.empresa?.nome || jogo.empresa || jogo.nomeEmpresa || jogo.empresa_nome || '').trim();

  return {
    id: jogo.id || jogo.idJogo || jogo.jogoId || null,
    nome: String(jogo.nome || jogo.titulo || '').trim(),
    categoria: categoria || 'Sem classificacao',
    empresa: empresa || 'Empresa nao informada',
    ano: jogo.ano || jogo.anoLancamento || null,
    preco: jogo.preco || jogo.valor || 0,
    descricao: String(jogo.descricao || '').replace(/^"|"$/g, '').trim(),
    capa: jogo.capa || jogo.imagem || jogo.urlImagem || jogo.imageUrl || '',
  };
}

function obterListaApi(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.value)) return data.value;
  return [];
}

function juntarJogosComIds(jogosPublicos, jogosAutenticados) {
  const idsPorNome = new Map(
    jogosAutenticados
      .filter((jogo) => jogo.id && jogo.nome)
      .map((jogo) => [jogo.nome.trim().toLowerCase(), jogo.id]),
  );

  return jogosPublicos.map((jogo) => ({
    ...jogo,
    id: jogo.id || idsPorNome.get(jogo.nome.trim().toLowerCase()) || null,
  }));
}

function obterItensCarrinho(data) {
  if (Array.isArray(data?.carrinho?.itens)) return data.carrinho.itens;
  if (Array.isArray(data?.itens)) return data.itens;
  if (Array.isArray(data?.value?.itens)) return data.value.itens;
  return [];
}

function normalizarItensCarrinho(data) {
  return obterItensCarrinho(data).map((item) => ({
    id: item.fkJogo || item.jogoId || item.id,
    quantidade: item.quantidade || 1,
  }));
}

function normalizarCategoria(categoria) {
  return (categoria.nome || categoria.categoria || categoria.name || String(categoria)).trim();
}

function obterIniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

function IconeBusca() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconeCarrinho({ tom = 'escuro' }) {
  const classeCor = tom === 'claro' ? 'text-white' : 'text-black';

  return (
    <svg
      viewBox="0 0 26 26"
      className={`h-5 w-5 shrink-0 ${classeCor}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.908 14.3C19.8826 14.3 20.7403 13.767 21.1821 12.961L25.8344 4.524C26.3152 3.666 25.6915 2.6 24.7038 2.6H5.47097L4.24942 0H0V2.6H2.59903L7.2773 12.467L5.52295 15.639C4.5743 17.381 5.82184 19.5 7.7971 19.5H23.3913V16.9H7.7971L9.22657 14.3H18.908ZM6.70551 5.2H22.4946L18.908 11.7H9.78537L6.70551 5.2ZM7.7971 20.8C6.36764 20.8 5.21106 21.97 5.21106 23.4C5.21106 24.83 6.36764 26 7.7971 26C9.22657 26 10.3961 24.83 10.3961 23.4C10.3961 21.97 9.22657 20.8 7.7971 20.8ZM20.7923 20.8C19.3628 20.8 18.2062 21.97 18.2062 23.4C18.2062 24.83 19.3628 26 20.7923 26C22.2217 26 23.3913 24.83 23.3913 23.4C23.3913 21.97 22.2217 20.8 20.7923 20.8Z" />
    </svg>
  );
}

function IconeUsuario({ tom = 'escuro' }) {
  const classeCor = tom === 'claro' ? 'text-white' : 'text-black';

  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 ${classeCor}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.8-3.4 5-5 8-5s6.2 1.6 8 5" />
    </svg>
  );
}

function IconeTema({ estaTemaEscuro = false, tom = 'escuro' }) {
  const classeCor = tom === 'claro' ? 'text-white' : 'text-black';

  if (estaTemaEscuro) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-out ${classeCor}`}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 26 26"
      className={`h-5 w-5 shrink-0 transition-transform duration-300 ease-out ${classeCor}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.9 13C3.9 12.6552 3.76304 12.3246 3.51924 12.0808C3.27544 11.837 2.94478 11.7 2.6 11.7H1.3C0.955219 11.7 0.624558 11.837 0.380761 12.0808C0.136964 12.3246 0 12.6552 0 13C0 13.3448 0.136964 13.6754 0.380761 13.9192C0.624558 14.163 0.955219 14.3 1.3 14.3H2.6C2.94478 14.3 3.27544 14.163 3.51924 13.9192C3.76304 13.6754 3.9 13.3448 3.9 13ZM4.732 19.5L3.809 20.423C3.56687 20.6666 3.43097 20.9961 3.43097 21.3395C3.43097 21.6829 3.56687 22.0124 3.809 22.256C4.05257 22.4981 4.38206 22.634 4.7255 22.634C5.06894 22.634 5.39843 22.4981 5.642 22.256L6.565 21.333C6.77797 21.0843 6.88926 20.7644 6.87663 20.4372C6.86399 20.1101 6.72836 19.7997 6.49683 19.5682C6.26531 19.3366 5.95495 19.201 5.62777 19.1884C5.30059 19.1757 4.98069 19.287 4.732 19.5ZM13 3.9C13.3448 3.9 13.6754 3.76304 13.9192 3.51924C14.163 3.27544 14.3 2.94478 14.3 2.6V1.3C14.3 0.955219 14.163 0.624558 13.9192 0.380761C13.6754 0.136964 13.3448 0 13 0C12.6552 0 12.3246 0.136964 12.0808 0.380761C11.837 0.624558 11.7 0.955219 11.7 1.3V2.6C11.7 2.94478 11.837 3.27544 12.0808 3.51924C12.3246 3.76304 12.6552 3.9 13 3.9ZM20.358 6.942C20.699 6.94056 21.0259 6.80517 21.268 6.565L22.191 5.642C22.3271 5.52546 22.4376 5.38205 22.5156 5.22076C22.5937 5.05948 22.6375 4.8838 22.6444 4.70477C22.6514 4.52573 22.6212 4.3472 22.5558 4.18038C22.4905 4.01356 22.3913 3.86205 22.2646 3.73535C22.138 3.60866 21.9864 3.50953 21.8196 3.44417C21.6528 3.37881 21.4743 3.34865 21.2952 3.35556C21.1162 3.36248 20.9405 3.40633 20.7792 3.48436C20.618 3.56239 20.4745 3.67291 20.358 3.809L19.5 4.732C19.2579 4.97557 19.122 5.30506 19.122 5.6485C19.122 5.99194 19.2579 6.32143 19.5 6.565C19.7292 6.79297 20.0351 6.92738 20.358 6.942ZM4.758 6.565C5.00014 6.80517 5.32696 6.94056 5.668 6.942C5.83909 6.94299 6.00869 6.9102 6.16708 6.8455C6.32547 6.78081 6.46953 6.68549 6.591 6.565C6.83313 6.32143 6.96903 5.99194 6.96903 5.6485C6.96903 5.30506 6.83313 4.97557 6.591 4.732L5.668 3.809C5.54764 3.68694 5.40442 3.58977 5.24652 3.52306C5.08861 3.45635 4.91911 3.42139 4.74769 3.42018C4.57628 3.41897 4.4063 3.45154 4.24747 3.51602C4.08864 3.58051 3.94406 3.67564 3.822 3.796C3.69994 3.91636 3.60277 4.05958 3.53606 4.21748C3.46935 4.37539 3.43439 4.54489 3.43318 4.71631C3.43074 5.0625 3.56593 5.39548 3.809 5.642L4.758 6.565ZM24.7 11.7H23.4C23.0552 11.7 22.7246 11.837 22.4808 12.0808C22.237 12.3246 22.1 12.6552 22.1 13C22.1 13.3448 22.237 13.6754 22.4808 13.9192C22.7246 14.163 23.0552 14.3 23.4 14.3H24.7C25.0448 14.3 25.3754 14.163 25.6192 13.9192C25.863 13.6754 26 13.3448 26 13C26 12.6552 25.863 12.3246 25.6192 12.0808C25.3754 11.837 25.0448 11.7 24.7 11.7ZM21.268 19.5C21.021 19.3626 20.736 19.3095 20.4561 19.3486C20.1762 19.3877 19.9167 19.517 19.7168 19.7168C19.517 19.9167 19.3877 20.1762 19.3486 20.4561C19.3095 20.736 19.3626 21.021 19.5 21.268L20.423 22.191C20.6666 22.4331 20.9961 22.569 21.3395 22.569C21.6829 22.569 22.0124 22.4331 22.256 22.191C22.4981 21.9474 22.634 21.6179 22.634 21.2745C22.634 20.9311 22.4981 20.6016 22.256 20.358L21.268 19.5ZM13 5.85C11.5859 5.85 10.2035 6.26934 9.02767 7.05499C7.85186 7.84064 6.93543 8.95732 6.39426 10.2638C5.8531 11.5703 5.7115 13.0079 5.98739 14.3949C6.26327 15.7819 6.94424 17.0559 7.94419 18.0558C8.94413 19.0558 10.2181 19.7367 11.6051 20.0126C12.9921 20.2885 14.4297 20.1469 15.7362 19.6057C17.0427 19.0646 18.1594 18.1481 18.945 16.9723C19.7307 15.7965 20.15 14.4141 20.15 13C20.1466 11.1048 19.3922 9.28812 18.052 7.94798C16.7119 6.60784 14.8952 5.85344 13 5.85ZM13 22.1C12.6552 22.1 12.3246 22.237 12.0808 22.4808C11.837 22.7246 11.7 23.0552 11.7 23.4V24.7C11.7 25.0448 11.837 25.3754 12.0808 25.6192C12.3246 25.863 12.6552 26 13 26C13.3448 26 13.6754 25.863 13.9192 25.6192C14.163 25.3754 14.3 25.0448 14.3 24.7V23.4C14.3 23.0552 14.163 22.7246 13.9192 22.4808C13.6754 22.237 13.3448 22.1 13 22.1Z" />
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

function IconeFiltro() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5h18" />
      <path d="M6 12h12" />
      <path d="M10 19h4" />
    </svg>
  );
}

function IconeChevron({ aberta = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform duration-200 ${aberta ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconeEstrela({ ativa = false, clicavel = false, onClick }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${ativa ? 'text-[#f59e0b]' : 'text-white/24'} ${clicavel ? 'cursor-pointer transition hover:scale-110' : ''}`}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      onClick={onClick}
    >
      <path d="m12 2.8 2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.84l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" />
    </svg>
  );
}

function IconeCoracao({ cheio = false }) {
  if (cheio) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SeletorEstrelas({ valor, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <IconeEstrela
          key={n}
          ativa={n <= (hover || valor)}
          clicavel
          onClick={() => onChange(n)}
        />
      ))}
    </div>
  );
}

function AvaliacaoEstrelas({ media, total }) {
  const notaArredondada = Math.round(media || 0);
  return (
    <div className="mt-2 flex items-center gap-1.5" aria-label={`Nota ${media || 0} de 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconeEstrela key={i} ativa={i < notaArredondada} />
      ))}
      <span className="ml-2 text-base font-bold text-white">{media ? media.toFixed(1) : '—'}</span>
      {total > 0 && <span className="text-xs text-white/50">({total})</span>}
    </div>
  );
}

function CapaJogo({ jogo, className = '' }) {
  if (jogo.capa) {
    return <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#aed4ff_0,#398ceb_30%,#000000_78%)] ${className}`}>
      <span className="text-4xl font-black tracking-[0.08em] text-white/90">{obterIniciais(jogo.nome)}</span>
    </div>
  );
}

function NavbarLoja({ busca, setBusca, quantidadeCarrinho, menuMobileAberto, setMenuMobileAberto, estaTemaEscuro }) {
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
          <IconeBusca />
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
            <IconeBusca />
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

function CategoriasLoja({ categorias, categoriaAtiva, setCategoriaAtiva, filtroMobileAberto, setFiltroMobileAberto, estaTemaEscuro }) {
  const painelClasse = estaTemaEscuro
    ? 'border-black/10 bg-white text-black shadow-[0_18px_40px_rgba(57,140,235,0.16)]'
    : 'border-[#aed4ff]/18 bg-black/94 text-white shadow-[0_22px_48px_rgba(57,140,235,0.18)]';
  const categoriaAtivaClasse = estaTemaEscuro
    ? 'bg-white text-black ring-white shadow-[0_10px_22px_rgba(57,140,235,0.16)]'
    : 'bg-black text-white ring-black/90 shadow-[0_10px_24px_rgba(0,0,0,0.18)]';
  const categoriaSecundariaClasse = estaTemaEscuro
    ? 'bg-white/12 text-white ring-white/14 hover:bg-white/18 hover:ring-white/22'
    : 'bg-black/8 text-black ring-black/12 hover:bg-black/12 hover:ring-black/18';
  const iconeFiltroClasse = estaTemaEscuro ? 'bg-black text-white' : 'bg-white text-black';
  const subtituloClasse = estaTemaEscuro ? 'text-black/55' : 'text-white/55';

  function selecionarCategoria(categoria) {
    setCategoriaAtiva(categoria);
    setFiltroMobileAberto(false);
  }

  return (
    <>
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setFiltroMobileAberto((estadoAtual) => !estadoAtual)}
          className={`flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-3 text-left backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${painelClasse}`}
        >
          <span className="flex items-center gap-2">
            <span className={`grid h-8 w-8 place-items-center rounded-full ${iconeFiltroClasse}`}>
              <IconeFiltro />
            </span>
            <span>
              <span className={`block text-xs font-semibold uppercase tracking-[0.12em] ${subtituloClasse}`}>Categoria</span>
              <span className="block text-sm font-semibold">{categoriaAtiva}</span>
            </span>
          </span>
          <IconeChevron aberta={filtroMobileAberto} />
        </button>

        {filtroMobileAberto && (
          <div className={`mt-3 rounded-[1.4rem] border p-3 backdrop-blur-md ${painelClasse}`}>
            <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  onClick={() => selecionarCategoria(categoria)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold ring-1 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    categoriaAtiva === categoria
                      ? categoriaAtivaClasse
                      : categoriaSecundariaClasse
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
        {categorias.map((categoria) => (
          <button
            type="button"
            key={categoria}
            onClick={() => setCategoriaAtiva(categoria)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${estaTemaEscuro ? 'focus-visible:outline-white' : 'focus-visible:outline-black'} ${
              categoriaAtiva === categoria
                ? categoriaAtivaClasse
                : categoriaSecundariaClasse
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>
    </>
  );
}

function CardJogo({ jogo, aoSelecionar, aoAdicionar, estaTemaEscuro, desejado, aoAlternarDesejo }) {
  const cardClasse = estaTemaEscuro
    ? 'bg-black ring-[#aed4ff]/18 shadow-[0_20px_42px_rgba(57,140,235,0.12)] hover:ring-[#398ceb]/60'
    : 'bg-white ring-black/10 shadow-[0_20px_42px_rgba(57,140,235,0.12)] hover:ring-[#398ceb]/52';
  const categoriaClasse = estaTemaEscuro ? 'text-white/70' : 'text-black/55';
  const tituloClasse = estaTemaEscuro ? 'text-white' : 'text-black';
  const empresaClasse = estaTemaEscuro ? 'text-white/58' : 'text-black/52';
  const precoClasse = estaTemaEscuro ? 'text-white' : 'text-black';
  const botaoCarrinhoClasse = estaTemaEscuro
    ? 'bg-white text-black hover:bg-[#aed4ff]'
    : 'bg-black text-white hover:bg-[#398ceb] hover:text-black';

  function abrirDetalhesComTeclado(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      aoSelecionar(jogo);
    }
  }

  return (
    <motion.article
      layout
      variants={cardAnimacao}
      role="button"
      tabIndex={0}
      onClick={() => aoSelecionar(jogo)}
      onKeyDown={abrirDetalhesComTeclado}
      className={`group flex h-full min-h-[300px] cursor-pointer flex-col overflow-hidden rounded-lg ring-1 transition duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#398ceb] sm:min-h-[372px] ${cardClasse}`}
    >
      <div className="relative block aspect-[4/3.18] w-full shrink-0 overflow-hidden text-left sm:aspect-[4/3.28]">
        <CapaJogo jogo={jogo} className="transition duration-300 group-hover:scale-105" />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); aoAlternarDesejo(jogo.id); }}
          aria-label={desejado ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
          className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-sm transition hover:scale-110 sm:h-9 sm:w-9 ${
            desejado ? 'bg-black/50 text-[#e74c6f]' : 'bg-black/40 text-white/70 opacity-0 group-hover:opacity-100'
          }`}
        >
          <IconeCoracao cheio={desejado} />
        </button>
      </div>
      <div className="grid min-h-[124px] flex-1 grid-cols-[minmax(0,1fr)_auto] gap-2 p-3.5 sm:min-h-[158px] sm:gap-3 sm:p-4.5">
        <div className="flex min-w-0 flex-col text-left">
          <p className={`text-[11px] font-medium leading-none sm:text-sm ${categoriaClasse}`}>{jogo.categoria}</p>
          <h3 className={`product-card-title mt-1.5 text-sm font-semibold leading-tight sm:mt-2 sm:text-base ${tituloClasse}`}>{jogo.nome}</h3>
          <p className={`mt-1.5 truncate text-[11px] font-medium sm:mt-2 sm:text-sm ${empresaClasse}`}>{jogo.empresa}</p>
          <p className={`mt-auto pt-3 text-base font-black leading-none sm:pt-4 sm:text-lg ${precoClasse}`}>{formatarMoeda(jogo.preco)}</p>
        </div>
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); aoAdicionar(jogo); }}
          aria-label={`Adicionar ${jogo.nome} ao carrinho`}
          title="Adicionar ao carrinho"
          className={`grid h-10 w-10 self-end place-items-center rounded-full shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] sm:h-12 sm:w-12 ${botaoCarrinhoClasse}`}
        >
          <IconeCarrinho tom={estaTemaEscuro ? 'escuro' : 'claro'} />
        </button>
      </div>
    </motion.article>
  );
}

export function ModalDetalhes({ jogo, aoFechar, aoAdicionar, desejado, aoAlternarDesejo, abaInicial = 'detalhes', aoAtualizar }) {
  const [aba, setAba] = useState(abaInicial);
  const [notaForm, setNotaForm] = useState(0);
  const [comentarioForm, setComentarioForm] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');
  const { avaliacoes, media, total, minhaAvaliacao, carregando: carregandoAval, erro: erroAval, carregarAvaliacoesJogo, carregarMinhaAvaliacao, enviar, remover } = useAvaliacoes();

  useEffect(() => {
    function fecharComEsc(event) { if (event.key === 'Escape') aoFechar(); }
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [aoFechar]);

  useEffect(() => {
    if (jogo?.id) {
      carregarAvaliacoesJogo(jogo.id);
      carregarMinhaAvaliacao(jogo.id);
      setAba(abaInicial);
      setMsgSucesso('');
    }
  }, [jogo?.id, carregarAvaliacoesJogo, carregarMinhaAvaliacao, abaInicial]);

  useEffect(() => {
    if (minhaAvaliacao) {
      setNotaForm(minhaAvaliacao.nota || 0);
      setComentarioForm(minhaAvaliacao.comentario || '');
    } else {
      setNotaForm(0);
      setComentarioForm('');
    }
  }, [minhaAvaliacao]);

  if (!jogo) return null;

  async function handleEnviarAvaliacao(e) {
    e.preventDefault();
    if (notaForm < 1) return;
    setEnviando(true);
    setMsgSucesso('');
    try {
      await enviar(jogo.id, notaForm, comentarioForm);
      setMsgSucesso(minhaAvaliacao ? 'Avaliação atualizada!' : 'Avaliação enviada!');
      if (aoAtualizar) aoAtualizar();
    } catch { /* erro tratado no hook */ }
    setEnviando(false);
  }

  async function handleExcluirAvaliacao() {
    setEnviando(true);
    setMsgSucesso('');
    try {
      await remover(jogo.id);
      setMsgSucesso('Avaliação excluída!');
      setNotaForm(0);
      setComentarioForm('');
      if (aoAtualizar) aoAtualizar();
    } catch { /* erro tratado no hook */ }
    setEnviando(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-detalhe-jogo">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar modal" onClick={aoFechar} />
      <section className="relative grid w-full max-w-4xl gap-6 rounded-lg bg-black p-4 text-white shadow-2xl ring-1 ring-white/10 md:grid-cols-[0.95fr_1.05fr]">
        <button type="button" onClick={aoFechar} aria-label="Fechar detalhes" className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <div className="overflow-hidden rounded-lg">
          <CapaJogo jogo={jogo} className="aspect-[4/5] md:aspect-[4/4.7]" />
        </div>
        <div className="flex min-w-0 flex-col pr-2 md:pr-6">
          <p className="text-sm font-semibold text-[#398ceb]">{jogo.categoria} - {jogo.empresa}</p>
          <h2 id="titulo-detalhe-jogo" className="mt-2 text-3xl font-black leading-none md:text-4xl">{jogo.nome}</h2>

          {/* Abas */}
          <div className="mt-5 flex gap-1 rounded-full bg-white/8 p-1">
            <button type="button" onClick={() => setAba('detalhes')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${aba === 'detalhes' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>Detalhes</button>
            <button type="button" onClick={() => setAba('avaliacoes')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${aba === 'avaliacoes' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>
              Avaliações {total > 0 && <span className="ml-1 text-xs opacity-70">({total})</span>}
            </button>
          </div>

          {/* Aba Detalhes */}
          {aba === 'detalhes' && (
            <div className="mt-4 flex flex-1 flex-col overflow-y-auto" style={{ maxHeight: '420px' }}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Ano</p>
                  <p className="mt-1 text-lg font-semibold">{jogo.ano || 'N/I'}</p>
                </div>
                <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Preço</p>
                  <p className="mt-1 text-lg font-semibold">{formatarMoeda(jogo.preco)}</p>
                </div>
                <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Empresa</p>
                  <p className="mt-1 text-base font-semibold">{jogo.empresa}</p>
                </div>
                <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Categoria</p>
                  <p className="mt-1 text-base font-semibold">{jogo.categoria}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-white/8 p-4 ring-1 ring-white/10">
                <p className="text-xs font-bold uppercase text-white/65">Nota Média</p>
                <AvaliacaoEstrelas media={media} total={total} />
              </div>
              <div className="mt-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/8">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Descrição</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{jogo.descricao || 'Descrição indisponível.'}</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => aoAdicionar(jogo)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black transition hover:bg-[#aed4ff]">
                  Adicionar ao carrinho <IconeCarrinho />
                </button>
                <button type="button" onClick={() => aoAlternarDesejo(jogo.id)} className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 font-bold transition ${desejado ? 'border-[#e74c6f] text-[#e74c6f] hover:bg-[#e74c6f]/10' : 'border-white/20 text-white hover:border-[#e74c6f] hover:text-[#e74c6f]'}`}>
                  <IconeCoracao cheio={desejado} /> {desejado ? 'Na lista' : 'Desejar'}
                </button>
              </div>
            </div>
          )}

          {/* Aba Avaliações */}
          {aba === 'avaliacoes' && (
            <div className="mt-4 flex flex-1 flex-col overflow-y-auto" style={{ maxHeight: '420px' }}>
              {/* Formulário de avaliação */}
              <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
                <h3 className="text-sm font-bold text-white">{minhaAvaliacao ? 'Editar sua avaliação' : 'Avaliar este jogo'}</h3>
                <form onSubmit={handleEnviarAvaliacao} className="mt-3 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-white/60">Sua nota</label>
                    <SeletorEstrelas valor={notaForm} onChange={setNotaForm} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-white/60">Comentário (opcional)</label>
                    <textarea value={comentarioForm} onChange={(e) => setComentarioForm(e.target.value)} rows={2} placeholder="O que achou do jogo?" className="w-full resize-none rounded-lg bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 focus:outline-none focus:ring-[#398ceb]" />
                  </div>
                  {erroAval && <p className="text-xs text-red-400">{erroAval}</p>}
                  {msgSucesso && <p className="text-xs text-green-400">{msgSucesso}</p>}
                  
                  <div className="flex gap-2">
                    <button type="submit" disabled={notaForm < 1 || enviando} className="flex-1 rounded-full bg-[#398ceb] py-2.5 text-sm font-bold text-white transition hover:bg-[#2a78d4] disabled:opacity-40">
                      {enviando ? 'Enviando...' : minhaAvaliacao ? 'Atualizar' : 'Enviar'}
                    </button>
                    {minhaAvaliacao && (
                      <button type="button" onClick={handleExcluirAvaliacao} disabled={enviando} className="rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2.5 text-sm font-bold transition disabled:opacity-40">
                        Excluir
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Média */}
              <div className="mt-4 flex items-center gap-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/8">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#f59e0b]">{media ? media.toFixed(1) : '—'}</p>
                  <p className="text-xs text-white/50">{total} {total === 1 ? 'avaliação' : 'avaliações'}</p>
                </div>
                <div className="flex-1">
                  <AvaliacaoEstrelas media={media} total={total} />
                </div>
              </div>

              {/* Lista de avaliações */}
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-bold text-white/70">Avaliações anteriores</h3>
                {carregandoAval && <p className="text-xs text-white/40">Carregando...</p>}
                {!carregandoAval && avaliacoes.length === 0 && (
                  <p className="rounded-lg bg-white/5 p-4 text-center text-sm text-white/40">Nenhuma avaliação ainda. Seja o primeiro!</p>
                )}
                {avaliacoes.map((av, i) => (
                  <div key={av.id || i} className="rounded-lg bg-white/5 p-3 ring-1 ring-white/8">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <svg key={n} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${n < av.nota ? 'text-[#f59e0b]' : 'text-white/20'}`} fill="currentColor"><path d="m12 2.8 2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.84l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" /></svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white/60">Usuário #{av.fkUsuario || av.fk_usuario || '?'}</span>
                    </div>
                    {av.comentario && <p className="mt-2 text-sm text-white/70">{av.comentario}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Loja() {
  const { dark: estaTemaEscuro } = useTheme();
  const { estaDesejado, alternar: alternarDesejo } = useWishlist();
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState(categoriaPadrao);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroCarrinho, setErroCarrinho] = useState('');
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [filtroMobileAberto, setFiltroMobileAberto] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    setErro('');

    try {
      const [respostaJogosPublicos, respostaJogosAutenticados, respostaCarrinho] = await Promise.all([
        api.get('/public/jogos'),
        api.get('/jogos'),
        api.get('/carrinho/ativo').catch(() => ({ data: null })),
      ]);

      const jogosPublicos = obterListaApi(respostaJogosPublicos.data).map(normalizarJogo);
      const jogosAutenticados = obterListaApi(respostaJogosAutenticados.data).map(normalizarJogo);
      const jogosComIds = juntarJogosComIds(jogosPublicos, jogosAutenticados);
      const categoriasCatalogo = [...new Set(jogosComIds.map((jogo) => normalizarCategoria(jogo.categoria)).filter(Boolean))];

      setJogos(jogosComIds);
      setCategorias(['Todos', ...categoriasCatalogo]);
      setItensCarrinho(normalizarItensCarrinho(respostaCarrinho.data));
    } catch {
      setJogos([]);
      setCategorias(categoriaPadrao);
      setErro('Nao foi possivel carregar os jogos da API. Verifique se o backend esta rodando e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(carregarDados);
  }, []);

  useEffect(() => {
    function ajustarLayoutDesktop() {
      if (window.innerWidth >= 640) {
        setMenuMobileAberto(false);
        setFiltroMobileAberto(false);
      }
    }

    window.addEventListener('resize', ajustarLayoutDesktop);
    return () => window.removeEventListener('resize', ajustarLayoutDesktop);
  }, []);

  const jogosFiltrados = useMemo(() => {
    return jogos.filter((jogo) => {
      const bateCategoria = categoriaAtiva === 'Todos' || jogo.categoria === categoriaAtiva;
      const termo = busca.trim().toLowerCase();
      const bateBusca = !termo || `${jogo.nome} ${jogo.categoria} ${jogo.empresa}`.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }, [busca, categoriaAtiva, jogos]);

  const quantidadeCarrinho = itensCarrinho.reduce((acc, item) => acc + Number(item.quantidade || 1), 0);

  async function adicionarAoCarrinho(jogo) {
    setErroCarrinho('');
    if (!jogo.id) {
      setErroCarrinho('A API nao retornou o ID deste jogo. Nao foi possivel adicionar ao carrinho.');
      return;
    }

    try {
      const resposta = await api.post('/carrinho/add', { jogoId: jogo.id });
      setItensCarrinho(normalizarItensCarrinho(resposta.data));
    } catch (erroCapturado) {
      setErroCarrinho(erroCapturado.response?.data?.message || 'Nao foi possivel adicionar o jogo ao carrinho. Tente novamente.');
    }
  }

  return (
    <main className={`min-h-screen overflow-hidden ${estaTemaEscuro ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <section className="nexus-store-bg relative min-h-screen overflow-hidden px-5 pb-12">
        <div
          className={`absolute inset-0 ${estaTemaEscuro ? 'bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(57,140,235,0.06))]' : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(174,212,255,0.10))]'}`}
          aria-hidden="true"
        />
        <div className="relative">
          <NavbarLoja
            busca={busca}
            setBusca={setBusca}
            quantidadeCarrinho={quantidadeCarrinho}
            menuMobileAberto={menuMobileAberto}
            setMenuMobileAberto={setMenuMobileAberto}
            estaTemaEscuro={estaTemaEscuro}
          />

          <div className="mx-auto mt-18 max-w-7xl sm:mt-24">
            <CategoriasLoja
              categorias={categorias}
              categoriaAtiva={categoriaAtiva}
              setCategoriaAtiva={setCategoriaAtiva}
              filtroMobileAberto={filtroMobileAberto}
              setFiltroMobileAberto={setFiltroMobileAberto}
              estaTemaEscuro={estaTemaEscuro}
            />

            {erro && (
              <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 rounded-lg border border-[#398ceb]/30 bg-black/80 px-4 py-4 text-center text-sm text-white/85">
                <p>{erro}</p>
                <button
                  type="button"
                  onClick={carregarDados}
                  className="rounded-full bg-white px-4 py-2 font-bold text-black transition hover:bg-[#aed4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {erroCarrinho && (
              <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-[#398ceb]/30 bg-black/80 px-4 py-3 text-center text-sm text-white">
                {erroCarrinho}
              </p>
            )}

            {carregando ? (
              <>
                <div className="mt-10 grid grid-cols-2 gap-3 sm:hidden">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-64 animate-pulse rounded-lg bg-white/10" />
                  ))}
                </div>
                <div className="mt-16 hidden grid-cols-1 gap-7 sm:grid sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-80 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
                  ))}
                </div>
              </>
            ) : jogosFiltrados.length ? (
              <motion.div
                key={`catalogo-${categoriaAtiva}-${busca}`}
                variants={gridAnimacao}
                initial="hidden"
                animate="show"
                className="mt-10 grid grid-cols-2 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-7 xl:grid-cols-4"
              >
                {jogosFiltrados.map((jogo) => (
                  <CardJogo
                    key={jogo.id || jogo.nome}
                    jogo={jogo}
                    aoSelecionar={setJogoSelecionado}
                    aoAdicionar={adicionarAoCarrinho}
                    estaTemaEscuro={estaTemaEscuro}
                    desejado={estaDesejado(jogo.id)}
                    aoAlternarDesejo={alternarDesejo}
                  />
                ))}
              </motion.div>
            ) : (
              <div className={`mt-16 rounded-lg p-10 text-center ${
                estaTemaEscuro
                  ? 'border border-white/10 bg-black/80'
                  : 'border border-black/8 bg-white shadow-[0_18px_40px_rgba(57,140,235,0.10)]'
              }`}>
                <h2 className={`text-2xl font-black ${estaTemaEscuro ? 'text-white' : 'text-black'}`}>Nenhum jogo encontrado</h2>
                <p className={`mt-2 ${estaTemaEscuro ? 'text-white/70' : 'text-black/60'}`}>Tente outra busca ou selecione uma categoria diferente.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ModalDetalhes jogo={jogoSelecionado} aoFechar={() => setJogoSelecionado(null)} aoAdicionar={adicionarAoCarrinho} desejado={jogoSelecionado ? estaDesejado(jogoSelecionado.id) : false} aoAlternarDesejo={alternarDesejo} />
    </main>
  );
}
