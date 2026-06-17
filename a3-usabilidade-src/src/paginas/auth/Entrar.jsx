import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { esquemaLogin } from '../../configuracao/validacao.js';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';
import Logo from '../../componentes/Logo.jsx';

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
      await entrar(email, senha, lembrar);
      navigate('/loja');
    } catch {
      // erro já está no estado do hook
    }
  };

  return (
    <div className="max-w-md mx-auto w-full pt-8">
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8">
        <div className="text-center mb-6">
          <Logo className="h-10 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-on-surface">NEXUS</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Entre na sua biblioteca e loja.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">

      {(erroForm || erro) && (
        <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-2">
          {erroForm || erro}
        </p>
      )}

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          placeholder="name@example.com"
        />
      </div>

      <div>
  <label className="block text-sm text-on-surface-variant mb-1">Senha</label>
  <div className="relative">
    <input
      type={mostrarSenha ? 'text' : 'password'}
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      required
      className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
      placeholder="Sua senha"
    />
    <BotaoSenha visivel={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)} />
  </div>
</div>

      <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
        <input
          type="checkbox"
          checked={lembrar}
          onChange={(e) => setLembrar(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        Lembre-se de mim
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex-[2] bg-primary text-on-primary font-semibold rounded-lg py-2 transition cursor-pointer hover:brightness-90"
        >
          Login
        </button>
        <span className="text-on-surface-variant text-sm">ou</span>
        <Link
          to="/cadastro"
          className="flex-[1] inline-flex items-center justify-center text-center text-sm border border-primary/40 text-on-surface rounded-lg py-2 transition hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_16px_var(--color-primary)]"
        >
          Criar Conta
        </Link>
      </div>
    </form>
      </div>
    </div>
  );
}
