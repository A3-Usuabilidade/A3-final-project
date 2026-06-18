import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';
import useAuth from './useAuth.js';

export default function useProfile() {
  const { usuario } = useAuth();
  const usuarioId = usuario?.id;
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuarioId) {
      setCarregando(false);
      return;
    }
    api.get(`/usuarios/${usuarioId}`)
      .then((res) => setDados(res.data))
      .catch(() => setErro('Erro ao carregar dados do perfil'))
      .finally(() => setCarregando(false));
  }, [usuarioId]);

  const atualizar = useCallback(async (dadosAtualizados) => {
    await api.put(`/usuarios/${usuarioId}`, dadosAtualizados);
    const { data } = await api.get(`/usuarios/${usuarioId}`);
    setDados(data);
  }, [usuarioId]);

  const alterarSenha = useCallback(async ({ currentPassword, newPassword }) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  }, []);

  return { dados, carregando, erro, atualizar, alterarSenha };
}
