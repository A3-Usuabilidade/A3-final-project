import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../componentes/Logo.jsx';
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

function IconeCarrinho() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function IconeUsuario() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function IconeTema() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </svg>
  );
}

function IconeEstrela({ ativa = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${ativa ? 'text-[#ffd84d]' : 'text-white/24'}`}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2.8 2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.84l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" />
    </svg>
  );
}

function AvaliacaoEstrelas() {
  return (
    <div className="mt-2 flex items-center gap-1.5" aria-label="Nota 4 de 5">
      {[0, 1, 2, 3].map((item) => (
        <IconeEstrela key={item} ativa />
      ))}
      <IconeEstrela />
      <span className="ml-2 text-base font-bold text-white">4.0</span>
    </div>
  );
}

function CapaJogo({ jogo, className = '' }) {
  if (jogo.capa) {
    return <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#4da3ff_0,#1f5b99_26%,#111827_66%,#05070a_100%)] ${className}`}>
      <span className="text-4xl font-black tracking-[0.08em] text-white/90">{obterIniciais(jogo.nome)}</span>
    </div>
  );
}

function NavbarLoja({ busca, setBusca, quantidadeCarrinho, alternarTema }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 pt-8 sm:gap-3">
      <Link
        to="/loja"
        aria-label="Ir para a loja Nexus"
        className="flex h-11 items-center gap-2 rounded-full bg-white px-5 text-black shadow-[0_8px_24px_rgba(77,163,255,0.25)] outline-none ring-1 ring-black/5 transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#4da3ff]"
      >
        <Logo className="h-6 w-6" />
        <span className="text-base font-black">NEXUS</span>
      </Link>

      <label className="flex h-11 min-w-0 flex-1 max-w-lg items-center gap-3 rounded-full bg-white px-5 text-black shadow-[0_8px_24px_rgba(77,163,255,0.25)] ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#4da3ff]">
        <span className="sr-only">Buscar jogos</span>
        <IconeBusca />
        <input
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar jogos..."
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-black placeholder:text-black/70 focus:outline-none"
        />
      </label>

      <div className="flex h-11 items-center rounded-full bg-white p-1 text-black shadow-[0_8px_24px_rgba(77,163,255,0.25)] ring-1 ring-black/5">
        <button
          type="button"
          onClick={alternarTema}
          aria-label="Mudar tema"
          title="Mudar tema"
          className="grid h-9 w-9 place-items-center rounded-full text-black transition duration-200 hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
        >
          <IconeTema />
        </button>
        <Link
          to="/checkout"
          aria-label={`Abrir carrinho com ${quantidadeCarrinho} item(ns)`}
          title="Abrir carrinho"
          className="relative grid h-9 w-9 place-items-center rounded-full text-black transition duration-200 hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
        >
          <IconeCarrinho />
          {quantidadeCarrinho > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#4da3ff] px-1 text-[10px] font-bold text-black">
              {quantidadeCarrinho}
            </span>
          )}
        </Link>
        <Link
          to="/perfil"
          aria-label="Abrir perfil"
          title="Perfil"
          className="grid h-9 w-9 place-items-center rounded-full text-black transition duration-200 hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
        >
          <IconeUsuario />
        </Link>
      </div>
    </header>
  );
}

function CardJogo({ jogo, aoSelecionar, aoAdicionar }) {
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
      className="group flex h-full min-h-[338px] cursor-pointer flex-col overflow-hidden rounded-lg bg-[#191919] shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:ring-[#4da3ff]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4da3ff]"
    >
      <div className="block aspect-[4/3.15] w-full shrink-0 overflow-hidden text-left">
        <CapaJogo jogo={jogo} className="transition duration-300 group-hover:scale-105" />
      </div>
      <div className="grid min-h-[144px] flex-1 grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
        <div className="flex min-w-0 flex-col text-left">
          <p className="text-sm font-medium leading-none text-white/70">{jogo.categoria}</p>
          <h3 className="product-card-title mt-2 text-base font-semibold leading-tight text-white">{jogo.nome}</h3>
          <p className="mt-2 truncate text-sm font-medium text-white/58">{jogo.empresa}</p>
          <p className="mt-auto pt-4 text-lg font-black leading-none text-white">{formatarMoeda(jogo.preco)}</p>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            aoAdicionar(jogo);
          }}
          aria-label={`Adicionar ${jogo.nome} ao carrinho`}
          title="Adicionar ao carrinho"
          className="grid h-12 w-12 self-end place-items-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
        >
          <IconeCarrinho />
        </button>
      </div>
    </motion.article>
  );
}

