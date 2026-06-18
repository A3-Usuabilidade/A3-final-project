import axios from 'axios';
import configuracaoApi from '../configuracao/api.js';

const api = axios.create({
  baseURL: configuracaoApi.baseURL,
  timeout: configuracaoApi.timeout,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function obterRefreshToken() {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
}

// Mantém o token (e o novo refresh token) no mesmo storage que já estava em uso,
// preservando a escolha de "lembrar de mim".
function guardarTokens(token, refreshToken) {
  const usaLocal = Boolean(localStorage.getItem('token') || localStorage.getItem('refreshToken'));
  const storage = usaLocal ? localStorage : sessionStorage;
  if (token) storage.setItem('token', token);
  if (refreshToken) storage.setItem('refreshToken', refreshToken);
}

function encerrarSessao() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('refreshToken');
  window.location.href = '/entrar';
}

let renovacaoEmAndamento = null;

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const requisicao = erro.config;
    const status = erro.response?.status;
    const ehRotaAuth = requisicao?.url?.includes('/auth/');

    if (status !== 401 || ehRotaAuth) {
      return Promise.reject(erro);
    }

    // Tenta renovar a sessão uma única vez usando o refresh token.
    const refreshToken = obterRefreshToken();
    if (refreshToken && requisicao && !requisicao._tentouRenovar) {
      requisicao._tentouRenovar = true;
      try {
        // Reaproveita uma renovação já em curso para não disparar várias.
        renovacaoEmAndamento = renovacaoEmAndamento || api.post('/auth/refresh', { refreshToken });
        const { data } = await renovacaoEmAndamento;
        renovacaoEmAndamento = null;

        if (data?.token) {
          guardarTokens(data.token, data.refreshToken);
          requisicao.headers = requisicao.headers || {};
          requisicao.headers.Authorization = `Bearer ${data.token}`;
          return api(requisicao);
        }
      } catch {
        renovacaoEmAndamento = null;
      }
    }

    // Sem refresh token ou renovação falhou: encerra a sessão.
    encerrarSessao();
    return Promise.reject(erro);
  }
);

export default api;
