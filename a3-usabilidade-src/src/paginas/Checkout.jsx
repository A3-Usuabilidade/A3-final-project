import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useTheme from '../hooks/useTheme.js';
import useCarrinho from '../hooks/useCarrinho.js';
import { esquemaPagamento } from '../configuracao/validacao.js';

const PIX_CODIGO = '00020126360014BR.GOV.BCB.PIX0114+5571999990000520400005303986540' +
  '5XX.XX5802BR5913NEXUS GAMES6009SAO PAULO62070503***6304NEX1';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterIniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

function mascararNumeroCartao(valor) {
  return valor.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function mascararValidade(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
}

function coletarErros(zodError) {
  const mapa = {};
  for (const issue of zodError.issues) {
    const campo = issue.path[0];
    if (campo && !mapa[campo]) mapa[campo] = issue.message;
  }
  return mapa;
}

const gridAnimacao = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemAnimacao = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

function IconeSetaEsquerda() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  );
}

function IconeCadeado() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconeCartao() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  );
}

function IconePix() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 4 4-4 4-4-4 4-4Z" /><path d="m12 13 4 4-4 4-4-4 4-4Z" />
      <path d="m3 12 4-4 4 4-4 4-4-4Z" /><path d="m13 12 4-4 4 4-4 4-4-4Z" />
    </svg>
  );
}

function IconeCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CapaItem({ item }) {
  if (item.capa) {
    return <img src={item.capa} alt={`Capa do jogo ${item.nome}`} className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#aed4ff_0,#398ceb_30%,#000_78%)]">
      <span className="text-lg font-black text-white/90">{obterIniciais(item.nome)}</span>
    </div>
  );
}

function ItemCarrinho({ item, aoRemover, removendo, estaTemaEscuro }) {
  const cardClasse = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)]';
  const textoSecundario = estaTemaEscuro ? 'text-white/55' : 'text-black/50';
  const botaoRemover = estaTemaEscuro
    ? 'text-white/45 hover:bg-white/10 hover:text-[#e74c6f]'
    : 'text-black/40 hover:bg-black/5 hover:text-[#e74c6f]';

  return (
    <motion.li
      variants={itemAnimacao}
      layout
      className={`flex items-center gap-4 rounded-xl p-3 ring-1 ${cardClasse}`}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
        <CapaItem item={item} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {item.categoria && (
          <p className={`truncate text-[11px] font-semibold uppercase tracking-wider ${textoSecundario}`}>{item.categoria}</p>
        )}
        <h3 className="truncate text-sm font-bold leading-tight sm:text-base">{item.nome}</h3>
        {item.empresa && <p className={`truncate text-xs ${textoSecundario}`}>{item.empresa}</p>}
        {item.quantidade > 1 && (
          <p className={`mt-1 text-xs ${textoSecundario}`}>Quantidade: {item.quantidade}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-base font-black sm:text-lg">{formatarMoeda(item.preco * item.quantidade)}</span>
        <button
          type="button"
          onClick={() => aoRemover(item.id)}
          disabled={removendo}
          aria-label={`Remover ${item.nome} do carrinho`}
          title="Remover do carrinho"
          className={`grid h-9 w-9 place-items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] disabled:opacity-40 ${botaoRemover}`}
        >
          <IconeLixeira />
        </button>
      </div>
    </motion.li>
  );
}

function CampoCartao({ id, rotulo, erro, estaTemaEscuro, ...props }) {
  const inputBg = estaTemaEscuro
    ? 'bg-white/8 ring-white/10 text-white placeholder:text-white/30'
    : 'bg-black/4 ring-black/10 text-black placeholder:text-black/30';

  return (
    <div>
      <label htmlFor={id} className={`mb-1.5 block text-xs font-semibold ${estaTemaEscuro ? 'text-white/65' : 'text-black/60'}`}>
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`w-full rounded-lg px-3.5 py-2.5 text-sm font-semibold ring-1 transition focus:outline-none focus:ring-2 focus:ring-[#398ceb] ${inputBg} ${erro ? 'ring-[#e74c6f]' : ''}`}
        {...props}
      />
      {erro && <p id={`${id}-erro`} className="mt-1 text-xs text-[#e74c6f]">{erro}</p>}
    </div>
  );
}

