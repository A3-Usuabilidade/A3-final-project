import { useState, useCallback } from 'react';
import { Library, Key, Copy, Check, ChevronDown, ChevronUp, Star, Package, Heart } from 'lucide-react';
import useBiblioteca from '../hooks/useBiblioteca.js';
import useAvaliacoes from '../hooks/useAvaliacoes.js';
import useWishlist from '../hooks/useWishlist.js';

function EstrelaInterativa({ nota, setNota, tamanho = 20, desabilitado = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label="Nota do jogo">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={desabilitado}
          onClick={() => setNota(i)}
          onMouseEnter={() => !desabilitado && setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer disabled:cursor-default transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
          aria-label={`${i} estrela${i > 1 ? 's' : ''}`}
        >
          <Star
            size={tamanho}
            className={`transition-colors duration-200 ${
              i <= (hover || nota)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-outline-variant'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function EstrelaEstatica({ nota, tamanho = 16 }) {
  return (
    <div className="flex gap-0.5" aria-label={`Nota: ${nota} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={tamanho}
          className={`transition-colors ${
            i <= Math.round(nota)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-outline-variant'
          }`}
        />
      ))}
    </div>
  );
}

function BotaoCopiar({ texto }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* fallback silencioso */
    }
  };

  return (
    <button
      onClick={copiar}
      title="Copiar chave"
      className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1 rounded hover:bg-surface-container-high"
      aria-label="Copiar chave de ativação"
    >
      {copiado ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}

function CardJogoBiblioteca({ venda, jogo, chaves, onAvaliar, ehFavorito, onToggleFavorito }) {
  const [expandido, setExpandido] = useState(false);

  const dataCompra = venda?.dataVenda
    ? new Date(venda.dataVenda).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  return (
    <article
      className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-outline"
      aria-label={`Jogo: ${jogo?.nome || 'Desconhecido'}`}
    >
      {/* Header do card */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-on-surface font-semibold text-base truncate">
              {jogo?.nome || 'Jogo desconhecido'}
            </h3>
            <p className="text-on-surface-variant text-xs mt-1">
              Comprado em {dataCompra}
            </p>
          </div>
          <span className="shrink-0 bg-surface-container-high text-on-surface-variant text-xs font-medium px-2.5 py-1 rounded-full">
            {jogo?.categoria || jogo?.nomeCategoria || '—'}
          </span>
        </div>

        {jogo?.descricao && (
          <p className="text-on-surface-variant text-sm mt-3 line-clamp-2">
            {jogo.descricao}
          </p>
        )}
      </div>

      {/* Chaves de ativação */}
      {chaves && chaves.length > 0 && (
        <div className="px-5 pb-3">
          <button
            onClick={() => setExpandido(!expandido)}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer w-full"
            aria-expanded={expandido}
          >
            <Key size={14} />
            <span className="font-medium">{chaves.length} chave{chaves.length > 1 ? 's' : ''} de ativação</span>
            {expandido ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expandido && (
            <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
              {chaves.map((chave, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-surface-container-high rounded-lg px-3 py-2"
                >
                  <code className="flex-1 text-xs text-on-surface font-mono tracking-wider select-all">
                    {chave.codigo || chave.chave || chave}
                  </code>
                  <BotaoCopiar texto={chave.codigo || chave.chave || chave} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer com ação de avaliar */}
      <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low/50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {jogo?.precoOriginal || jogo?.preco ? (
            <span className="text-sm font-semibold text-on-surface">
              R$ {Number(jogo.precoOriginal || jogo.preco).toFixed(2)}
            </span>
          ) : null}
        </div>
        <button
          onClick={() => onAvaliar(jogo)}
          className="text-xs font-medium text-primary hover:text-on-surface border border-primary/30 hover:border-primary rounded-lg px-3 py-1.5 transition-all cursor-pointer hover:bg-primary/5"
        >
          Avaliar
        </button>
        <button
          onClick={() => onToggleFavorito && onToggleFavorito(jogo)}
          className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-surface-container-high"
          aria-label={ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={16} className={`transition ${ehFavorito ? 'fill-red-500 text-red-500' : 'text-on-surface-variant'}`} />
        </button>
      </div>
    </article>
  );
}

function ModalAvaliacao({ jogo, onFechar, onSalvar }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroLocal, setErroLocal] = useState(null);

  const handleSalvar = async () => {
    if (nota === 0) {
      setErroLocal('Selecione uma nota de 1 a 5.');
      return;
    }
    setSalvando(true);
    setErroLocal(null);
    try {
      await onSalvar(jogo.id || jogo.jogoId, nota, comentario);
      onFechar();
    } catch (err) {
      setErroLocal(err.response?.data?.message || 'Erro ao enviar avaliação.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-avaliar-titulo">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative bg-surface-container border border-outline-variant rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <h3 id="modal-avaliar-titulo" className="text-lg font-semibold text-on-surface">
          Avaliar: {jogo?.nome}
        </h3>

        <div className="space-y-2">
          <label className="text-sm text-on-surface-variant">Sua nota</label>
          <EstrelaInterativa nota={nota} setNota={setNota} tamanho={28} />
        </div>

        <div className="space-y-2">
          <label htmlFor="comentario-avaliacao" className="text-sm text-on-surface-variant">
            Comentário (opcional)
          </label>
          <textarea
            id="comentario-avaliacao"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="O que achou do jogo?"
            rows={4}
            className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {erroLocal && (
          <p className="text-error text-sm bg-error-container/20 border border-error-container rounded-lg p-2">
            {erroLocal}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex-1 bg-primary text-on-primary font-semibold rounded-lg py-2.5 transition cursor-pointer hover:brightness-90 disabled:opacity-50"
          >
            {salvando ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
          <button
            onClick={onFechar}
            className="flex-1 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg py-2.5 font-medium cursor-pointer hover:brightness-90 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Biblioteca() {
  const { compras, carregando, erro } = useBiblioteca();
  const { criarAvaliacao } = useAvaliacoes();
  const { itens: favoritos, adicionarJogo: addFav, removerJogo: rmFav } = useWishlist();
  const [jogoAvaliar, setJogoAvaliar] = useState(null);
  const [filtro, setFiltro] = useState('');

  const ehFavorito = useCallback((id) => favoritos.some(f => f.id === id), [favoritos]);
  const toggleFavorito = useCallback(async (jogo) => {
    const id = jogo?.id || jogo?.jogoId;
    if (!id) return;
    try { if (ehFavorito(id)) await rmFav(id); else await addFav(id); } catch {}
  }, [ehFavorito, addFav, rmFav]);

  // Normalizar os dados de compras em uma lista plana de jogos
  const jogosComprados = (compras || []).flatMap((compra) => {
    if (compra.itens) {
      return compra.itens.map((item) => ({
        venda: compra,
        jogo: item.jogo || item,
        chaves: item.chaves || item.chavesAtivacao || [],
      }));
    }
    // Se a API retorna diretamente o jogo
    return [{
      venda: compra,
      jogo: compra.jogo || compra,
      chaves: compra.chaves || compra.chavesAtivacao || [],
    }];
  });

  const jogosFiltrados = filtro
    ? jogosComprados.filter((j) =>
        (j.jogo?.nome || '').toLowerCase().includes(filtro.toLowerCase())
      )
    : jogosComprados;

  if (carregando) {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-on-surface-variant text-center py-20">
            Carregando sua biblioteca...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <Library size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Minha Biblioteca</h1>
              <p className="text-on-surface-variant text-sm">
                {jogosComprados.length} jogo{jogosComprados.length !== 1 ? 's' : ''} na sua coleção
              </p>
            </div>
          </div>

          <input
            type="search"
            placeholder="Buscar na biblioteca..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Buscar jogos na biblioteca"
          />
        </div>

        {/* Erro */}
        {erro && (
          <div className="text-error text-sm bg-error-container/20 border border-error-container rounded-lg p-3">
            {erro}
          </div>
        )}

        {/* Lista de jogos */}
        {jogosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-outline-variant mb-4" />
            <p className="text-on-surface-variant text-lg font-medium">
              {filtro ? 'Nenhum jogo encontrado' : 'Sua biblioteca está vazia'}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              {filtro ? 'Tente outro termo de busca.' : 'Compre jogos na loja para vê-los aqui!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jogosFiltrados.map((item, idx) => (
              <CardJogoBiblioteca
                key={item.jogo?.id || idx}
                venda={item.venda}
                jogo={item.jogo}
                chaves={item.chaves}
                onAvaliar={setJogoAvaliar}
                ehFavorito={ehFavorito(item.jogo?.id || item.jogo?.jogoId)}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        )}

        {/* Modal de avaliação */}
        {jogoAvaliar && (
          <ModalAvaliacao
            jogo={jogoAvaliar}
            onFechar={() => setJogoAvaliar(null)}
            onSalvar={criarAvaliacao}
          />
        )}
      </div>
    </div>
  );
}

export { EstrelaEstatica, EstrelaInterativa };
