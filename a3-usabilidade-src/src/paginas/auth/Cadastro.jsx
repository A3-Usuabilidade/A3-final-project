import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../componentes/Logo.jsx';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';
import { esquemaCadastro } from '../../configuracao/validacao.js';
import api from '../../servicos/api.js';

const PLACEHOLDER_SENHA = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';
const TEXTO_AUTENTICA = 'aut\u00eantica.';
const TEXTO_INFO = 'Informe suas informa\u00e7\u00f5es logo abaixo,';
const TEXTO_EXEMPLO_NOME = 'Ex: Jo\u00e3o Silva';
const TEXTO_MES = 'M\u00eas';
const TEXTO_JA_POSSUI = 'J\u00e1 possui uma conta? ';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [diaNascimento, setDiaNascimento] = useState('');
  const [mesNascimento, setMesNascimento] = useState('');
  const [anoNascimento, setAnoNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const diaNascimentoRef = useRef(null);
  const mesNascimentoRef = useRef(null);
  const anoNascimentoRef = useRef(null);
  const navigate = useNavigate();

  const dataNascimento = [diaNascimento, mesNascimento, anoNascimento].join('/');

  const handleDatePartChange = (valor, setValor, limite, proximoRef) => {
    const valorLimpo = valor.replace(/\D/g, '').slice(0, limite);
    setValor(valorLimpo);

    if (valorLimpo.length === limite && proximoRef?.current) {
      proximoRef.current.focus();
      proximoRef.current.select?.();
    }
  };

  const handleDatePartKeyDown = (event, valorAtual, refAnterior) => {
    if (event.key === 'Backspace' && !valorAtual && refAnterior?.current) {
      refAnterior.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm(null);

    const resultado = esquemaCadastro.safeParse({
      nome,
      email,
      dataNascimento,
      senha,
      confirmarSenha,
    });

    if (!resultado.success) {
      setErroForm(resultado.error.issues[0].message);
      return;
    }

    try {
      const body = { nome, email, senha };
      if (dataNascimento) body.dataNascimento = dataNascimento;
      await api.post('/auth/register', body);
      navigate('/entrar');
    } catch (erroCapturado) {
      setErroForm(erroCapturado.response?.data?.message || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1080px] grid-cols-1 items-center gap-6 xl:grid-cols-[minmax(400px,1fr)_minmax(390px,0.66fr)] xl:gap-6">
        <section className="hidden min-h-full flex-col justify-center text-slate-950 dark:text-white xl:flex xl:min-h-[32rem] xl:max-w-[26rem] xl:justify-between xl:self-center xl:py-0 xl:justify-self-start">
          <div className="flex items-center gap-5 xl:pl-0">
            <Logo className="h-[4.35rem] w-[3rem] text-slate-950 dark:text-white sm:h-[4.9rem] sm:w-[3.4rem]" />
            <h1 className="text-[2.45rem] font-black tracking-[0.02em] text-slate-950 dark:text-white sm:text-[3.85rem]">NEXUS</h1>
          </div>

          <div className="max-w-[22rem] pt-10 xl:pl-0 xl:pb-0">
            <p className="text-[1.82rem] font-medium leading-[1.03] tracking-[0.01em] text-slate-950 dark:text-white sm:text-[2.75rem]">
              Sua biblioteca e loja
              <br />
              de jogos mais
              <br />
              <span className="text-[#398CEB]">{TEXTO_AUTENTICA}</span>
            </p>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-[28rem] flex-col items-center xl:items-stretch xl:justify-self-end">
          <div className="mb-6 flex w-full max-w-[24rem] flex-col items-center text-center xl:hidden">
            <div className="flex items-center justify-center gap-3">
              <Logo className="h-14 w-[2.8rem] text-slate-950 dark:text-white" />
              <h1 className="text-[2.6rem] font-black tracking-[0.02em] text-slate-950 dark:text-white">NEXUS</h1>
            </div>

            <p className="mt-5 max-w-[17rem] text-[1.05rem] font-medium leading-[1.05] text-slate-950 dark:text-white">
              Sua biblioteca e loja
              <br />
              de jogos mais
              <br />
              <span className="text-[#398CEB]">{TEXTO_AUTENTICA}</span>
            </p>
          </div>

          <div className="w-full rounded-[2rem] border border-slate-950/8 bg-[rgba(255,255,255,0.7)] p-4 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(22,26,33,0.9)] dark:text-white dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-5 xl:min-h-[32rem] xl:p-5">
            <div className="mb-5">
              <h2 className="text-[2.1rem] font-black tracking-[-0.03em] sm:text-[2.75rem]">Criar Conta</h2>
              <p className="mt-2.5 max-w-[18rem] text-[0.92rem] font-medium leading-[1.08] text-slate-700 dark:text-white/72 sm:text-[0.9rem]">
                {TEXTO_INFO}
                <br />
                para concluir o <strong className="font-black text-slate-950 dark:text-white">cadastro.</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {erroForm && (
                <p className="rounded-xl border border-red-300/30 bg-red-500/12 p-3 text-center text-sm text-red-100">
                  {erroForm}
                </p>
              )}

              <div>
                <label className="mb-1.5 block text-[0.92rem] font-bold text-slate-800 dark:text-white/88">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="auth-input h-12 w-full rounded-[1rem] border border-slate-300/70 bg-white/88 px-4 text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#398CEB] focus:outline-none dark:border-transparent dark:bg-[#1d1a1a] dark:text-white dark:placeholder:text-white/48"
                  placeholder={TEXTO_EXEMPLO_NOME}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[0.92rem] font-bold text-slate-800 dark:text-white/88">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input h-12 w-full rounded-[1rem] px-4 text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#398CEB] focus:outline-none dark:border-transparent dark:bg-[#1d1a1a] dark:text-white dark:placeholder:text-white/48"
                  placeholder="exemplo@nexus.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[0.92rem] font-bold text-slate-800 dark:text-white/88">{'Data de Nascimento'}</label>
                <div className="flex h-12 items-center rounded-[1rem] border border-slate-300/70 bg-white/88 px-4 text-center focus-within:border-[#398CEB] dark:border-transparent dark:bg-[#1d1a1a]">
                  <input
                    ref={diaNascimentoRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={diaNascimento}
                    onChange={(e) => handleDatePartChange(e.target.value, setDiaNascimento, 2, mesNascimentoRef)}
                    className="auth-input h-full w-full bg-transparent text-center text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-white/62"
                    placeholder="Dia"
                  />
                  <span className="px-2 text-xl text-slate-500 dark:text-white/72">/</span>
                  <input
                    ref={mesNascimentoRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={mesNascimento}
                    onChange={(e) => handleDatePartChange(e.target.value, setMesNascimento, 2, anoNascimentoRef)}
                    onKeyDown={(e) => handleDatePartKeyDown(e, mesNascimento, diaNascimentoRef)}
                    className="auth-input h-full w-full bg-transparent text-center text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-white/62"
                    placeholder={TEXTO_MES}
                  />
                  <span className="px-2 text-xl text-slate-500 dark:text-white/72">/</span>
                  <input
                    ref={anoNascimentoRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={anoNascimento}
                    onChange={(e) => handleDatePartChange(e.target.value, setAnoNascimento, 4)}
                    onKeyDown={(e) => handleDatePartKeyDown(e, anoNascimento, mesNascimentoRef)}
                    className="auth-input h-full w-full bg-transparent text-center text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-white/62"
                    placeholder="Ano"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[0.92rem] font-bold text-slate-800 dark:text-white/88">Senha</label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      className="auth-input h-12 w-full rounded-[1rem] border border-slate-300/70 bg-white/88 px-4 pr-12 text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#398CEB] focus:outline-none dark:border-transparent dark:bg-[#1d1a1a] dark:text-white dark:placeholder:text-white/48"
                      placeholder={PLACEHOLDER_SENHA}
                    />
                    <BotaoSenha
                      visivel={mostrarSenha}
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[0.92rem] font-bold text-slate-800 dark:text-white/88">Confirmar Senha</label>
                  <div className="relative">
                    <input
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                      className="auth-input h-12 w-full rounded-[1rem] border border-slate-300/70 bg-white/88 px-4 pr-12 text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#398CEB] focus:outline-none dark:border-transparent dark:bg-[#1d1a1a] dark:text-white dark:placeholder:text-white/48"
                      placeholder={PLACEHOLDER_SENHA}
                    />
                    <BotaoSenha
                      visivel={mostrarConfirmarSenha}
                      onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      className="text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 h-[3.35rem] w-full rounded-full border border-[#398CEB] bg-[linear-gradient(to_right,#4a95ef_0%,#4a95ef_50%,transparent_50%,transparent_100%)] bg-[length:200%_100%] bg-right text-[1.25rem] font-black text-slate-950 transition-all duration-300 hover:bg-left hover:text-black dark:text-white"
              >
                {'Cadastrar \u2192'}
              </button>
            </form>
          </div>

          <p className="mt-3 text-center text-[0.95rem] font-medium text-black dark:text-black">
            {TEXTO_JA_POSSUI}
            <Link to="/entrar" className="font-black text-black transition hover:opacity-75 dark:text-black">
              Entrar.
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
