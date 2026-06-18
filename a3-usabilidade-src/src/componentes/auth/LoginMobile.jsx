import { Link } from 'react-router-dom';
import BotaoSenha from '../ui/Botaosenha.jsx';
import Logo from '../Logo.jsx';

export default function LoginMobile({
  email,
  senha,
  lembrar,
  mostrarSenha,
  erros,
  onEmailChange,
  onSenhaChange,
  onLembrarChange,
  onToggleSenha,
  onSubmit,
}) {
  return (
    <div className="w-full md:hidden">
      <div className="mx-auto w-full max-w-[430px] px-6 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-[calc(env(safe-area-inset-top)+clamp(64px,10svh,96px))]">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-16 text-slate-950 dark:text-white" />
          <h1 className="mt-[18px] text-[clamp(34px,9vw,44px)] font-extrabold leading-none text-slate-950 dark:text-white">
            NEXUS
          </h1>
          <p className="mt-[18px] max-w-[310px] text-[15px] leading-[1.5] text-slate-700 dark:text-white/62">
            Faça login para acessar sua biblioteca e a loja.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-[52px] flex flex-col gap-[22px]" noValidate>
          <div>
            <label htmlFor="login-email-mobile" className="mb-2 block text-sm font-bold text-slate-950 dark:text-white/96">
              E-mail
            </label>
            <input
              id="login-email-mobile"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? 'login-email-mobile-error' : undefined}
              className="h-14 w-full rounded-full border border-slate-300/80 bg-white/95 px-5 text-slate-950 outline-none placeholder:text-slate-500 shadow-[0_6px_18px_rgba(15,23,42,0.06)] focus:border-[#398CEB] focus:shadow-[0_0_0_3px_rgba(57,140,235,0.20)] dark:border-[#5f6775] dark:bg-[#2b313c] dark:text-white dark:placeholder:text-white/44 dark:shadow-none"
              placeholder="name@example.com"
              required
            />
            <p
              id="login-email-mobile-error"
              aria-live="polite"
              className={`mt-2 text-sm text-[#F87171] ${erros.email ? 'block' : 'hidden'}`}
            >
              {erros.email}
            </p>
          </div>

          <div>
            <label htmlFor="login-senha-mobile" className="mb-2 block text-sm font-bold text-slate-950 dark:text-white/96">
              Senha
            </label>
            <div className="relative">
              <input
                id="login-senha-mobile"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => onSenhaChange(e.target.value)}
                aria-invalid={Boolean(erros.senha)}
                aria-describedby={erros.senha ? 'login-senha-mobile-error' : undefined}
                className="h-14 w-full rounded-full border border-slate-300/80 bg-white/95 px-5 pr-12 text-slate-950 outline-none placeholder:text-slate-500 shadow-[0_6px_18px_rgba(15,23,42,0.06)] focus:border-[#398CEB] focus:shadow-[0_0_0_3px_rgba(57,140,235,0.20)] dark:border-[#5f6775] dark:bg-[#2b313c] dark:text-white dark:placeholder:text-white/44 dark:shadow-none"
                placeholder="Sua senha"
                required
              />
              <BotaoSenha
                visivel={mostrarSenha}
                onClick={onToggleSenha}
                className="text-slate-500 hover:text-slate-800 dark:text-white/38 dark:hover:text-white"
              />
            </div>
            <p
              id="login-senha-mobile-error"
              aria-live="polite"
              className={`mt-2 text-sm text-[#F87171] ${erros.senha ? 'block' : 'hidden'}`}
            >
              {erros.senha}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-white/62">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => onLembrarChange(e.target.checked)}
                className="h-4 w-4 rounded border border-slate-500 bg-white accent-[#398CEB] dark:border-[#7b8494] dark:bg-[#2b313c]"
              />
              Lembre-se de mim
            </label>

            <Link to="/recuperar-senha" className="text-sm font-semibold text-[#2F7FD9] transition hover:opacity-80 dark:text-[#398CEB]">
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            className="h-14 w-full rounded-full bg-[#398CEB] font-bold text-white shadow-[0_12px_30px_rgba(57,140,235,0.30)] transition hover:bg-[#4A95EF] active:bg-[#2F7FD9] focus:outline-none focus:shadow-[0_0_0_3px_rgba(57,140,235,0.22)] dark:shadow-[0_10px_22px_rgba(57,140,235,0.18)]"
          >
            Entrar
          </button>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-400/55 dark:bg-white/16" />
            <span className="text-sm font-medium text-slate-600 dark:text-white/38">ou</span>
            <span className="h-px flex-1 bg-slate-400/55 dark:bg-white/16" />
          </div>

          <Link
            to="/cadastro"
            className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 border-[#398CEB] bg-white/76 font-bold text-[#2F7FD9] shadow-[0_8px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:bg-white/88 focus:outline-none focus:shadow-[0_0_0_3px_rgba(57,140,235,0.18)] dark:bg-transparent dark:text-[#398CEB] dark:shadow-none dark:hover:bg-[#398CEB]/8"
          >
            Criar Conta
          </Link>
        </form>
      </div>
    </div>
  );
}
