import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useWishlist from '../hooks/useWishlist.js';
import useTheme from '../hooks/useTheme.js';
import useCarrinho from '../hooks/useCarrinho.js';
import useToastContext from '../hooks/useToastContext.js';
import ModalDetalhes from '../componentes/ModalDetalhes.jsx';


function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterIniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function IconeCoracaoCheio() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function IconeSetaEsquerda() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

const cardAnimacao = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

const gridAnimacao = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function Wishlist() {
  const { dark: estaTemaEscuro } = useTheme();
  const { lista, carregando, remover, estaDesejado, alternar } = useWishlist();
  const { adicionar } = useCarrinho();
  const mostrarToast = useToastContext();
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  async function adicionarAoCarrinho(jogo) {
    if (!jogo.id) return;
    const ok = await adicionar(jogo.id);
    mostrarToast(
      ok ? `${jogo.nome} foi adicionado ao carrinho.` : 'Não foi possível adicionar ao carrinho.',
      ok ? 'sucesso' : 'erro',
    );
  }

  const bg = estaTemaEscuro ? 'bg-black' : 'bg-white';
  const textoPrincipal = estaTemaEscuro ? 'text-white' : 'text-black';
  const textoSecundario = estaTemaEscuro ? 'text-white/60' : 'text-black/55';
  const cardBg = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12 hover:ring-[#398ceb]/50'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)] hover:ring-[#398ceb]/40';

  return (
    <main className={`min-h-screen ${bg} ${textoPrincipal}`}>
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/loja"
            className={`grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 ${estaTemaEscuro ? 'bg-white/10 hover:bg-white/15' : 'bg-black/5 hover:bg-black/10'}`}
            aria-label="Voltar para a loja"
          >
            <IconeSetaEsquerda />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[#e74c6f]">
              <IconeCoracaoCheio />
            </span>
            <h1 className="text-3xl font-black tracking-tight">Lista de Desejos</h1>
          </div>
          <span className={`ml-auto rounded-full px-3 py-1 text-sm font-bold ${estaTemaEscuro ? 'bg-white/10' : 'bg-black/5'}`}>
            {lista.length} {lista.length === 1 ? 'jogo' : 'jogos'}
          </span>
        </div>

        {/* Loading */}
        {carregando && (
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-72 animate-pulse rounded-xl ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!carregando && lista.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <span className={`text-6xl ${textoSecundario}`}>♡</span>
            <h2 className={`text-2xl font-bold ${textoPrincipal}`}>Nenhum jogo na lista</h2>
            <p className={textoSecundario}>Explore a loja e adicione jogos à sua lista de desejos clicando no ícone de coração.</p>
            <Link
              to="/loja"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#398ceb] px-6 py-3 font-bold text-white transition hover:bg-[#2a78d4]"
            >
              Explorar Loja
            </Link>
          </div>
        )}

        {/* Grid */}
        {!carregando && lista.length > 0 && (
          <motion.div
            variants={gridAnimacao}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {lista.map((jogo) => (
              <motion.article
                key={jogo.id}
                variants={cardAnimacao}
                layout
                onClick={() => setJogoSelecionado(jogo)}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl ring-1 transition duration-200 hover:-translate-y-1 ${cardBg}`}
              >
                {/* Capa */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {jogo.capa || jogo.imagem ? (
                    <img src={jogo.capa || jogo.imagem} alt={jogo.nome} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div role="img" aria-label={`Capa do jogo ${jogo.nome}`} className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#aed4ff_0,#398ceb_30%,#000_78%)]">
                      <span className="text-3xl font-black text-white/90" aria-hidden="true">{obterIniciais(jogo.nome)}</span>
                    </div>
                  )}

                  {/* Botão Remover (coração cheio) */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remover(jogo.id); }}
                    aria-label={`Remover ${jogo.nome} da lista de desejos`}
                    title="Remover da lista de desejos"
                    className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-[#e74c6f] backdrop-blur-sm transition hover:scale-110 hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#398ceb]"
                  >
                    <IconeCoracaoCheio />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${textoSecundario}`}>
                    {jogo.nomeCategoria || jogo.categoria || ''}
                  </p>
                  <h3 className={`mt-1 text-lg font-bold leading-tight ${textoPrincipal}`}>{jogo.nome}</h3>
                  <p className={`mt-1 text-sm ${textoSecundario}`}>
                    {jogo.nomeEmpresa || jogo.empresa || ''}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className={`text-xl font-black ${textoPrincipal}`}>
                      {formatarMoeda(jogo.preco || jogo.valor)}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      <ModalDetalhes
        jogo={jogoSelecionado}
        aoFechar={() => setJogoSelecionado(null)}
        aoAdicionar={adicionarAoCarrinho}
        desejado={jogoSelecionado ? estaDesejado(jogoSelecionado.id) : false}
        aoAlternarDesejo={alternar}
      />
    </main>
  );
}
