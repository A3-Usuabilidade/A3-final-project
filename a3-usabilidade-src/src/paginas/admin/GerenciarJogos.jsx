import { useState } from 'react';
import useJogos from '../../hooks/useJogos.js';
import BotaoAcao from '../../componentes/BotaoAcao.jsx';
import ModalConfirmacao from '../../componentes/ModalConfirmacao.jsx';
import { esquemaJogo } from '../../configuracao/validacao.js';

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
      nome:        jogo.nome               ?? '',
      descricao:   jogo.descricao          ?? '',
      ano:         String(jogo.ano         ?? ''),
      preco:       String(jogo.preco       ?? ''),
      desconto:    jogo.desconto != null    ? String(jogo.desconto) : '',
      fkEmpresa:   String(jogo.fkEmpresa   ?? ''),
      fkCategoria: String(jogo.fkCategoria ?? ''),
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

    const resultado = esquemaJogo.safeParse(formulario);
    if (!resultado.success) {
      setErroForm(resultado.error.issues[0].message);
      setSalvando(false);
      return;
    }

    try {
      const payload = resultado.data;
      if (editandoId) {
        await atualizarJogo(editandoId, payload);
      } else {
        await criarJogo(payload);
      }
      cancelar();
    } catch (err) {
      setErroForm(mensagemDeErro(err, 'Erro ao salvar jogo.'));
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

  function mensagemDeErro(err, fallback) {
    const erro = err.response?.data?.error || err.response?.data?.message || fallback;
    if (erro.includes('UNIQUE')) return 'Já existe um jogo com este nome e empresa.';
    return erro;
  }

  const inputClass = 'bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Jogos</h1>

      <section className="bg-surface-container border border-outline-variant rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-6">
          {editandoId ? 'Editando jogo' : 'Novo Jogo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="nome" className="block text-sm text-on-surface-variant mb-1">Nome do jogo</label>
            <input id="nome" required placeholder="Ex: The Legend of Zelda"
              value={formulario.nome} onChange={set('nome')}
              className={`w-full ${inputClass}`} />
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <label htmlFor="fkEmpresa" className="block text-sm text-on-surface-variant mb-1">Empresa</label>
              <select id="fkEmpresa" required value={formulario.fkEmpresa} onChange={set('fkEmpresa')} className={`w-full ${inputClass}`}>
                <option value="">Selecione a empresa...</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>{e.nome}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="fkCategoria" className="block text-sm text-on-surface-variant mb-1">Categoria</label>
              <select id="fkCategoria" required value={formulario.fkCategoria} onChange={set('fkCategoria')} className={`w-full ${inputClass}`}>
                <option value="">Selecione a categoria...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <label htmlFor="ano" className="block text-sm text-on-surface-variant mb-1">Ano de lançamento</label>
              <input id="ano" required type="text" inputMode="numeric"
                placeholder="Ex: 2024"
                value={formulario.ano} onChange={set('ano')}
                className={`w-full ${inputClass}`} />
            </div>

            <div className="flex-1">
              <label htmlFor="preco" className="block text-sm text-on-surface-variant mb-1">Preço</label>
              <input id="preco" required type="text" inputMode="decimal"
                placeholder="Ex: 49.90"
                value={formulario.preco} onChange={set('preco')}
                className={`w-full ${inputClass}`} />
            </div>
          </div>

          <div>
            <label htmlFor="desconto" className="block text-sm text-on-surface-variant mb-1">Desconto % (opcional)</label>
            <input id="desconto" type="text" inputMode="numeric"
              placeholder="Ex: 10"
              value={formulario.desconto} onChange={set('desconto')}
              className={`w-full ${inputClass}`} />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm text-on-surface-variant mb-1">Descrição (opcional)</label>
            <textarea id="descricao" placeholder="Descreva o jogo..."
              value={formulario.descricao} onChange={set('descricao')} rows={3}
              className={`w-full ${inputClass} resize-none`} />
          </div>

          {erroForm && <p className="text-error text-sm">{erroForm}</p>}

          <div className="flex gap-3 pt-2">
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
          <div className="overflow-x-auto">
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
                    R$ {Number(jogo.preco || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <BotaoAcao label="Editar" onClick={() => abrirEdicao(jogo)} variante="editar" />
                    <BotaoAcao label="Excluir" onClick={() => abrirExclusao(jogo.id)} variante="excluir" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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