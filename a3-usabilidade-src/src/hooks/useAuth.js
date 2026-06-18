import { useState, useCallback } from 'react';
import api from '../servicos/api.js';

function obterToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function limparToken() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('refreshToken');
}

function decodificarToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [usuario, setUsuario] = useState(() => {
    const token = obterToken();
    if (!token) return null;

    const payload = decodificarToken(token);
    if (payload && payload.exp * 1000 > Date.now()) {
      return { id: payload.id, nome: payload.nome, perfil: payload.perfil };
    }

    limparToken();
    return null;
  });
  const [erro, setErro] = useState(null);

  const entrar = useCallback(async (email, senha, lembrar = false) => {
    setErro(null);
    try {
      const resposta = await api.post('/auth/login', { email, senha });
      const { token, refreshToken } = resposta.data;
      const storage = lembrar ? localStorage : sessionStorage;
      const outroStorage = lembrar ? sessionStorage : localStorage;
      storage.setItem('token', token);
      outroStorage.removeItem('token');
      // O refresh token (quando o backend o envia) é guardado no mesmo
      // storage do token, respeitando o "lembrar de mim".
      outroStorage.removeItem('refreshToken');
      if (refreshToken) {
        storage.setItem('refreshToken', refreshToken);
      } else {
        storage.removeItem('refreshToken');
      }
      const payload = decodificarToken(token);
      const usuarioLogado = { id: payload.id, nome: payload.nome, perfil: payload.perfil };
      setUsuario(usuarioLogado);
      return usuarioLogado;
    } catch (erroCapturado) {
      const mensagem = erroCapturado.response?.data?.message || 'Erro ao fazer login.';
      setErro(mensagem);
      throw erroCapturado;
    }
  }, []);

  const sair = useCallback(() => {
    limparToken();
    setUsuario(null);
  }, []);

  return {
    usuario,
    estaAutenticado: !!usuario,
    ehAdmin: usuario?.perfil === 'Administrador',
    carregando: false,
    erro,
    entrar,
    sair,
  };
}