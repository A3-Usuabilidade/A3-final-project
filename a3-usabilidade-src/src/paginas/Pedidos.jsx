import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useTheme from '../hooks/useTheme.js';
import usePedidos from '../hooks/usePedidos.js';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(valor) {
  if (!valor) return 'Data não informada';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return 'Data não informada';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function IconeSetaEsquerda() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function IconeChevron({ aberto = false }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const gridAnimacao = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardAnimacao = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Pedidos() {
  const { dark: estaTemaEscuro } = useTheme();
  const { pedidos, carregando, erro, recarregar } = usePedidos();
  const [expandido, setExpandido] = useState(null);

  const bg = estaTemaEscuro ? 'bg-black' : 'bg-white';
  const textoPrincipal = estaTemaEscuro ? 'text-white' : 'text-black';
  const textoSecundario = estaTemaEscuro ? 'text-white/60' : 'text-black/55';
  const cardBg = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)]';

  function alternar(id) {
    setExpandido((atual) => (atual === id ? null : id));
  }

  return (
    <main className={`min-h-screen ${bg} ${textoPrincipal}`}>
      <div className="mx-auto max-w-4xl px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/loja"
            className={`grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${estaTemaEscuro ? 'bg-white/10 hover:bg-white/15' : 'bg-black/5 hover:bg-black/10'}`}
            aria-label="Voltar para a loja"
          >
            <IconeSetaEsquerda />
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Meus Pedidos</h1>
          {!carregando && pedidos.length > 0 && (
            <span className={`ml-auto rounded-full px-3 py-1 text-sm font-bold ${estaTemaEscuro ? 'bg-white/10' : 'bg-black/5'}`}>
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
            </span>
          )}
        </div>

        {/* Loading */}
        {carregando && (
          <div className="mt-10 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-24 animate-pulse rounded-xl ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} />
            ))}
          </div>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-[#398ceb]/30 bg-black/80 px-4 py-5 text-center text-sm text-white/85">
            <p>{erro}</p>
            <button
              type="button"
              onClick={recarregar}
              className="rounded-full bg-white px-4 py-2 font-bold text-black transition hover:bg-[#aed4ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Vazio */}
        {!carregando && !erro && pedidos.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <span className={`text-6xl ${textoSecundario}`} aria-hidden="true">🧾</span>
            <h2 className="text-2xl font-bold">Você ainda não tem pedidos</h2>
            <p className={textoSecundario}>Quando você finalizar uma compra, o histórico aparece aqui.</p>
            <Link
              to="/loja"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#398ceb] px-6 py-3 font-bold text-white transition hover:bg-[#2a78d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
            >
              Explorar Loja
            </Link>
          </div>
        )}

        {/* Lista */}
        {!carregando && !erro && pedidos.length > 0 && (
          <motion.ul
            variants={gridAnimacao}
            initial="hidden"
            animate="show"
            className="mt-10 space-y-4"
          >
            {pedidos.map((pedido) => {
              const aberto = expandido === pedido.id;
              return (
                <motion.li
                  key={pedido.id}
                  variants={cardAnimacao}
                  className={`overflow-hidden rounded-xl ring-1 ${cardBg}`}
                >
                  <button
                    type="button"
                    onClick={() => alternar(pedido.id)}
                    aria-expanded={aberto}
                    className="flex w-full items-center gap-4 p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#398ceb]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Pedido #{pedido.id}</span>
                        <span className="rounded-full bg-[#398ceb]/15 px-2 py-0.5 text-[11px] font-bold text-[#398ceb]">{pedido.status}</span>
                      </div>
                      <p className={`mt-1 text-xs ${textoSecundario}`}>{formatarData(pedido.data)} · {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</p>
                    </div>
                    <span className="shrink-0 text-lg font-black">{formatarMoeda(pedido.total)}</span>
                    <span className={textoSecundario}><IconeChevron aberto={aberto} /></span>
                  </button>

                  {aberto && (
                    <div className={`border-t px-5 py-4 ${estaTemaEscuro ? 'border-white/10' : 'border-black/10'}`}>
                      <ul className="space-y-2">
                        {pedido.itens.map((item, indice) => (
                          <li key={indice} className="flex items-center justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate">
                              {item.nome}
                              {item.quantidade > 1 && <span className={textoSecundario}> ×{item.quantidade}</span>}
                            </span>
                            <span className="shrink-0 font-semibold">{formatarMoeda(item.preco * item.quantidade)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </main>
  );
}
