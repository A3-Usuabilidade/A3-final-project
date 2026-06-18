import { Link } from 'react-router-dom';
import BotaoSenha from '../ui/Botaosenha.jsx';
import Logo from '../Logo.jsx';

const TEXTO_LOGIN = 'Faça ';

export default function LoginDesktop({
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
    <div className="mx-auto hidden w-full max-w-md pt-8 md:block">
      <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 md:p-8">
        <div className="mb-6 text-center">
          <Link to="/loja" className="block">
            <Logo className="mx-auto mb-3 h-20" />
            <h1 className="text-5xl font-bold text-on-surface">
              <strong className="font-black text-slate-950 dark:text-white">NEXUS</strong>
            </h1>
          </Link>
          <p className="mt-1 text-sm text-on-surface-variant">
            {TEXTO_LOGIN}
            <strong className="font-black text-slate-950 dark:text-white">login</strong>
            {' para acessar a sua biblioteca de jogos.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email-desktop" className="mb-1 block text-sm text-on-surface-variant">
              Email
            </label>
            <input
              id="login-email-desktop"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? 'login-email-desktop-error' : undefined}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none"
              placeholder="name@example.com"
              required
            />
            <p
              id="login-email-desktop-error"
              aria-live="polite"
              className={`mt-2 text-sm text-error ${erros.email ? 'block' : 'hidden'}`}
            >
              {erros.email}
            </p>
          </div>

          <div>
            <label htmlFor="login-senha-desktop" className="mb-1 block text-sm text-on-surface-variant">
              Senha
            </label>
            <div className="relative">
              <input
                id="login-senha-desktop"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => onSenhaChange(e.target.value)}
                aria-invalid={Boolean(erros.senha)}
                aria-describedby={erros.senha ? 'login-senha-desktop-error' : undefined}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none"
                placeholder="Sua senha"
                required
              />
              <BotaoSenha visivel={mostrarSenha} onClick={onToggleSenha} />
            </div>
            <p
              id="login-senha-desktop-error"
              aria-live="polite"
              className={`mt-2 text-sm text-error ${erros.senha ? 'block' : 'hidden'}`}
            >
              {erros.senha}
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => onLembrarChange(e.target.checked)}
              className="h-4 w-4 rounded border border-slate-400 bg-slate-300/70 accent-[#398CEB]"
            />
            Lembre-se de mim
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-[2] cursor-pointer rounded-full border border-primary bg-primary py-2.5 font-semibold text-on-primary transition hover:brightness-90"
            >
              Login
            </button>
            <span className="text-sm text-on-surface-variant">ou</span>
            <Link
              to="/cadastro"
              className="inline-flex flex-[1] items-center justify-center rounded-full border border-primary bg-[linear-gradient(to_right,var(--color-primary)_0%,var(--color-primary)_50%,transparent_50%,transparent_100%)] bg-[length:200%_100%] bg-right py-2.5 text-center text-sm font-semibold text-on-surface transition hover:bg-left hover:text-black"
            >
              Criar Conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
