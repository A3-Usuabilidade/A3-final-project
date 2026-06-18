import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { esquemaLogin } from '../../configuracao/validacao.js';
import LoginMobile from '../../componentes/auth/LoginMobile.jsx';
import LoginDesktop from '../../componentes/auth/LoginDesktop.jsx';

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erros, setErros] = useState({ email: '', senha: '' });
  const { entrar } = useAuth();
  const navigate = useNavigate();

  function limparErros() {
    setErros({ email: '', senha: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    limparErros();

    const resultado = esquemaLogin.safeParse({ email, senha });
    if (!resultado.success) {
      const proximosErros = { email: '', senha: '' };

      resultado.error.issues.forEach((issue) => {
        const campo = issue.path[0];
        if (campo === 'email' || campo === 'senha') {
          proximosErros[campo] = issue.message;
        }
      });

      setErros(proximosErros);
      return;
    }

    try {
      const usuarioLogado = await entrar(email, senha, lembrar);
      navigate(usuarioLogado.perfil === 'Administrador' ? '/admin' : '/loja');
    } catch (erroCapturado) {
      const mensagem = erroCapturado.response?.data?.message || 'Erro ao fazer login.';
      setErros({ email: '', senha: mensagem });
    }
  };

  return (
    <>
      <LoginMobile
        email={email}
        senha={senha}
        lembrar={lembrar}
        mostrarSenha={mostrarSenha}
        erros={erros}
        onEmailChange={setEmail}
        onSenhaChange={setSenha}
        onLembrarChange={setLembrar}
        onToggleSenha={() => setMostrarSenha(!mostrarSenha)}
        onSubmit={handleSubmit}
      />

      <LoginDesktop
        email={email}
        senha={senha}
        lembrar={lembrar}
        mostrarSenha={mostrarSenha}
        erros={erros}
        onEmailChange={setEmail}
        onSenhaChange={setSenha}
        onLembrarChange={setLembrar}
        onToggleSenha={() => setMostrarSenha(!mostrarSenha)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
