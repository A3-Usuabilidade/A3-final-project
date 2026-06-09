import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../servicos/api.js';
import { esquemaCadastro } from '../../configuracao/validacao.js';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroForm, setErroForm] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm(null);

    const resultado = esquemaCadastro.safeParse({ nome, email, dataNascimento, senha, confirmarSenha });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-on-surface text-center">Criar Conta</h2>
      <p className="text-on-surface-variant text-sm text-center">
        Preencha os dados abaixo para se registrar no NEXUS.
      </p>

      {erroForm && (
        <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-2">
          {erroForm}
        </p>
      )}

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Nome Completo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          placeholder="Ex: Joao Silva"
        />
      </div>

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          placeholder="exemplo@nexus.com"
        />
      </div>

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Data de Nascimento</label>
        <input
          type="text"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          placeholder="DD/MM/AAAA"
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Confirmar Senha</label>
        <input
          type="password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
          placeholder="Repita a senha"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-on-primary font-semibold rounded-lg py-2 transition cursor-pointer hover:brightness-90"
      >
        Cadastrar
      </button>

      <p className="text-center text-on-surface-variant text-sm">
        Já possui uma conta?{' '}
        <Link to="/entrar" className="text-on-surface-variant hover:text-on-surface underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
