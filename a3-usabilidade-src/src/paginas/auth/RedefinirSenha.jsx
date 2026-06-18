import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../componentes/Logo.jsx';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';
import { esquemaRedefinirSenha } from '../../configuracao/validacao.js';
import api from '../../servicos/api.js';

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const inputClasse = 'auth-input h-12 w-full rounded-[1rem] border border-slate-300/70 bg-white/88 px-4 pr-12 text-[0.98rem] font-semibold text-slate-900 placeholder:text-slate-500 focus:border-[#398CEB] focus:outline-none dark:border-transparent dark:bg-[#1d1a1a] dark:text-white dark:placeholder:text-white/48';

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    const resultado = esquemaRedefinirSenha.safeParse({ senha, confirmarSenha });
    if (!resultado.success) {
      setErro(resultado.error.issues[0].message);
      return;
    }

    setSalvando(true);
    try {
      await api.post('/auth/reset-password', { token, novaSenha: senha });
      setConcluido(true);
      window.setTimeout(() => navigate('/entrar'), 2500);
    } catch (erroCapturado) {
      setErro(erroCapturado.response?.data?.message || 'Não foi possível redefinir a senha. O link pode ter expirado.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md pt-8">
      <div className="rounded-2xl border border-outline-variant bg-surface-container p-6 md:p-8">
        <div className="mb-6 text-center">
          <Logo className="mx-auto mb-3 h-16" />
          <h1 className="text-2xl font-bold text-on-surface">Redefinir senha</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Escolha uma nova senha para a sua conta.</p>
        </div>

        {!token ? (
          <div className="text-center">
            <p className="rounded-lg border border-error-container bg-error-container/20 p-4 text-sm text-error">
              Link inválido ou incompleto. Solicite um novo link de recuperação.
            </p>
            <Link to="/recuperar-senha" className="mt-5 inline-block text-sm font-semibold text-primary transition hover:opacity-80">
              Pedir novo link
            </Link>
          </div>
        ) : concluido ? (
          <div className="text-center">
            <p className="rounded-lg border border-outline-variant bg-surface-container-high p-4 text-sm text-on-surface">
              Senha redefinida com sucesso! Redirecionando para o login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="nova-senha" className="mb-1.5 block text-sm text-on-surface-variant">Nova senha</label>
              <div className="relative">
                <input
                  id="nova-senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={inputClasse}
                  placeholder="Sua nova senha"
                  required
                />
                <BotaoSenha visivel={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)} />
              </div>
            </div>

            <div>
              <label htmlFor="confirmar-nova-senha" className="mb-1.5 block text-sm text-on-surface-variant">Confirmar nova senha</label>
              <div className="relative">
                <input
                  id="confirmar-nova-senha"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className={inputClasse}
                  placeholder="Repita a nova senha"
                  required
                />
                <BotaoSenha visivel={mostrarConfirmar} onClick={() => setMostrarConfirmar(!mostrarConfirmar)} />
              </div>
            </div>

            {erro && <p aria-live="polite" className="text-sm text-error">{erro}</p>}

            <button
              type="submit"
              disabled={salvando}
              className="w-full cursor-pointer rounded-full border border-primary bg-primary py-2.5 font-semibold text-on-primary transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </form>
        )}
      </div>
      <p className="mt-3 text-center text-sm font-medium text-on-surface">
        <Link to="/entrar" className="font-black text-primary transition hover:opacity-75">Voltar para o login</Link>
      </p>
    </div>
  );
}
