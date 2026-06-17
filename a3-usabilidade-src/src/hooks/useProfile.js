import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';
import useAuth from './useAuth.js';

export default function useProfile() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!usuario?.id) return;
    api.get(`/usuarios/${usuario.id}`)
      .then((res) => setDados(res.data))
      .catch(() => setErro('Erro ao carregar dados do perfil'))
      .finally(() => setCarregando(false));
  }, [usuario?.id]);

  const atualizar = useCallback(async (dadosAtualizados) => {
    await api.put(`/usuarios/${usuario.id}`, dadosAtualizados);
    const { data } = await api.get(`/usuarios/${usuario.id}`);
    setDados(data);
  }, [usuario?.id]);

  const alterarSenha = useCallback(async ({ currentPassword, newPassword }) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  }, []);

  return { dados, carregando, erro, atualizar, alterarSenha };
}
