import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useProfile from '../hooks/useProfile.js';
import { esquemaEditarPerfil, esquemaAlterarSenha } from '../configuracao/validacao.js';

export default function Perfil() {
  const { dados, carregando, erro, atualizar, alterarSenha } = useProfile();
  const [erroForm, setErroForm] = useState(null);
  const [sucessoForm, setSucessoForm] = useState(null);
  const [erroSenhaForm, setErroSenhaForm] = useState(null);
  const [sucessoSenhaForm, setSucessoSenhaForm] = useState(null);

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
    reset: resetSenha,
    formState: { errors: errorsSenha, isSubmitting: isSubmittingSenha },
  } = useForm({
    resolver: zodResolver(esquemaAlterarSenha),
  });

  useEffect(() => {
    if (dados) {
      setValue('nome', dados.nome || '');
      setValue('dataNascimento', dados.dataNascimento?.split('T')[0] || '');
    }
  }, [dados, setValue]);

  const onEditar = async (formData) => {
    setErroForm(null);
    setSucessoForm(null);
    try {
      const body = { ...formData };
      if (body.dataNascimento) {
        const [a, m, d] = body.dataNascimento.split('-');
        body.dataNascimento = `${d}/${m}/${a}`;
      }
      await atualizar(body);
      setSucessoForm('Perfil atualizado com sucesso!');
    } catch (err) {
      setErroForm(err.response?.data?.message || 'Erro ao atualizar o perfil');
    }
  };

  const onAlterar = async (dadosSenha) => {
    setErroSenhaForm(null);
    setSucessoSenhaForm(null);
    try {
      await alterarSenha(dadosSenha);
      setSucessoSenhaForm('Senha alterada com sucesso!');
      resetSenha();
    } catch (err) {
      setErroSenhaForm(err.response?.data?.message || 'Erro ao alterar a senha');
    }
  };

  if (carregando) {
    return <p className="text-white p-8 text-center">Carregando dados do perfil...</p>;
  }

  if (erro) {
    return <p className="text-red-400 p-8 text-center">{erro}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-8">
      <h1 className="text-3xl font-bold border-b border-gray-700 pb-4">Meu Perfil</h1>

      <section className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-blue-400">Dados Pessoais</h2>

        {sucessoForm && <p className="text-green-400 font-medium">{sucessoForm}</p>}
        {erroForm && <p className="text-red-400 font-medium">{erroForm}</p>}

        <form onSubmit={handleSubmitPerfil(onEditar)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-400 mb-1">E-mail (não editável)</label>
            <input
              type="email"
              value={dados?.email || ''}
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
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded font-medium disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingPerfil ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </section>

      <section className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-blue-400">Alterar Senha</h2>

        {sucessoSenhaForm && <p className="text-green-400 font-medium">{sucessoSenhaForm}</p>}
        {erroSenhaForm && <p className="text-red-400 font-medium">{erroSenhaForm}</p>}

        <form onSubmit={handleSubmitSenha(onAlterar)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-200 mb-1">Senha Atual</label>
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
            className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded font-medium disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingSenha ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </section>
    </div>
  );
}