function CompraFinalizada({ compra, estaTemaEscuro }) {
  const textoSecundario = estaTemaEscuro ? 'text-white/60' : 'text-black/55';
  const cardBg = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      className="mx-auto mt-12 flex max-w-xl flex-col items-center text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-[#398ceb] text-white"
      >
        <IconeCheck />
      </motion.span>

      <h1 className="mt-6 text-3xl font-black tracking-tight">Compra realizada!</h1>
      <p className={`mt-2 ${textoSecundario}`}>
        Seu pagamento foi aprovado e os jogos já estão disponíveis na sua biblioteca.
      </p>

      <div className={`mt-8 w-full rounded-xl p-5 text-left ring-1 ${cardBg}`}>
        <h2 className="text-sm font-bold uppercase tracking-wider">Resumo do pedido</h2>
        <ul className="mt-4 space-y-3">
          {compra.itens.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-semibold">
                {item.nome}
                {item.quantidade > 1 && <span className={textoSecundario}> ×{item.quantidade}</span>}
              </span>
              <span className="shrink-0 font-bold">{formatarMoeda(item.preco * item.quantidade)}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-4 flex items-center justify-between border-t pt-4 ${estaTemaEscuro ? 'border-white/10' : 'border-black/10'}`}>
          <span className="font-bold">Total pago</span>
          <span className="text-xl font-black text-[#398ceb]">{formatarMoeda(compra.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          to="/biblioteca"
          className="flex-1 rounded-full bg-[#398ceb] px-6 py-3 text-center font-bold text-white transition hover:bg-[#2a78d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
        >
          Ir para a Biblioteca
        </Link>
        <Link
          to="/loja"
          className={`flex-1 rounded-full border px-6 py-3 text-center font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${
            estaTemaEscuro ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/15 text-black hover:bg-black/5'
          }`}
        >
          Continuar comprando
        </Link>
      </div>
    </motion.div>
  );
}

export default function Checkout() {
  const { dark: estaTemaEscuro } = useTheme();
  const { itens, total, quantidade, carregando, erro, remover, finalizar, recarregar } = useCarrinho();

  const [metodo, setMetodo] = useState('cartao');
  const [form, setForm] = useState({ numeroCartao: '', nomeCartao: '', validade: '', cvv: '' });
  const [errosCampos, setErrosCampos] = useState({});
  const [processando, setProcessando] = useState(false);
  const [removendoId, setRemovendoId] = useState(null);
  const [erroFinalizar, setErroFinalizar] = useState('');
  const [pixCopiado, setPixCopiado] = useState(false);
  const [compra, setCompra] = useState(null);

  const bg = estaTemaEscuro ? 'bg-black' : 'bg-white';
  const textoPrincipal = estaTemaEscuro ? 'text-white' : 'text-black';
  const textoSecundario = estaTemaEscuro ? 'text-white/60' : 'text-black/55';
  const cardBg = estaTemaEscuro
    ? 'bg-[#111] ring-[#aed4ff]/12'
    : 'bg-white ring-black/8 shadow-[0_12px_32px_rgba(57,140,235,0.08)]';

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErrosCampos((atual) => ({ ...atual, [campo]: undefined }));
  }

  async function aoRemover(jogoId) {
    setRemovendoId(jogoId);
    await remover(jogoId);
    setRemovendoId(null);
  }

  async function copiarPix() {
    try {
      await navigator.clipboard.writeText(PIX_CODIGO);
      setPixCopiado(true);
      window.setTimeout(() => setPixCopiado(false), 2500);
    } catch {
      setPixCopiado(false);
    }
  }

  async function aoFinalizar(evento) {
    evento.preventDefault();
    setErroFinalizar('');

    if (metodo === 'cartao') {
      const resultado = esquemaPagamento.safeParse(form);
      if (!resultado.success) {
        setErrosCampos(coletarErros(resultado.error));
        return;
      }
      setErrosCampos({});
    }

    const snapshot = { itens, total };
    setProcessando(true);
    try {
      // Simula o processamento do pagamento antes de gerar a venda na API.
      await new Promise((resolve) => window.setTimeout(resolve, 1300));
      await finalizar();
      setCompra(snapshot);
    } catch (err) {
      setErroFinalizar(err.response?.data?.message || 'Não foi possível finalizar a compra. Tente novamente.');
    } finally {
      setProcessando(false);
    }
  }

  const botaoMetodoBase = 'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]';
  const botaoMetodoAtivo = 'bg-[#398ceb] text-white';
  const botaoMetodoInativo = estaTemaEscuro
    ? 'bg-white/8 text-white/70 hover:bg-white/12'
    : 'bg-black/5 text-black/60 hover:bg-black/8';

  return (
    <main className={`min-h-screen ${bg} ${textoPrincipal}`}>
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to="/loja"
            className={`grid h-10 w-10 place-items-center rounded-full transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${estaTemaEscuro ? 'bg-white/10 hover:bg-white/15' : 'bg-black/5 hover:bg-black/10'}`}
            aria-label="Voltar para a loja"
          >
            <IconeSetaEsquerda />
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Finalizar compra</h1>
          {!compra && quantidade > 0 && (
            <span className={`ml-auto rounded-full px-3 py-1 text-sm font-bold ${estaTemaEscuro ? 'bg-white/10' : 'bg-black/5'}`}>
              {quantidade} {quantidade === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>

        {/* Compra finalizada */}
        {compra && <CompraFinalizada compra={compra} estaTemaEscuro={estaTemaEscuro} />}

        {/* Loading */}
        {!compra && carregando && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-24 animate-pulse rounded-xl ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} />
              ))}
            </div>
            <div className={`h-72 animate-pulse rounded-xl ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} />
          </div>
        )}

        {/* Erro ao carregar */}
        {!compra && !carregando && erro && (
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

        {/* Carrinho vazio */}
        {!compra && !carregando && !erro && itens.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <span className={`text-6xl ${textoSecundario}`} aria-hidden="true">🛒</span>
            <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
            <p className={textoSecundario}>Adicione jogos ao carrinho na loja para finalizar uma compra.</p>
            <Link
              to="/loja"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#398ceb] px-6 py-3 font-bold text-white transition hover:bg-[#2a78d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb]"
            >
              Explorar Loja
            </Link>
          </div>
        )}

        {/* Conteúdo do checkout */}
        {!compra && !carregando && !erro && itens.length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
            {/* Coluna esquerda: itens + pagamento */}
            <div className="min-w-0">
              <section aria-labelledby="titulo-itens">
                <h2 id="titulo-itens" className="text-lg font-bold">Itens do carrinho</h2>
                <motion.ul
                  variants={gridAnimacao}
                  initial="hidden"
                  animate="show"
                  className="mt-4 space-y-3"
                >
                  {itens.map((item) => (
                    <ItemCarrinho
                      key={item.id}
                      item={item}
                      aoRemover={aoRemover}
                      removendo={removendoId === item.id}
                      estaTemaEscuro={estaTemaEscuro}
                    />
                  ))}
                </motion.ul>
              </section>

              <section aria-labelledby="titulo-pagamento" className="mt-10">
                <h2 id="titulo-pagamento" className="text-lg font-bold">Pagamento</h2>

                {/* Seletor de método */}
                <div className={`mt-4 flex gap-2 rounded-full p-1 ${estaTemaEscuro ? 'bg-white/8' : 'bg-black/5'}`} role="tablist" aria-label="Forma de pagamento">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={metodo === 'cartao'}
                    onClick={() => setMetodo('cartao')}
                    className={`${botaoMetodoBase} ${metodo === 'cartao' ? botaoMetodoAtivo : botaoMetodoInativo}`}
                  >
                    <IconeCartao /> Cartão
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={metodo === 'pix'}
                    onClick={() => setMetodo('pix')}
                    className={`${botaoMetodoBase} ${metodo === 'pix' ? botaoMetodoAtivo : botaoMetodoInativo}`}
                  >
                    <IconePix /> Pix
                  </button>
                </div>

                <form id="form-pagamento" onSubmit={aoFinalizar} className={`mt-4 rounded-xl p-5 ring-1 ${cardBg}`}>
                  {metodo === 'cartao' ? (
                    <div className="grid gap-4">
                      <CampoCartao
                        id="numeroCartao"
                        rotulo="Número do cartão"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="0000 0000 0000 0000"
                        value={form.numeroCartao}
                        onChange={(e) => atualizarCampo('numeroCartao', mascararNumeroCartao(e.target.value))}
                        erro={errosCampos.numeroCartao}
                        estaTemaEscuro={estaTemaEscuro}
                      />
                      <CampoCartao
                        id="nomeCartao"
                        rotulo="Nome impresso no cartão"
                        autoComplete="cc-name"
                        placeholder="Como está no cartão"
                        value={form.nomeCartao}
                        onChange={(e) => atualizarCampo('nomeCartao', e.target.value)}
                        erro={errosCampos.nomeCartao}
                        estaTemaEscuro={estaTemaEscuro}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <CampoCartao
                          id="validade"
                          rotulo="Validade"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/AA"
                          value={form.validade}
                          onChange={(e) => atualizarCampo('validade', mascararValidade(e.target.value))}
                          erro={errosCampos.validade}
                          estaTemaEscuro={estaTemaEscuro}
                        />
                        <CampoCartao
                          id="cvv"
                          rotulo="CVV"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="000"
                          maxLength={4}
                          value={form.cvv}
                          onChange={(e) => atualizarCampo('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          erro={errosCampos.cvv}
                          estaTemaEscuro={estaTemaEscuro}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="grid h-44 w-44 place-items-center rounded-xl bg-white p-3 ring-1 ring-black/10">
                        <svg viewBox="0 0 100 100" className="h-full w-full text-black" fill="currentColor" aria-hidden="true">
                          <path d="M10 10h25v25H10zM15 15v15h15V15zM65 10h25v25H65zM70 15v15h15V15zM10 65h25v25H10zM15 70v15h15V70zM45 10h10v10H45zM45 25h10v20H45zM10 45h20v10H10zM40 45h15v10H40zM65 45h25v10H65zM45 60h10v30H45zM60 60h10v10H60zM75 60h15v10H75zM60 75h10v15H60zM75 75h15v15H75z" />
                        </svg>
                      </div>
                      <p className={`mt-4 text-sm font-semibold ${textoSecundario}`}>
                        Aponte a câmera ou use o código copia e cola
                      </p>
                      <div className={`mt-3 w-full rounded-lg px-3 py-2.5 text-left text-xs break-all ${estaTemaEscuro ? 'bg-white/8 text-white/70' : 'bg-black/5 text-black/60'}`}>
                        {PIX_CODIGO}
                      </div>
                      <button
                        type="button"
                        onClick={copiarPix}
                        className={`mt-3 rounded-full px-5 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] ${estaTemaEscuro ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/5 text-black hover:bg-black/10'}`}
                      >
                        {pixCopiado ? 'Código copiado!' : 'Copiar código Pix'}
                      </button>
                    </div>
                  )}

                  <p className={`mt-4 flex items-center justify-center gap-1.5 text-xs ${textoSecundario}`}>
                    <IconeCadeado /> Ambiente de simulação — nenhum dado de pagamento é cobrado.
                  </p>
                </form>
              </section>
            </div>

            {/* Coluna direita: resumo */}
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className={`rounded-xl p-5 ring-1 ${cardBg}`}>
                <h2 className="text-lg font-bold">Resumo do pedido</h2>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className={textoSecundario}>Subtotal ({quantidade} {quantidade === 1 ? 'item' : 'itens'})</dt>
                    <dd className="font-semibold">{formatarMoeda(total)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className={textoSecundario}>Taxa de serviço</dt>
                    <dd className="font-semibold text-[#398ceb]">Grátis</dd>
                  </div>
                </dl>

                <div className={`mt-4 flex items-center justify-between border-t pt-4 ${estaTemaEscuro ? 'border-white/10' : 'border-black/10'}`}>
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-[#398ceb]">{formatarMoeda(total)}</span>
                </div>

                {erroFinalizar && (
                  <p className="mt-4 rounded-lg bg-[#e74c6f]/10 px-3 py-2 text-center text-sm text-[#e74c6f]" role="alert">
                    {erroFinalizar}
                  </p>
                )}

                <button
                  type="submit"
                  form="form-pagamento"
                  disabled={processando}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#398ceb] px-6 py-3.5 font-bold text-white transition hover:bg-[#2a78d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#398ceb] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processando ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                      Processando...
                    </>
                  ) : (
                    <>Pagar {formatarMoeda(total)}</>
                  )}
                </button>

                <p className={`mt-3 flex items-center justify-center gap-1.5 text-xs ${textoSecundario}`}>
                  <IconeCadeado /> Pagamento protegido
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