function ModalDetalhes({ jogo, aoFechar, aoAdicionar }) {
  useEffect(() => {
    function fecharComEsc(event) {
      if (event.key === 'Escape') aoFechar();
    }

    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [aoFechar]);

  if (!jogo) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-detalhe-jogo">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar modal" onClick={aoFechar} />
      <section className="relative grid w-full max-w-4xl gap-6 rounded-lg bg-[#080808] p-4 text-white shadow-2xl ring-1 ring-white/10 md:grid-cols-[0.95fr_1.05fr]">
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar detalhes"
          className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4da3ff]"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="overflow-hidden rounded-lg">
          <CapaJogo jogo={jogo} className="aspect-[4/5] md:aspect-[4/4.7]" />
        </div>
        <div className="flex min-w-0 flex-col justify-center pr-2 md:pr-10">
          <p className="text-sm font-semibold text-[#4da3ff]">{jogo.categoria} - {jogo.empresa}</p>
          <h2 id="titulo-detalhe-jogo" className="mt-2 text-3xl font-black leading-none md:text-4xl">{jogo.nome}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Ano</p>
              <p className="mt-1 text-lg font-semibold text-white">{jogo.ano || 'Nao informado'}</p>
            </div>
            <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Preco</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatarMoeda(jogo.preco)}</p>
            </div>
            <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Empresa</p>
              <p className="mt-1 text-base font-semibold text-white">{jogo.empresa}</p>
            </div>
            <div className="rounded-lg bg-white/7 p-4 ring-1 ring-white/10">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Categoria</p>
              <p className="mt-1 text-base font-semibold text-white">{jogo.categoria}</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg bg-white/8 p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase text-white/65">Nota</p>
            <AvaliacaoEstrelas />
          </div>
          <div className="mt-5 rounded-lg bg-white/5 p-4 ring-1 ring-white/8">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Descricao</p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{jogo.descricao || 'Descricao indisponivel na API.'}</p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => aoAdicionar(jogo)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black transition hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
            >
              Adicionar ao carrinho <IconeCarrinho />
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 px-5 py-3 font-bold text-white transition hover:border-[#4da3ff] hover:text-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
            >
              Lista de desejos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Loja() {
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState(categoriaPadrao);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroCarrinho, setErroCarrinho] = useState('');
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]);

  async function carregarDados() {
    setCarregando(true);
    setErro('');

    try {
      const [respostaJogosPublicos, respostaJogosAutenticados, respostaCategorias, respostaCarrinho] = await Promise.all([
        api.get('/public/jogos'),
        api.get('/jogos'),
        api.get('/categorias').catch(() => ({ data: [] })),
        api.get('/carrinho/ativo').catch(() => ({ data: null })),
      ]);

      const jogosPublicos = obterListaApi(respostaJogosPublicos.data).map(normalizarJogo);
      const jogosAutenticados = obterListaApi(respostaJogosAutenticados.data).map(normalizarJogo);
      const jogosComIds = juntarJogosComIds(jogosPublicos, jogosAutenticados);
      const categoriasApi = obterListaApi(respostaCategorias.data).map(normalizarCategoria);

      setJogos(jogosComIds);
      setCategorias(['Todos', ...new Set([...categoriasApi, ...jogosComIds.map((jogo) => jogo.categoria)])].filter(Boolean));
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

  function alternarTema() {
    const raiz = document.documentElement;
    const proximoTema = raiz.classList.contains('dark') ? 'light' : 'dark';
    raiz.classList.toggle('dark', proximoTema === 'dark');
    localStorage.setItem('theme', proximoTema);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      <section className="nexus-store-bg relative min-h-screen overflow-hidden px-5 pb-12">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.14))]" aria-hidden="true" />
        <div className="relative">
          <NavbarLoja
            busca={busca}
            setBusca={setBusca}
            quantidadeCarrinho={quantidadeCarrinho}
            alternarTema={alternarTema}
          />

          <div className="mx-auto mt-24 max-w-6xl">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categorias.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  onClick={() => setCategoriaAtiva(categoria)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    categoriaAtiva === categoria
                      ? 'bg-white text-black ring-white'
                      : 'bg-[#111417] text-white ring-white/22 hover:bg-[#181d22] hover:ring-white/35'
                  }`}
                >
                  {categoria}
                </button>
              ))}
            </div>

            {erro && (
              <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 rounded-lg border border-[#4da3ff]/30 bg-[#4da3ff]/10 px-4 py-4 text-center text-sm text-white/85">
                <p>{erro}</p>
                <button
                  type="button"
                  onClick={carregarDados}
                  className="rounded-full bg-white px-4 py-2 font-bold text-black transition hover:bg-[#4da3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4da3ff]"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {erroCarrinho && (
              <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-red-300/30 bg-red-500/12 px-4 py-3 text-center text-sm text-white">
                {erroCarrinho}
              </p>
            )}

            {carregando ? (
              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-lg bg-white/10" />
                ))}
              </div>
            ) : jogosFiltrados.length ? (
              <motion.div
                key={`${categoriaAtiva}-${busca}`}
                variants={gridAnimacao}
                initial="hidden"
                animate="show"
                className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {jogosFiltrados.map((jogo) => (
                  <CardJogo
                    key={jogo.id || jogo.nome}
                    jogo={jogo}
                    aoSelecionar={setJogoSelecionado}
                    aoAdicionar={adicionarAoCarrinho}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="mt-16 rounded-lg border border-white/10 bg-white/6 p-10 text-center">
                <h2 className="text-2xl font-black">Nenhum jogo encontrado</h2>
                <p className="mt-2 text-white/70">Tente outra busca ou selecione uma categoria diferente.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ModalDetalhes jogo={jogoSelecionado} aoFechar={() => setJogoSelecionado(null)} aoAdicionar={adicionarAoCarrinho} />
    </main>
  );
}
