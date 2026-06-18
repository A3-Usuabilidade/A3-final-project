import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../servicos/api.js';
import useWishlist from '../hooks/useWishlist.js';
import useTheme from '../hooks/useTheme.js';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterIniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
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

function IconeSetaEsquerda() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function IconeBusca() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}

const cardAnimacao = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const gridAnimacao = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

function normalizarJogo(jogo) {
  return {
    id: jogo.id || jogo.idJogo || null,
    nome: String(jogo.nome || jogo.titulo || '').trim(),
    categoria: String(jogo.categoria?.nome || jogo.categoria || jogo.nomeCategoria || '').trim(),
    empresa: String(jogo.empresa?.nome || jogo.empresa || jogo.nomeEmpresa || jogo.empresa_nome || '').trim(),
    preco: jogo.preco || jogo.valor || 0,
    capa: jogo.capa || jogo.imagem || jogo.urlImagem || '',
    descricao: String(jogo.descricao || '').trim(),
  };
}

export default function Biblioteca() {
  const { dark: estaTemaEscuro } = useTheme();
  const { estaDesejado, alternar } = useWishlist();
  const [jogos, setJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        // A biblioteca traz apenas os jogos que o usuário já comprou.
        const { data } = await api.get('/biblioteca');
        const lista = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];
        setJogos(lista.map(normalizarJogo));
      } catch {
        setJogos([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const jogosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return jogos;
    return jogos.filter((j) => `${j.nome} ${j.categoria} ${j.empresa}`.toLowerCase().includes(termo));
  }, [jogos, busca]);

  const bg = estaTemaEscuro ? 'bg-black' : 'bg-white';
  const textoPrincipal = estaTemaEscuro ? 'text-white' : 'text-black';
  const textoSecundario = estaTemaEscuro ? 'text-white/55' : 'text-black/50';
  const cardBg = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12 hover:ring-[#398ceb]/50'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)] hover:ring-[#398ceb]/40';
  const buscaBg = estaTemaEscuro
    ? 'bg-white/8 ring-white/10 text-white placeholder:text-white/40'
    : 'bg-black/4 ring-black/8 text-black placeholder:text-black/40';

  return (
    <main className={`min-h-screen ${bg} ${textoPrincipal}`}>
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/loja"
              className={`grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 ${estaTemaEscuro ? 'bg-white/10 hover:bg-white/15' : 'bg-black/5 hover:bg-black/10'}`}
              aria-label="Voltar para a loja"
            >
              <IconeSetaEsquerda />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Biblioteca</h1>
              <p className={`text-sm ${textoSecundario}`}>{jogos.length} {jogos.length === 1 ? 'jogo' : 'jogos'} na sua biblioteca</p>
            </div>
          </div>
          <label className={`flex h-11 items-center gap-2 rounded-full px-4 ring-1 focus-within:ring-2 focus-within:ring-[#398ceb] ${buscaBg}`}>
            <IconeBusca />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar na biblioteca..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold focus:outline-none"
            />
          </label>
        </div>

        {/* Loading */}
        {carregando && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-64 animate-pulse rounded-xl ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!carregando && jogosFiltrados.length > 0 && (
          <motion.div
            variants={gridAnimacao}
            initial="hidden"
            animate="show"
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {jogosFiltrados.map((jogo) => {
              const desejado = estaDesejado(jogo.id);
              return (
                <motion.article
                  key={jogo.id}
                  variants={cardAnimacao}
                  layout
                  className={`group relative flex flex-col overflow-hidden rounded-xl ring-1 transition duration-200 hover:-translate-y-1 ${cardBg}`}
                >
                  {/* Capa */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {jogo.capa ? (
                      <img src={jogo.capa} alt={jogo.nome} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div role="img" aria-label={`Capa do jogo ${jogo.nome}`} className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#aed4ff_0,#398ceb_30%,#000_78%)]">
                        <span className="text-3xl font-black text-white/90" aria-hidden="true">{obterIniciais(jogo.nome)}</span>
                      </div>
                    )}

                    {/* Coração */}
                    <button
                      type="button"
                      onClick={() => alternar(jogo.id)}
                      aria-label={desejado ? `Remover ${jogo.nome} da lista de desejos` : `Adicionar ${jogo.nome} à lista de desejos`}
                      className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full backdrop-blur-sm transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#398ceb] ${
                        desejado
                          ? 'bg-black/50 text-[#e74c6f]'
                          : 'bg-black/40 text-white/80 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <IconeCoracao cheio={desejado} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-3">
                    <p className={`text-[11px] font-medium ${textoSecundario}`}>{jogo.categoria}</p>
                    <h3 className={`mt-1 text-sm font-bold leading-tight ${textoPrincipal}`}>{jogo.nome}</h3>
                    <p className={`mt-1 truncate text-xs ${textoSecundario}`}>{jogo.empresa}</p>
                    <p className={`mt-auto pt-3 text-base font-black ${textoPrincipal}`}>{formatarMoeda(jogo.preco)}</p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* Empty */}
        {!carregando && jogosFiltrados.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <h2 className={`text-2xl font-bold ${textoPrincipal}`}>
              {busca ? 'Nenhum jogo encontrado' : 'Sua biblioteca está vazia'}
            </h2>
            <p className={textoSecundario}>
              {busca ? 'Tente outro termo de busca.' : 'Você ainda não comprou nenhum jogo. Explore a loja para começar a sua coleção.'}
            </p>
            {!busca && (
              <Link
                to="/loja"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#398ceb] px-6 py-3 font-bold text-white transition hover:bg-[#2a78d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
              >
                Explorar Loja
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
