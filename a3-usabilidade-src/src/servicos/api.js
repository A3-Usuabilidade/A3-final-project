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

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/entrar';
    }
    return Promise.reject(erro);
  }
);

export default api;
