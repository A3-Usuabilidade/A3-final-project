import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { esquemaLogin } from '../../configuracao/validacao.js';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-on-surface text-center">Login</h2>

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

      <button
        type="submit"
        className="w-full bg-primary text-on-primary font-semibold rounded-lg py-2 transition cursor-pointer hover:brightness-90"
      >
        Login
      </button>

      <p className="text-center text-on-surface-variant text-sm">
        Novo na Loja?{' '}
        <Link to="/cadastro" className="text-on-surface-variant hover:text-on-surface underline">
          Crie uma conta
        </Link>
      </p>
    </form>
  );
}
