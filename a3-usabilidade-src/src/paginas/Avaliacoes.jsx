import { useState, useEffect } from 'react';
import { MessageSquare, Star, Edit3, Send, Filter } from 'lucide-react';
import useAvaliacoes from '../hooks/useAvaliacoes.js';
import useAuth from '../hooks/useAuth.js';
import api from '../servicos/api.js';
import { EstrelaEstatica, EstrelaInterativa } from './Biblioteca.jsx';

export default function Avaliacoes() {
  const { usuario } = useAuth();
  const {
    avaliacoes,
    resumo,
    carregando,
    erro,
    buscarAvaliacoes,
    criarAvaliacao,
    editarAvaliacao,
  } = useAvaliacoes();

  const [jogos, setJogos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [carregandoJogos, setCarregandoJogos] = useState(true);

  // Form nova avaliação
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // Edição
  const [editandoId, setEditandoId] = useState(null);
  const [editNota, setEditNota] = useState(0);
  const [editComentario, setEditComentario] = useState('');

  // Filtro
  const [filtroNota, setFiltroNota] = useState(0);

  useEffect(() => {
    const carregarJogos = async () => {
      try {
        const { data } = await api.get('/jogos');
        setJogos(data);
      } catch {
        /* silencioso */
      } finally {
        setCarregandoJogos(false);
      }
    };
    carregarJogos();
  }, []);

  const selecionarJogo = (jogo) => {
    setJogoSelecionado(jogo);
    buscarAvaliacoes(jogo.id);
    setNota(0);
    setComentario('');
    setErroForm(null);
    setSucesso(null);
    setEditandoId(null);
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!jogoSelecionado) return;
    if (nota === 0) {
      setErroForm('Selecione uma nota de 1 a 5.');
      return;
    }
    setEnviando(true);
    setErroForm(null);
    setSucesso(null);
    try {
      await criarAvaliacao(jogoSelecionado.id, nota, comentario);
      setSucesso('Avaliação enviada com sucesso!');
      setNota(0);
      setComentario('');
      buscarAvaliacoes(jogoSelecionado.id);
    } catch (err) {
      setErroForm(err.response?.data?.message || 'Erro ao enviar avaliação.');
    } finally {
      setEnviando(false);
    }
  };

  const iniciarEdicao = (av) => {
    setEditandoId(av.id);
    setEditNota(av.nota);
    setEditComentario(av.comentario || '');
  };

  const salvarEdicao = async () => {
    try {
      await editarAvaliacao(jogoSelecionado.id, editNota, editComentario);
      setEditandoId(null);
      buscarAvaliacoes(jogoSelecionado.id);
    } catch {
      alert('Erro ao editar avaliação.');
    }
  };

  const avaliacoesFiltradas = filtroNota > 0
    ? avaliacoes.filter((a) => Math.round(a.nota) === filtroNota)
    : avaliacoes;

  return (
    <div className="bg-surface min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <MessageSquare size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Avaliações</h1>
            <p className="text-on-surface-variant text-sm">
              Veja e deixe avaliações sobre os jogos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Lista de jogos (sidebar) */}
          <aside className="lg:col-span-1">
            <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant">
                <h2 className="text-sm font-semibold text-on-surface uppercase tracking-wider">
                  Selecione um jogo
                </h2>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {carregandoJogos ? (
                  <p className="text-on-surface-variant text-sm text-center py-8">Carregando jogos...</p>
                ) : jogos.length === 0 ? (
                  <p className="text-on-surface-variant text-sm text-center py-8">Nenhum jogo disponível.</p>
                ) : (
                  <ul role="listbox" aria-label="Lista de jogos para avaliar">
                    {jogos.map((jogo) => (
                      <li key={jogo.id}>
                        <button
                          onClick={() => selecionarJogo(jogo)}
                          className={`w-full text-left px-5 py-3.5 transition-colors cursor-pointer border-l-4 ${
                            jogoSelecionado?.id === jogo.id
                              ? 'bg-surface-container-high border-primary text-on-surface'
                              : 'border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                          }`}
                          role="option"
                          aria-selected={jogoSelecionado?.id === jogo.id}
                        >
                          <span className="text-sm font-medium block truncate">{jogo.nome}</span>
                          {jogo.ano && (
                            <span className="text-xs text-on-surface-variant">{jogo.ano}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>

          {/* Painel principal */}
          <section className="lg:col-span-2 space-y-6">

            {!jogoSelecionado ? (
              <div className="bg-surface-container border border-outline-variant rounded-2xl p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-outline-variant mb-4" />
                <p className="text-on-surface-variant text-lg font-medium">
                  Selecione um jogo para ver e escrever avaliações
                </p>
              </div>
            ) : (
              <>
                {/* Resumo do jogo */}
                <div className="bg-surface-container border border-outline-variant rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-on-surface mb-3">
                    {jogoSelecionado.nome}
                  </h2>
                  {jogoSelecionado.descricao && (
                    <p className="text-on-surface-variant text-sm mb-4">{jogoSelecionado.descricao}</p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <EstrelaEstatica nota={resumo.media} />
                      <span className="text-on-surface font-semibold text-sm">
                        {resumo.media > 0 ? resumo.media.toFixed(1) : '—'}
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-sm">
                      {resumo.total} avaliação{resumo.total !== 1 ? 'ões' : ''}
                    </span>
                  </div>
                </div>

                {/* Formulário de avaliação */}
                <div className="bg-surface-container border border-outline-variant rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-on-surface mb-4">Sua Avaliação</h3>

                  {sucesso && (
                    <p className="text-on-surface text-sm bg-surface-container-high border border-outline-variant rounded-lg p-2 mb-4">
                      {sucesso}
                    </p>
                  )}
                  {erroForm && (
                    <p className="text-error text-sm bg-error-container/20 border border-error-container rounded-lg p-2 mb-4">
                      {erroForm}
                    </p>
                  )}

                  <form onSubmit={handleEnviar} className="space-y-4">
                    <div>
                      <label className="block text-sm text-on-surface-variant mb-2">Nota</label>
                      <EstrelaInterativa nota={nota} setNota={setNota} tamanho={28} />
                    </div>
                    <div>
                      <label htmlFor="novo-comentario" className="block text-sm text-on-surface-variant mb-2">
                        Comentário
                      </label>
                      <textarea
                        id="novo-comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Conte o que achou do jogo..."
                        rows={3}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="flex items-center gap-2 bg-primary text-on-primary font-semibold rounded-lg px-5 py-2.5 text-sm transition cursor-pointer hover:brightness-90 disabled:opacity-50"
                    >
                      <Send size={14} />
                      {enviando ? 'Enviando...' : 'Enviar Avaliação'}
                    </button>
                  </form>
                </div>

                {/* Lista de avaliações */}
                <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-base font-semibold text-on-surface">
                      Avaliações ({avaliacoes.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <Filter size={14} className="text-on-surface-variant" />
                      <select
                        value={filtroNota}
                        onChange={(e) => setFiltroNota(Number(e.target.value))}
                        className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Filtrar por nota"
                      >
                        <option value={0}>Todas as notas</option>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} estrela{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {carregando ? (
                    <p className="text-on-surface-variant text-sm text-center py-12">Carregando avaliações...</p>
                  ) : avaliacoesFiltradas.length === 0 ? (
                    <p className="text-on-surface-variant text-sm text-center py-12">
                      {filtroNota > 0 ? 'Nenhuma avaliação com esta nota.' : 'Nenhuma avaliação ainda. Seja o primeiro!'}
                    </p>
                  ) : (
                    <div className="divide-y divide-outline-variant">
                      {avaliacoesFiltradas.map((av) => (
                        <div key={av.id} className="px-6 py-4 hover:bg-surface-container-high/50 transition-colors">
                          {editandoId === av.id ? (
                            <div className="space-y-3">
                              <EstrelaInterativa nota={editNota} setNota={setEditNota} tamanho={22} />
                              <textarea
                                value={editComentario}
                                onChange={(e) => setEditComentario(e.target.value)}
                                rows={2}
                                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                              />
                              <div className="flex gap-2">
                                <button onClick={salvarEdicao} className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded-lg cursor-pointer hover:brightness-90 transition">Salvar</button>
                                <button onClick={() => setEditandoId(null)} className="text-xs text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-lg cursor-pointer hover:bg-surface-container-high transition">Cancelar</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-on-surface">
                                    {av.usuario?.nome || av.nomeUsuario || 'Anônimo'}
                                  </span>
                                  <EstrelaEstatica nota={av.nota} tamanho={14} />
                                </div>
                                {(av.usuarioId === usuario?.id || av.fkUsuario === usuario?.id) && (
                                  <button
                                    onClick={() => iniciarEdicao(av)}
                                    title="Editar"
                                    className="text-on-surface-variant hover:text-on-surface p-1 rounded cursor-pointer transition"
                                    aria-label="Editar avaliação"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                )}
                              </div>
                              {av.comentario && (
                                <p className="text-on-surface-variant text-sm">{av.comentario}</p>
                              )}
                              {av.createdAt && (
                                <p className="text-on-surface-variant text-xs mt-1.5">
                                  {new Date(av.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
