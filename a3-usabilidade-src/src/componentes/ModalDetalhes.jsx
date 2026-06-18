import { useEffect, useState } from 'react';
import useAvaliacoes from '../hooks/useAvaliacoes.js';
import CapaJogo from './CapaJogo.jsx';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
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

function IconeCarrinho() {
  return (
    <svg
      viewBox="0 0 26 26"
      className="h-5 w-5 shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.908 14.3C19.8826 14.3 20.7403 13.767 21.1821 12.961L25.8344 4.524C26.3152 3.666 25.6915 2.6 24.7038 2.6H5.47097L4.24942 0H0V2.6H2.59903L7.2773 12.467L5.52295 15.639C4.5743 17.381 5.82184 19.5 7.7971 19.5H23.3913V16.9H7.7971L9.22657 14.3H18.908ZM6.70551 5.2H22.4946L18.908 11.7H9.78537L6.70551 5.2ZM7.7971 20.8C6.36764 20.8 5.21106 21.97 5.21106 23.4C5.21106 24.83 6.36764 26 7.7971 26C9.22657 26 10.3961 24.83 10.3961 23.4C10.3961 21.97 9.22657 20.8 7.7971 20.8ZM20.7923 20.8C19.3628 20.8 18.2062 21.97 18.2062 23.4C18.2062 24.83 19.3628 26 20.7923 26C22.2217 26 23.3913 24.83 23.3913 23.4C23.3913 21.97 22.2217 20.8 20.7923 20.8Z" />
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

export default function ModalDetalhes({ jogo, aoFechar, aoAdicionar, desejado, aoAlternarDesejo, abaInicial = 'detalhes', aoAtualizar }) {
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
    const eraEdicao = !!minhaAvaliacao;
    try {
      await enviar(jogo.id, notaForm, comentarioForm);
      setMsgSucesso(eraEdicao ? 'Avaliação atualizada!' : 'Avaliação enviada!');
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

          <div className="mt-5 flex gap-1 rounded-full bg-white/8 p-1">
            <button type="button" onClick={() => setAba('detalhes')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${aba === 'detalhes' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>Detalhes</button>
            <button type="button" onClick={() => setAba('avaliacoes')} className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${aba === 'avaliacoes' ? 'bg-white text-black' : 'text-white/70 hover:text-white'}`}>
              Avaliações {total > 0 && <span className="ml-1 text-xs opacity-70">({total})</span>}
            </button>
          </div>

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

          {aba === 'avaliacoes' && (
            <div className="mt-4 flex flex-1 flex-col overflow-y-auto" style={{ maxHeight: '420px' }}>
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

              <div className="mt-4 flex items-center gap-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/8">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#f59e0b]">{media ? media.toFixed(1) : '—'}</p>
                  <p className="text-xs text-white/50">{total} {total === 1 ? 'avaliação' : 'avaliações'}</p>
                </div>
                <div className="flex-1">
                  <AvaliacaoEstrelas media={media} total={total} />
                </div>
              </div>

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
