import { useState } from 'react';
import useEmpresas from '../../hooks/useEmpresas.js';

const CAMPOS_VAZIOS = {
  nome: '',
};

export default function GerenciarEmpresas() {
  const { empresas, carregando, erro, criarEmpresa, atualizarEmpresa, deletarEmpresa } = useEmpresas();
  const [formulario, setFormulario] = useState(CAMPOS_VAZIOS);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  const abrirEdicao = (empresa) => {
    setEditandoId(empresa.id);
    setFormulario({
      nome: empresa.nome ?? '',
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
      if (editandoId) {
        await atualizarEmpresa(editandoId, formulario);
      } else {
        await criarEmpresa(formulario);
      }
      cancelar();
    } catch (err) {
      setErroForm(err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar empresa.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
    try {
      await deletarEmpresa(id);
    } catch {
      alert('Erro ao excluir empresa.');
    }
  };

  const inputClass = 'bg-surface border border-outline-variant rounded-lg px-4 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Empresas</h1>

      <section className="bg-surface-container border border-outline-variant rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {editandoId ? 'Editando empresa' : 'Nova Empresa'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input required placeholder="Nome da empresa" value={formulario.nome}
            onChange={set('nome')}
            className={`col-span-full ${inputClass}`} />

          {erroForm && <p className="col-span-full text-error text-sm">{erroForm}</p>}

          <div className="col-span-full flex gap-3">
            <button type="submit" disabled={salvando}
              className="bg-primary text-on-primary text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50">
              {salvando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Empresa'}
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
          <h2 className="text-lg font-semibold text-on-surface">Empresas Cadastradas</h2>
        </div>
        {carregando ? (
          <p className="text-on-surface-variant text-center py-12">Carregando...</p>
        ) : erro ? (
          <p className="text-error text-center py-12 text-sm">{erro}</p>
        ) : empresas.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">Nenhuma empresa cadastrada.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                  <td className="px-6 py-3 text-on-surface text-sm font-medium">{empresa.nome}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => abrirEdicao(empresa)}
                      className="text-xs text-primary border border-primary/40 rounded px-3 py-1 hover:bg-primary/10 transition">
                      Editar
                    </button>
                    <button onClick={() => handleDeletar(empresa.id)}
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
