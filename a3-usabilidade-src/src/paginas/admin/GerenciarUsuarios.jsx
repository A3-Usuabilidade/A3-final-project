import { useState } from 'react';
import useUsuarios from '../../hooks/useUsuarios.js';
import BotaoAcao from '../../componentes/BotaoAcao.jsx';
import ModalConfirmacao from '../../componentes/ModalConfirmacao.jsx';

const PERFIS = ['Cliente', 'Administrador'];

export default function GerenciarUsuarios() {
  const { usuarios, carregando, erro, atualizarUsuario, deletarUsuario } = useUsuarios();
  const [salvandoId, setSalvandoId] = useState(null);
  const [erroAcao, setErroAcao] = useState(null);
  const [modalExcluir, setModalExcluir] = useState({ aberto: false, id: null, erro: null });

  const alterarPerfil = async (usuario, perfil) => {
    if (perfil === usuario.perfil) return;
    setSalvandoId(usuario.id);
    setErroAcao(null);
    try {
      await atualizarUsuario(usuario.id, { perfil });
    } catch {
      setErroAcao('Não foi possível atualizar o perfil do usuário.');
    } finally {
      setSalvandoId(null);
    }
  };

  const confirmarExclusao = async () => {
    setModalExcluir((prev) => ({ ...prev, erro: null }));
    try {
      await deletarUsuario(modalExcluir.id);
      setModalExcluir({ aberto: false, id: null, erro: null });
    } catch {
      setModalExcluir((prev) => ({ ...prev, erro: 'Erro ao excluir usuário.' }));
    }
  };

  const abrirExclusao = (id) => setModalExcluir({ aberto: true, id, erro: null });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-on-surface">Gerenciar Usuários</h1>

      {erroAcao && <p className="text-error text-sm">{erroAcao}</p>}

      <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-lg font-semibold text-on-surface">Usuários Cadastrados</h2>
        </div>
        {carregando ? (
          <p className="text-on-surface-variant text-center py-12">Carregando...</p>
        ) : erro ? (
          <p className="text-error text-center py-12 text-sm">{erro}</p>
        ) : usuarios.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Perfil</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                  <td className="px-6 py-3 text-on-surface text-sm font-medium">{usuario.nome}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{usuario.email}</td>
                  <td className="px-6 py-3">
                    <label htmlFor={`perfil-${usuario.id}`} className="sr-only">Perfil de {usuario.nome}</label>
                    <select
                      id={`perfil-${usuario.id}`}
                      value={PERFIS.includes(usuario.perfil) ? usuario.perfil : 'Cliente'}
                      disabled={salvandoId === usuario.id}
                      onChange={(e) => alterarPerfil(usuario, e.target.value)}
                      className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      {PERFIS.map((perfil) => (
                        <option key={perfil} value={perfil}>{perfil}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <BotaoAcao label="Excluir" onClick={() => abrirExclusao(usuario.id)} variante="excluir" />
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
        titulo="Excluir usuário"
        mensagem="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onConfirmar={confirmarExclusao}
        onCancelar={() => setModalExcluir({ aberto: false, id: null, erro: null })}
        erro={modalExcluir.erro}
      />
    </div>
  );
}
