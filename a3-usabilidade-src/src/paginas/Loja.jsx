import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CapaJogo from '../componentes/CapaJogo.jsx';
import ModalDetalhes from '../componentes/ModalDetalhes.jsx';
import NavbarLoja from '../componentes/NavbarLoja.jsx';
import useTheme from '../hooks/useTheme.js';
import useWishlist from '../hooks/useWishlist.js';
import useCarrinho from '../hooks/useCarrinho.js';
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

function normalizarCategoria(categoria) {
  return (categoria.nome || categoria.categoria || categoria.name || String(categoria)).trim();
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

export default function Loja() {
  const { dark: estaTemaEscuro } = useTheme();
  const { estaDesejado, alternar: alternarDesejo } = useWishlist();
  const { quantidade: quantidadeCarrinho, erro: erroCarrinho, adicionar } = useCarrinho();
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState(categoriaPadrao);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [filtroMobileAberto, setFiltroMobileAberto] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    setErro('');

    try {
      const [respostaJogosPublicos, respostaJogosAutenticados] = await Promise.all([
        api.get('/public/jogos'),
        api.get('/jogos'),
      ]);

      const jogosPublicos = obterListaApi(respostaJogosPublicos.data).map(normalizarJogo);
      const jogosAutenticados = obterListaApi(respostaJogosAutenticados.data).map(normalizarJogo);
      const jogosComIds = juntarJogosComIds(jogosPublicos, jogosAutenticados);
      const categoriasCatalogo = [...new Set(jogosComIds.map((jogo) => normalizarCategoria(jogo.categoria)).filter(Boolean))];

      setJogos(jogosComIds);
      setCategorias(['Todos', ...categoriasCatalogo]);
    } catch {
      setJogos([]);
      setCategorias(categoriaPadrao);
      setErro('Nao foi possivel carregar os jogos da API. Verifique se o backend esta rodando e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarDados(); }, []);

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

  async function adicionarAoCarrinho(jogo) {
    await adicionar(jogo.id);
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
