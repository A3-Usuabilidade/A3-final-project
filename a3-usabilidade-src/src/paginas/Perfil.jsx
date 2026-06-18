import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import useProfile from '../hooks/useProfile.js';
import useAvaliacoes from '../hooks/useAvaliacoes.js';
import useWishlist from '../hooks/useWishlist.js';
import useCarrinho from '../hooks/useCarrinho.js';
import useToastContext from '../hooks/useToastContext.js';
import api from '../servicos/api.js';
import BotaoSair from '../componentes/BotaoSair.jsx';
import BotaoSenha from '../componentes/ui/Botaosenha.jsx';
import ModalDetalhes from '../componentes/ModalDetalhes.jsx';
import { esquemaEditarPerfil, esquemaAlterarSenha } from '../configuracao/validacao.js';

export default function Perfil() {
  const navigate = useNavigate();
  const { dados, carregando, erro, atualizar, alterarSenha } = useProfile();
  const { minhasAvaliacoes, carregando: carregandoAval, carregarMinhasAvaliacoes } = useAvaliacoes();
  const { estaDesejado, alternar: alternarDesejo } = useWishlist();
  const { adicionar } = useCarrinho();
  const mostrarToast = useToastContext();
  const [jogosMap, setJogosMap] = useState({});
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [erroForm, setErroForm] = useState(null);
  const [sucessoForm, setSucessoForm] = useState(null);
  const [erroSenhaForm, setErroSenhaForm] = useState(null);
  const [sucessoSenhaForm, setSucessoSenhaForm] = useState(null);
  const [editarAtivo, setEditarAtivo] = useState(false);
  const [senhaAtiva, setSenhaAtiva] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

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

  useEffect(() => {
    carregarMinhasAvaliacoes();
  }, [carregarMinhasAvaliacoes]);

  useEffect(() => {
    if (minhasAvaliacoes.length > 0) {
      api.get('/jogos').then(({ data }) => {
        const lista = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];
        const mapa = {};
        lista.forEach((j) => {
          mapa[j.id] = {
            id: j.id,
            nome: j.nome || j.titulo || '',
            categoria: j.categoria?.nome || j.categoria || '',
            empresa: j.empresa?.nome || j.empresa || '',
            ano: j.ano || j.anoLancamento || null,
            preco: j.preco || j.valor || 0,
            descricao: j.descricao || '',
            capa: j.capa || j.imagem || j.urlImagem || '',
          };
        });
        setJogosMap(mapa);
      }).catch(() => {});
    }
  }, [minhasAvaliacoes]);

  async function adicionarAoCarrinho(jogo) {
    if (!jogo?.id) return;
    const ok = await adicionar(jogo.id);
    mostrarToast(
      ok ? `${jogo.nome} foi adicionado ao carrinho.` : 'Não foi possível adicionar ao carrinho.',
      ok ? 'sucesso' : 'erro',
    );
  }

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
              <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-email">
                E-mail
              </label>
              <input
                type="email"
                id="perfil-email"
                value={dados?.email || ''}
                disabled
                className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface-variant cursor-not-allowed"
              />
              <p className="text-xs text-on-surface-variant mt-1">
                O e-mail nÃ£o pode ser alterado
              </p>
            </div>

            <div>
              <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-nome">
                Nome
              </label>
              {editarAtivo ? (
                <>
                  <input
                    type="text"
                    id="perfil-nome"
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
              <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-nascimento">
                Data de Nascimento
              </label>
              {editarAtivo ? (
                <>
                  <input
                    type="date"
                    id="perfil-nascimento"
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
                  {isSubmittingPerfil ? 'Salvando...' : 'Salvar AlteraÃ§Ãµes'}
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
                <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-senha-atual">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaAtual ? 'text' : 'password'}
                    id="perfil-senha-atual"
                    {...registerSenha('currentPassword')}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  <BotaoSenha visivel={mostrarSenhaAtual} onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)} />
                </div>
                {errorsSenha.currentPassword && (
                  <span className="text-error text-xs mt-1 block">
                    {errorsSenha.currentPassword.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-senha-nova">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    id="perfil-senha-nova"
                    {...registerSenha('newPassword')}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  <BotaoSenha visivel={mostrarNovaSenha} onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)} />
                </div>
                {errorsSenha.newPassword && (
                  <span className="text-error text-xs mt-1 block">
                    {errorsSenha.newPassword.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-1" htmlFor="perfil-senha-confirmar">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    id="perfil-senha-confirmar"
                    {...registerSenha('confirmPassword')}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  <BotaoSenha visivel={mostrarConfirmarSenha} onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} />
                </div>
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

        {/* Minhas Análises */}
        <section className="bg-surface-container border border-outline-variant rounded-2xl p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-on-surface">Minhas Análises</h2>
            <span className="text-sm text-on-surface-variant">{minhasAvaliacoes.length} {minhasAvaliacoes.length === 1 ? 'análise' : 'análises'}</span>
          </div>

          {carregandoAval && (
            <p className="text-on-surface-variant text-sm text-center py-4">Carregando análises...</p>
          )}

          {!carregandoAval && minhasAvaliacoes.length === 0 && (
            <div className="text-center py-6">
              <p className="text-on-surface-variant text-sm">Você ainda não avaliou nenhum jogo.</p>
              <p className="text-on-surface-variant text-xs mt-1">Abra um jogo na loja e clique na aba "Avaliações" para deixar sua análise.</p>
            </div>
          )}

          {!carregandoAval && minhasAvaliacoes.length > 0 && (
            <div className="space-y-3">
              {minhasAvaliacoes.map((av, i) => {
                const jId = av.fkJogo || av.fk_jogo;
                const jogo = jogosMap[jId];
                return (
                  <div
                    key={av.id || i}
                    role="button"
                    tabIndex={0}
                    onClick={() => { if (jogo) setJogoSelecionado(jogo); }}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && jogo) { e.preventDefault(); setJogoSelecionado(jogo); } }}
                    className="bg-surface-container-high border border-outline-variant rounded-xl p-4 cursor-pointer hover:bg-surface-container-highest transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-on-surface">
                        {jogo ? jogo.nome : `Jogo #${jId}`}
                      </h3>
                      <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((n) => (
                        <svg key={n} viewBox="0 0 24 24" className={`h-4 w-4 ${n < av.nota ? 'text-[#f59e0b]' : 'text-on-surface-variant/30'}`} fill="currentColor">
                          <path d="m12 2.8 2.75 5.57 6.15.9-4.45 4.34 1.05 6.12L12 16.84l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm font-bold text-on-surface">{av.nota}</span>
                    </div>
                  </div>
                  {av.comentario && (
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{av.comentario}</p>
                  )}
                </div>
              );})}
            </div>
          )}
        </section>
      </div>

      <ModalDetalhes
        jogo={jogoSelecionado}
        aoFechar={() => setJogoSelecionado(null)}
        aoAdicionar={adicionarAoCarrinho}
        desejado={jogoSelecionado ? estaDesejado(jogoSelecionado.id) : false}
        aoAlternarDesejo={alternarDesejo}
      />
    </div>
  );
}
