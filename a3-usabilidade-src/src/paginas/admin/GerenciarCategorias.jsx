import { useState } from 'react';
import useCategorias from '../../hooks/useCategorias.js';
import BotaoAcao from '../../componentes/BotaoAcao.jsx';
import ModalConfirmacao from '../../componentes/ModalConfirmacao.jsx';
import { esquemaCategoria } from '../../configuracao/validacao.js';

const CAMPOS_VAZIOS = {
  nome: '',
};

export default function GerenciarCategorias() {
  const { categorias, carregando, erro, criarCategoria, atualizarCategoria, deletarCategoria } = useCategorias();
  const [formulario, setFormulario] = useState(CAMPOS_VAZIOS);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, id: null, erro: null });

  const abrirEdicao = (categoria) => {
    setEditandoId(categoria.id);
    setFormulario({
      nome: categoria.nome ?? '',
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

    const resultado = esquemaCategoria.safeParse(formulario);
    if (!resultado.success) {
      setErroForm(resultado.error.issues[0].message);
      setSalvando(false);
      return;
    }

    try {
      if (editandoId) {
        await atualizarCategoria(editandoId, resultado.data);
      } else {
        await criarCategoria(resultado.data);
      }
      cancelar();
    } catch (err) {
      setErroForm(mensagemDeErro(err, 'Erro ao salvar categoria.'));
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    setModalExcluir((prev) => ({ ...prev, erro: null }));
    try {
      await deletarCategoria(modalExcluir.id);
      setModalExcluir({ aberto: false, id: null, erro: null });
    } catch {
      setModalExcluir((prev) => ({ ...prev, erro: 'Erro ao excluir categoria.' }));
    }
  };

  const abrirExclusao = (id) => setModalExcluir({ aberto: true, id, erro: null });

  const inputClass = 'bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  function mensagemDeErro(err, fallback) {
    const erro = err.response?.data?.error || err.response?.data?.message || fallback;
    if (erro.includes('UNIQUE')) return 'Já existe uma categoria com este nome.';
    return erro;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Categorias</h1>

      <section className="bg-surface-container border border-outline-variant rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {editandoId ? 'Editando categoria' : 'Nova Categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <label htmlFor="nome-categoria" className="sr-only">Nome da categoria</label>
          <input required placeholder="Nome da categoria" value={formulario.nome} id="nome-categoria"
            onChange={set('nome')}
            className={`col-span-full ${inputClass}`} />

          {erroForm && <p className="col-span-full text-error text-sm">{erroForm}</p>}

          <div className="col-span-full flex gap-3">
            <button type="submit" disabled={salvando}
              className="bg-primary text-on-primary text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
              {salvando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Categoria'}
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
          <h2 className="text-lg font-semibold text-on-surface">Categorias Cadastradas</h2>
        </div>
        {carregando ? (
          <p className="text-on-surface-variant text-center py-12">Carregando...</p>
        ) : erro ? (
          <p className="text-error text-center py-12 text-sm">{erro}</p>
        ) : categorias.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                  <td className="px-6 py-3 text-on-surface text-sm font-medium">{categoria.nome}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <BotaoAcao label="Editar" onClick={() => abrirEdicao(categoria)} variante="editar" />
                    <BotaoAcao label="Excluir" onClick={() => abrirExclusao(categoria.id)} variante="excluir" />
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
        titulo="Excluir categoria"
        mensagem="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        onConfirmar={confirmarExclusao}
        onCancelar={() => setModalExcluir({ aberto: false, id: null, erro: null })}
        erro={modalExcluir.erro}
      />
    </div>
  );
}
