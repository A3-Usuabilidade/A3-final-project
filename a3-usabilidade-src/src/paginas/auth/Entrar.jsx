import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { esquemaLogin } from '../../configuracao/validacao.js';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';
import Logo from '../../componentes/Logo.jsx';

const TEXTO_LOGIN = 'Fa\u00e7a ';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const { entrar, erro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm(null);

    const resultado = esquemaLogin.safeParse({ email, senha });
    if (!resultado.success) {
      setErroForm(resultado.error.issues[0].message);
      return;
    }

    try {
      const usuarioLogado = await entrar(email, senha, lembrar);
      navigate(usuarioLogado.perfil === 'Administrador' ? '/admin' : '/loja');
    } catch {
      // erro ja esta no estado do hook
    }
  };

  return (
    <div className="mx-auto w-full max-w-md pt-8">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {(erroForm || erro) && (
            <p className="rounded-lg border border-error-container bg-error-container/20 p-2 text-center text-sm text-error">
              {erroForm || erro}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-on-surface-variant">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2 text-on-surface placeholder-on-surface-variant transition-colors focus:border-primary focus:outline-none"
                placeholder="Sua senha"
              />
              <BotaoSenha visivel={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)} />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
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
              className="flex-[1] inline-flex items-center justify-center rounded-full border border-primary bg-[linear-gradient(to_right,var(--color-primary)_0%,var(--color-primary)_50%,transparent_50%,transparent_100%)] bg-[length:200%_100%] bg-right py-2.5 text-center text-sm font-semibold text-on-surface transition hover:bg-left hover:text-black"
            >
              Criar Conta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}