// src/paginas/admin/GerenciarJogos.jsx
import { useState } from 'react';
import useJogos from '../../hooks/useJogos.js';

const CAMPOS_VAZIOS = {
  nome: '',
  descricao: '',
  ano: '',
  preco: '',
  desconto: '',
  fk_empresa: '',
  fk_categoria: '',
};

export default function GerenciarJogos() {
  const { jogos, categorias, empresas, carregando, erro, criarJogo, atualizarJogo, deletarJogo } = useJogos();
  const [formulario, setFormulario] = useState(CAMPOS_VAZIOS);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  // Preenche o formulário com os dados atuais do jogo
  const abrirEdicao = (jogo) => {
    setEditandoId(jogo.id);
    setFormulario({
      nome:         jogo.nome         ?? '',
      descricao:    jogo.descricao    ?? '',
      ano:          jogo.ano          ?? '',
      preco:        jogo.preco        ?? '',
      desconto:     jogo.desconto     ?? '',
      fk_empresa:   jogo.fk_empresa   ?? '',
      fk_categoria: jogo.fk_categoria ?? '',
    });
    setErroForm(null);
    // Rola até o formulário
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
        ano:      formulario.ano      ? Number(formulario.ano)      : undefined,
        preco:    formulario.preco    ? Number(formulario.preco)    : undefined,
        desconto: formulario.desconto ? Number(formulario.desconto) : undefined,
        fk_empresa:   formulario.fk_empresa   ? Number(formulario.fk_empresa)   : undefined,
        fk_categoria: formulario.fk_categoria ? Number(formulario.fk_categoria) : undefined,
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

  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return;
    try {
      await deletarJogo(id);
    } catch {
      alert('Erro ao excluir jogo.');
    }
  };

  const nomeCategoria = (id) => categorias.find((c) => c.id === id)?.nome ?? '—';
  const nomeEmpresa   = (id) => empresas.find((e) => e.id === id)?.nome   ?? '—';

  const inputClass = 'bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Jogos</h1>

      {/* Formulário */}
      <section className="bg-surface-container border border-outline-variant rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {editandoId ? 'Editando jogo' : 'Novo Jogo'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Nome */}
          <input required placeholder="Nome do jogo" value={formulario.nome}
            onChange={set('nome')}
            className={`col-span-full ${inputClass}`} />

          {/* Empresa — select */}
          <select required value={formulario.fk_empresa} onChange={set('fk_empresa')} className={inputClass}>
            <option value="">Selecione a empresa...</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome}</option>
            ))}
          </select>

          {/* Categoria — select */}
          <select required value={formulario.fk_categoria} onChange={set('fk_categoria')} className={inputClass}>
            <option value="">Selecione a categoria...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          {/* Ano */}
          <input required type="number" placeholder="Ano de lançamento" value={formulario.ano}
            onChange={set('ano')}
            className={inputClass} />

          {/* Preço */}
          <input required type="number" step="0.01" placeholder="Preço (ex: 49.90)" value={formulario.preco}
            onChange={set('preco')}
            className={inputClass} />

          {/* Desconto */}
          <input type="number" step="0.01" min="0" max="100" placeholder="Desconto % (opcional)" value={formulario.desconto}
            onChange={set('desconto')}
            className={`col-span-full ${inputClass}`} />

          {/* Descrição */}
          <textarea placeholder="Descrição (opcional)" value={formulario.descricao}
            onChange={set('descricao')} rows={3}
            className={`col-span-full ${inputClass} resize-none`} />

          {erroForm && (
            <p className="col-span-full text-error text-sm">{erroForm}</p>
          )}

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

      {/* Tabela */}
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
                <tr key={jogo.id}
                  className="border-b border-outline-variant hover:bg-surface-container-high transition">
                  <td className="px-6 py-3 text-on-surface text-sm font-medium">{jogo.nome}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{nomeEmpresa(jogo.fk_empresa)}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{nomeCategoria(jogo.fk_categoria)}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{jogo.ano}</td>
                  <td className="px-6 py-3 text-on-surface text-sm text-right">
                    R$ {Number(jogo.preco).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => abrirEdicao(jogo)}
                      className="text-xs text-primary border border-primary/40 rounded px-3 py-1 hover:bg-primary/10 transition">
                      Editar
                    </button>
                    <button onClick={() => handleDeletar(jogo.id)}
                      className="text-xs text-error border border-error/40 rounded px-3 py-1 hover:bg-error/10 transition">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}