import { useState } from 'react';
import { Heart, Trash2, ShoppingCart, Search, HeartOff } from 'lucide-react';
import useWishlist from '../hooks/useWishlist.js';

export default function Wishlist() {
  const { itens, carregando, erro, removerJogo } = useWishlist();
  const [filtro, setFiltro] = useState('');
  const [removendo, setRemovendo] = useState(null);

  const handleRemover = async (jogoId) => {
    setRemovendo(jogoId);
    try {
      await removerJogo(jogoId);
    } catch {
      alert('Erro ao remover da lista de desejos.');
    } finally {
      setRemovendo(null);
    }
  };

  const itensFiltrados = filtro
    ? itens.filter((item) => {
        const nome = item.nome || item.jogo?.nome || '';
        return nome.toLowerCase().includes(filtro.toLowerCase());
      })
    : itens;

  if (carregando) {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-on-surface-variant text-center py-20">
            Carregando lista de desejos...
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
              <Heart size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Lista de Desejos</h1>
              <p className="text-on-surface-variant text-sm">
                {itens.length} jogo{itens.length !== 1 ? 's' : ''} na sua lista
              </p>
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Buscar na lista..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-surface-container border border-outline-variant rounded-xl pl-9 pr-4 py-2.5 text-on-surface text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Buscar jogos na lista de desejos"
            />
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="text-error text-sm bg-error-container/20 border border-error-container rounded-lg p-3">
            {erro}
          </div>
        )}

        {/* Lista */}
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <HeartOff size={48} className="mx-auto text-outline-variant mb-4" />
            <p className="text-on-surface-variant text-lg font-medium">
              {filtro ? 'Nenhum jogo encontrado' : 'Sua lista de desejos está vazia'}
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              {filtro ? 'Tente outro termo de busca.' : 'Explore a loja e adicione jogos que você deseja!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {itensFiltrados.map((item) => {
              const jogo = item.jogo || item;
              const id = jogo.id || item.jogoId || item.fkJogo;
              const nome = jogo.nome || 'Jogo desconhecido';
              const preco = jogo.preco;
              const desconto = jogo.desconto;
              const precoFinal = desconto
                ? (Number(preco) * (1 - Number(desconto) / 100)).toFixed(2)
                : Number(preco || 0).toFixed(2);

              return (
                <article
                  key={id}
                  className="bg-surface-container border border-outline-variant rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-outline group"
                  aria-label={`Jogo desejado: ${nome}`}
                >
                  {/* Info do jogo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-on-surface font-semibold text-base truncate">{nome}</h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {jogo.ano && (
                        <span className="text-on-surface-variant text-xs">{jogo.ano}</span>
                      )}
                      {(jogo.categoria || jogo.nomeCategoria) && (
                        <span className="bg-surface-container-high text-on-surface-variant text-xs font-medium px-2 py-0.5 rounded-full">
                          {jogo.categoria || jogo.nomeCategoria}
                        </span>
                      )}
                      {(jogo.empresa || jogo.nomeEmpresa) && (
                        <span className="text-on-surface-variant text-xs">
                          {jogo.empresa || jogo.nomeEmpresa}
                        </span>
                      )}
                    </div>
                    {jogo.descricao && (
                      <p className="text-on-surface-variant text-sm mt-2 line-clamp-1">
                        {jogo.descricao}
                      </p>
                    )}
                  </div>

                  {/* Preço */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      {desconto > 0 && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold px-1.5 py-0.5 rounded">
                            -{desconto}%
                          </span>
                          <span className="text-on-surface-variant text-xs line-through">
                            R$ {Number(preco).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {preco && (
                        <span className="text-on-surface font-bold text-lg">
                          R$ {precoFinal}
                        </span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemover(id)}
                        disabled={removendo === id}
                        title="Remover da lista de desejos"
                        className="text-on-surface-variant hover:text-error border border-outline-variant hover:border-error/40 rounded-lg p-2.5 transition-all cursor-pointer disabled:opacity-50 hover:bg-error/5"
                        aria-label={`Remover ${nome} da lista de desejos`}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        title="Adicionar ao carrinho"
                        className="bg-primary text-on-primary rounded-lg p-2.5 transition cursor-pointer hover:brightness-90"
                        aria-label={`Adicionar ${nome} ao carrinho`}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
