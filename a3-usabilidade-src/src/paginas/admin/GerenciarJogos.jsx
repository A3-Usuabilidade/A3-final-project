import { useState } from 'react';
import useJogos from '../../hooks/useJogos.js';
import BotaoAcao from '../../componentes/BotaoAcao.jsx';
import ModalConfirmacao from '../../componentes/ModalConfirmacao.jsx';

const CAMPOS_VAZIOS = {
  nome: '',
  descricao: '',
  ano: '',
  preco: '',
  desconto: '',
  fkEmpresa: '',
  fkCategoria: '',
};

export default function GerenciarJogos() {
  const { jogos, categorias, empresas, carregando, erro, criarJogo, atualizarJogo, deletarJogo } = useJogos();
  const [formulario, setFormulario] = useState(CAMPOS_VAZIOS);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, id: null, erro: null });

  const abrirEdicao = (jogo) => {
    setEditandoId(jogo.id);
    setFormulario({
      nome:        jogo.nome        ?? '',
      descricao:   jogo.descricao   ?? '',
      ano:         jogo.ano         ?? '',
      preco:       jogo.preco       ?? '',
      desconto:    jogo.desconto    ?? '',
      fkEmpresa:   jogo.fkEmpresa   ?? '',
      fkCategoria: jogo.fkCategoria ?? '',
    });
    setErroForm(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setEditandoId(null);
    setFormulario(CAMPOS_VAZIOS);
    setErroForm(null);
  };

  const set = (campo) => (e) =>
    setFormulario((f) => ({ ...f, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroForm(null);
    try {
      const payload = {
        ...formulario,
        ano:         formulario.ano         ? Number(formulario.ano)         : undefined,
        preco:       formulario.preco       ? Number(formulario.preco)       : undefined,
        desconto:    formulario.desconto    ? Number(formulario.desconto)    : undefined,
        fkEmpresa:   formulario.fkEmpresa   ? Number(formulario.fkEmpresa)   : undefined,
        fkCategoria: formulario.fkCategoria ? Number(formulario.fkCategoria) : undefined,
      };
      if (editandoId) {
        await atualizarJogo(editandoId, payload);
      } else {
        await criarJogo(payload);
      }
      cancelar();
    } catch (err) {
      setErroForm(err.response?.data?.message || 'Erro ao salvar jogo.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    setModalExcluir((prev) => ({ ...prev, erro: null }));
    try {
      await deletarJogo(modalExcluir.id);
      setModalExcluir({ aberto: false, id: null, erro: null });
    } catch {
      setModalExcluir((prev) => ({ ...prev, erro: 'Erro ao excluir jogo.' }));
    }
  };

  const abrirExclusao = (id) => setModalExcluir({ aberto: true, id, erro: null });

  const nomeCategoria = (id) => categorias.find((c) => c.id === id)?.nome ?? '—';
  const nomeEmpresa   = (id) => empresas.find((e) => e.id === id)?.nome   ?? '—';

  const inputClass = 'bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Jogos</h1>

      <section className="bg-surface-container border border-outline-variant rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {editandoId ? 'Editando jogo' : 'Novo Jogo'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input required placeholder="Nome do jogo" value={formulario.nome}
            onChange={set('nome')}
            className={`col-span-full ${inputClass}`} />

          <select required value={formulario.fkEmpresa} onChange={set('fkEmpresa')} className={inputClass}>
            <option value="">Selecione a empresa...</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>

          <select required value={formulario.fkCategoria} onChange={set('fkCategoria')} className={inputClass}>
            <option value="">Selecione a categoria...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <input required type="number" min="1950" placeholder="Ano de lançamento" value={formulario.ano}
            onChange={set('ano')}
            className={inputClass} />

          <input required type="number" step="0.01" min="0" placeholder="Preço (ex: 49.90)" value={formulario.preco}
            onChange={set('preco')}
            className={inputClass} />

          <input type="number" step="0.01" min="0" max="100"
            placeholder="Desconto % (opcional)" value={formulario.desconto}
            onChange={set('desconto')}
            className={`col-span-full ${inputClass}`} />

          <textarea placeholder="Descrição (opcional)" value={formulario.descricao}
            onChange={set('descricao')} rows={3}
            className={`col-span-full ${inputClass} resize-none`} />

          {erroForm && <p className="col-span-full text-error text-sm">{erroForm}</p>}

          <div className="col-span-full flex gap-3">
            <button type="submit" disabled={salvando}
              className="bg-primary text-on-primary text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
              {salvando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Jogo'}
            </button>
            {editandoId && (
              <button type="button" onClick={cancelar}
                className="text-sm text-on-surface-variant border border-outline-variant px-5 py-2 rounded-lg hover:bg-surface-container-high transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-lg font-semibold text-on-surface">Jogos Cadastrados</h2>
        </div>
        {carregando ? (
          <p className="text-on-surface-variant text-center py-12">Carregando...</p>
        ) : erro ? (
          <p className="text-error text-center py-12 text-sm">{erro}</p>
        ) : jogos.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">Nenhum jogo cadastrado.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Empresa</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Ano</th>
                <th className="px-6 py-3 text-right">Preço</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {jogos.map((jogo) => (
                <tr key={jogo.id} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                  <td className="px-6 py-3 text-on-surface text-sm font-medium">{jogo.nome}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{nomeEmpresa(jogo.fkEmpresa)}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{nomeCategoria(jogo.fkCategoria)}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{jogo.ano}</td>
                  <td className="px-6 py-3 text-on-surface text-sm text-right">
                    R$ {Number(jogo.preco).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <BotaoAcao label="Editar" onClick={() => abrirEdicao(jogo)} variante="editar" />
                    <BotaoAcao label="Excluir" onClick={() => abrirExclusao(jogo.id)} variante="excluir" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <ModalConfirmacao
        aberto={modalExcluir.aberto}
        titulo="Excluir jogo"
        mensagem="Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita."
        onConfirmar={confirmarExclusao}
        onCancelar={() => setModalExcluir({ aberto: false, id: null, erro: null })}
        erro={modalExcluir.erro}
      />
    </div>
  );
}