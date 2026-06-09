import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useProfile from '../hooks/useProfile.js';
import { esquemaEditarPerfil, esquemaAlterarSenha } from '../configuracao/validacao.js';
import api from '../servicos/api';

export default function Perfil() {
  const {
    dadosUsuario,
    carregando,
    erroPerfil,
    erroSenha,
    sucessoPerfil,
    sucessoSenha,
    setErroPerfil,
    setErroSenha,
    setSucessoPerfil,
    setSucessoSenha,
    carregarPerfil
  } = useProfile();

  const {
    register: registerPerfil,
    handleSubmit: handleSubmitPerfil,
    setValue,
    formState: { errors: errorsPerfil, isSubmitting: isSubmittingPerfil },
  } = useForm({
    resolver: zodResolver(esquemaEditarPerfil),
  });

  const {
    register: registerSenha,
    handleSubmit: handleSubmitSenha,
    reset: resetFormSenha,
    formState: { errors: errorsSenha, isSubmitting: isSubmittingSenha },
  } = useForm({
    resolver: zodResolver(esquemaAlterarSenha),
  });

  useEffect(() => {
    if (dadosUsuario) {
      setValue('nome', dadosUsuario.nome);
      setValue('dataNascimento', dadosUsuario.dataNascimento);
    }
  }, [dadosUsuario, setValue]);

  const atualizarPerfil = async (dadosAtualizados) => {
    setErroPerfil(null);
    setSucessoPerfil(false);
    try {
      await api.put(`/usuarios/${dadosUsuario?.id}`, dadosAtualizados);
      setSucessoPerfil(true);
      await carregarPerfil();
    } catch (erro) {
      const mensagem = erro.response?.data?.message || 'Erro ao atualizar o perfil.';
      setErroPerfil(mensagem);
      throw erro;
    }
  };

  const alterarSenha = async (dadosSenha) => {
    setErroSenha(null);
    setSucessoSenha(false);
    try {
      await api.put('/auth/change-password', {
        currentPassword: dadosSenha.currentPassword,
        newPassword: dadosSenha.newPassword
      });
      setSucessoSenha(true);
    } catch (erro) {
      const mensagem = erro.response?.data?.message || 'Erro ao alterar a senha.';
      setErroSenha(mensagem);
      throw erro;
    }
  };

  const onEditarPerfilSubmit = async (dados) => {
    try {
      await atualizarPerfil(dados);
    } catch (e) {
      console.error(e);
    }
  };

  const onAlterarSenhaSubmit = async (dados) => {
    try {
      await alterarSenha(dados);
      resetFormSenha();
    } catch (e) {
      console.error(e);
    }
  };

  if (carregando) {
    return <p className="text-white p-8 text-center">Carregando dados do perfil...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-8">
      <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">Meu Perfil</h1>

      {/* Seção Dados Pessoais */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-blue-400">Dados Pessoais</h2>
        
        {sucessoPerfil && <p className="text-green-400 font-medium">Perfil updated com sucesso!</p>}
        {erroPerfil && <p className="text-red-400 font-medium">{erroPerfil}</p>}

        <form onSubmit={handleSubmitPerfil(onEditarPerfilSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">E-mail (Não editável)</label>
            <input
              type="email"
              value={dadosUsuario?.email || ''}
              disabled
              className="bg-gray-700 text-gray-400 p-2 rounded cursor-not-allowed opacity-60 border border-gray-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Nome</label>
            <input
              type="text"
              {...registerPerfil('nome')}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errorsPerfil.nome && <span className="text-red-400 text-xs mt-1">{errorsPerfil.nome.message}</span>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Data de Nascimento</label>
            <input
              type="date"
              {...registerPerfil('dataNascimento')}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errorsPerfil.dataNascimento && <span className="text-red-400 text-xs mt-1">{errorsPerfil.dataNascimento.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmittingPerfil}
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {isSubmittingPerfil ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </section>

      {/* Seção Alterar Senha */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-blue-400">Alterar Senha</h2>

        {sucessoSenha && <p className="text-green-400 font-medium">Senha alterada com sucesso!</p>}
        {erroSenha && <p className="text-red-400 font-medium">{erroSenha}</p>}

        <form onSubmit={handleSubmitSenha(onAlterarSenhaSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Senha Actual</label>
            <input
              type="password"
              {...registerSenha('currentPassword')}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errorsSenha.currentPassword && <span className="text-red-400 text-xs mt-1">{errorsSenha.currentPassword.message}</span>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Nova Senha</label>
            <input
              type="password"
              {...registerSenha('newPassword')}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errorsSenha.newPassword && <span className="text-red-400 text-xs mt-1">{errorsSenha.newPassword.message}</span>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              {...registerSenha('confirmPassword')}
              className="bg-gray-700 text-white p-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errorsSenha.confirmPassword && <span className="text-red-400 text-xs mt-1">{errorsSenha.confirmPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmittingSenha}
            className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {isSubmittingSenha ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </section>
    </div>
  );
}