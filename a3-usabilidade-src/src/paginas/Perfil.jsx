import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import useProfile from '../hooks/useProfile.js';
import BotaoSair from '../componentes/BotaoSair.jsx';
import { esquemaEditarPerfil, esquemaAlterarSenha } from '../configuracao/validacao.js';

export default function Perfil() {
  const navigate = useNavigate();
  const { dados, carregando, erro, atualizar, alterarSenha } = useProfile();
  const [erroForm, setErroForm] = useState(null);
  const [sucessoForm, setSucessoForm] = useState(null);
  const [erroSenhaForm, setErroSenhaForm] = useState(null);
  const [sucessoSenhaForm, setSucessoSenhaForm] = useState(null);
  const [editarAtivo, setEditarAtivo] = useState(false);
  const [senhaAtiva, setSenhaAtiva] = useState(false);

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
      if (dados.dataNascimento) {
        setValue('dataNascimento', dados.dataNascimento.split('T')[0]);
      }
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
      } else {
        delete body.dataNascimento;
      }
      await atualizar(body);
      setSucessoForm('Perfil atualizado com sucesso!');
      setEditarAtivo(false);
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
      setSenhaAtiva(false);
      resetSenha();
    } catch (err) {
      setErroSenhaForm(err.response?.data?.message || 'Erro ao alterar a senha');
    }
  };

  const cancelarEdicao = () => {
    setEditarAtivo(false);
    setErroForm(null);
    setSucessoForm(null);
    if (dados) {
      setValue('nome', dados.nome || '');
      setValue('dataNascimento', dados.dataNascimento?.split('T')[0] || '');
    }
  };

  const cancelarSenha = () => {
    setSenhaAtiva(false);
    setErroSenhaForm(null);
    setSucessoSenhaForm(null);
    resetSenha();
  };

  if (carregando) {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-on-surface-variant text-center py-12">
            Carregando dados do perfil...
          </p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-surface min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-3">
            {erro}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <button
    type="button"
    onClick={() => navigate(-1)}
    className="border border-outline-variant px-4 py-1.5 rounded-lg text-sm text-on-surface hover:brightness-90 transition cursor-pointer"
  >
    ← Voltar
  </button>
          <h1 className="text-2xl font-semibold text-on-surface">Meu Perfil</h1>
          <BotaoSair className="border border-outline-variant px-4 py-1.5" />
        </div>

        <section className="bg-surface-container border border-outline-variant rounded-2xl p-8 space-y-5">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-on-surface">Dados Pessoais</h2>
            {!editarAtivo && (
              <button
                type="button"
                onClick={() => setEditarAtivo(true)}
                className="bg-primary text-on-primary font-semibold rounded-lg px-5 py-2 text-sm transition cursor-pointer hover:brightness-90"
              >
                Editar
              </button>
            )}
          </div>

          {sucessoForm && (
            <p className="text-on-surface text-sm bg-surface-container-high border border-outline-variant rounded-lg p-2">
              {sucessoForm}
            </p>
          )}

          {erroForm && (
            <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-2">
              {erroForm}
            </p>
          )}

          <form onSubmit={handleSubmitPerfil(onEditar)} className="space-y-4">

            <div>
              <label className="block text-sm text-on-surface-variant mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={dados?.email || ''}
                disabled
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface-variant cursor-not-allowed"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                O e-mail não pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm text-on-surface-variant mb-1">
                Nome
              </label>
              {editarAtivo ? (
                <>
                  <input
                    type="text"
                    {...registerPerfil('nome')}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  {errorsPerfil.nome && (
                    <span className="text-error text-xs mt-1 block">
                      {errorsPerfil.nome.message}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-on-surface">{dados?.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-on-surface-variant mb-1">
                Data de Nascimento
              </label>
              {editarAtivo ? (
                <>
                  <input
                    type="date"
                    {...registerPerfil('dataNascimento')}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  {errorsPerfil.dataNascimento && (
                    <span className="text-error text-xs mt-1 block">
                      {errorsPerfil.dataNascimento.message}
                    </span>
                  )}
                </>
              ) : (
                <p className="text-on-surface">
                  {dados?.dataNascimento
                    ? new Date(dados.dataNascimento).toLocaleDateString('pt-BR')
                    : '\u2014'}
                </p>
              )}
            </div>

            {editarAtivo && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingPerfil}
                  className="flex-1 bg-primary text-on-primary font-semibold rounded-lg py-2 transition cursor-pointer hover:brightness-90 disabled:opacity-50"
                >
                  {isSubmittingPerfil ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="flex-1 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg py-2 font-medium cursor-pointer hover:brightness-90 transition"
                >
                  Cancelar
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="bg-surface-container border border-outline-variant rounded-2xl p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-on-surface">Alterar Senha</h2>
            {!senhaAtiva && (
              <button
                type="button"
                onClick={() => setSenhaAtiva(true)}
                className="bg-surface-container-high text-on-surface border border-outline-variant rounded-lg px-5 py-2 text-sm font-medium cursor-pointer hover:brightness-90 transition"
              >
                Alterar Senha
              </button>
            )}
          </div>

          {sucessoSenhaForm && (
            <p className="text-on-surface text-sm bg-surface-container-high border border-outline-variant rounded-lg p-2">
              {sucessoSenhaForm}
            </p>
          )}

          {erroSenhaForm && (
            <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-2">
              {erroSenhaForm}
            </p>
          )}

          {senhaAtiva && (
            <form onSubmit={handleSubmitSenha(onAlterar)} className="space-y-4">

              <div>
                <label className="block text-sm text-on-surface-variant mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  {...registerSenha('currentPassword')}
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                {errorsSenha.currentPassword && (
                  <span className="text-error text-xs mt-1 block">
                    {errorsSenha.currentPassword.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  {...registerSenha('newPassword')}
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                {errorsSenha.newPassword && (
                  <span className="text-error text-xs mt-1 block">
                    {errorsSenha.newPassword.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-1">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  {...registerSenha('confirmPassword')}
                  className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                {errorsSenha.confirmPassword && (
                  <span className="text-error text-xs mt-1 block">
                    {errorsSenha.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingSenha}
                  className="flex-1 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg py-2 font-semibold cursor-pointer hover:brightness-90 disabled:opacity-50 transition"
                >
                  {isSubmittingSenha ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <button
                  type="button"
                  onClick={cancelarSenha}
                  className="flex-1 bg-surface-container-high text-on-surface border border-outline-variant rounded-lg py-2 font-medium cursor-pointer hover:brightness-90 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
