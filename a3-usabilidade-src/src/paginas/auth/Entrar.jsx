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
          <Logo className="h-20 mx-auto mb-3" />
          <h1 className="text-5xl font-bold text-on-surface"><strong className="font-black text-slate-950 dark:text-white">NEXUS</strong></h1>
          <p className="text-on-surface-variant mt-1 text-sm">Faça <strong className="font-black text-slate-950 dark:text-white">login</strong> para acessar a sua biblioteca de jogos.</p>
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
          className="h-4 w-4 rounded border border-slate-400 bg-slate-300/70 accent-[#398CEB]"
        />
        Lembre-se de mim
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="flex-[2] rounded-full border border-primary bg-primary py-2.5 font-semibold text-on-primary transition cursor-pointer hover:brightness-90"
        >
          Login
        </button>
        <span className="text-on-surface-variant text-sm">ou</span>
        <Link
          to="/cadastro"
          className="flex-[1] inline-flex items-center justify-center rounded-full border border-primary py-2.5 text-center text-sm font-semibold text-on-surface transition [background-size:200%_100%] bg-[linear-gradient(to_right,var(--color-primary)_0%,var(--color-primary)_50%,transparent_50%,transparent_100%)] bg-right hover:bg-left hover:text-black"
        >
          Criar Conta
        </Link>
      </div>
    </form>
      </div>
    </div>
  );
}
