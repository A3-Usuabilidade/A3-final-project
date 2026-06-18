import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../componentes/Logo.jsx';
import { esquemaRecuperarSenha } from '../../configuracao/validacao.js';
import api from '../../servicos/api.js';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    const resultado = esquemaRecuperarSenha.safeParse({ email });
    if (!resultado.success) {
      setErro(resultado.error.issues[0].message);
      return;
    }

    setEnviando(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } catch {
      // Não revelamos se o e-mail existe; mostramos sempre a mesma confirmação.
    } finally {
      setEnviando(false);
      setEnviado(true);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md pt-8">
      <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 md:p-8">
        <div className="mb-6 text-center">
          <Logo className="mx-auto mb-3 h-16" />
          <h1 className="text-2xl font-bold text-on-surface">Recuperar senha</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Informe seu e-mail e enviaremos um link para redefinir a sua senha.
          </p>
        </div>

        {enviado ? (
          <div className="text-center">
            <p className="rounded-lg border border-outline-variant bg-surface-container-high p-4 text-sm text-on-surface">
              Se houver uma conta associada a <strong>{email}</strong>, você receberá um e-mail com o link de redefinição.
            </p>
            <Link to="/entrar" className="mt-5 inline-block text-sm font-semibold text-primary transition hover:opacity-80">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="recuperar-email" className="mb-1 block text-sm text-on-surface-variant">E-mail</label>
              <input
                id="recuperar-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(erro)}
                aria-describedby={erro ? 'recuperar-email-error' : undefined}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none"
                placeholder="name@example.com"
                required
              />
              {erro && <p id="recuperar-email-error" aria-live="polite" className="mt-2 text-sm text-error">{erro}</p>}
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="w-full cursor-pointer rounded-full border border-primary bg-primary py-2.5 font-semibold text-on-primary transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-medium text-on-surface">
        Lembrou a senha?{' '}
        <Link to="/entrar" className="font-black text-primary transition hover:opacity-75">Entrar.</Link>
      </p>
    </div>
  );
}
