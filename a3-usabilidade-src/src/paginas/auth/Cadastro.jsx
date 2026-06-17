import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../servicos/api.js';
import { esquemaCadastro } from '../../configuracao/validacao.js';
import BotaoSenha from '../../componentes/ui/Botaosenha.jsx';
import Logo from '../../componentes/Logo.jsx';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
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
    <div className="w-full pt-8">
      <div className="flex flex-col md:flex-row items-stretch justify-between px-6 md:px-12">

        <div className="flex flex-col items-center md:items-start text-center md:text-left justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-32" />
            <h1 className="text-5xl font-bold text-on-surface">NEXUS</h1>
          </div>
          <p className="text-on-surface-variant text-xl mt-3 leading-relaxed">
            Sua biblioteca e loja de jogos mais{' '}
            <span className="text-primary font-medium">autêntica</span>
            .
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-on-surface">Criar conta</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Informe suas informações logo abaixo para concluir o{' '}
                <strong className="text-on-surface font-semibold">cadastro</strong>.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

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
                <p className="text-xs text-on-surface-variant mt-1">Formato DD/MM/AAAA</p>
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
                    placeholder="Mínimo 8 caracteres"
                  />
                  <BotaoSenha visivel={mostrarSenha} onClick={() => setMostrarSenha(!mostrarSenha)} />
                </div>
                <ul className="text-xs text-on-surface-variant mt-1 space-y-0.5 list-disc list-inside">
                  <li>8 a 32 caracteres</li>
                  <li>Pelo menos 1 letra maiúscula</li>
                  <li>Pelo menos 1 letra minúscula</li>
                  <li>Pelo menos 1 número</li>
                  <li>Pelo menos 1 caractere especial (@$!%*?&.)</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                    placeholder="Repita a senha"
                  />
                  <BotaoSenha visivel={mostrarConfirmarSenha} onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold transition-all duration-300 cursor-pointer bg-[linear-gradient(to_right,var(--primary)_50%,transparent_50%)] bg-[length:200%_100%] bg-right-bottom text-on-surface border border-primary hover:bg-left-bottom hover:text-on-primary"
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
          </div>
        </div>
      </div>
    </div>
  );
}
