import { useState, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(null);
  const [total, setTotal] = useState(0);
  const [minhaAvaliacao, setMinhaAvaliacao] = useState(null);
  const [minhasAvaliacoes, setMinhasAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarAvaliacoesJogo = useCallback(async (jogoId) => {
    if (!jogoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const { data, status } = await api.get(`/avaliacoes/media/${jogoId}`);
      if (status === 204 || !data) {
        setAvaliacoes([]);
        setMedia(null);
        setTotal(0);
      } else {
        setAvaliacoes(data.avaliacoes || []);
        setMedia(data.media || null);
        setTotal(data.totalAvaliacoes || 0);
      }
    } catch {
      setAvaliacoes([]);
      setMedia(null);
      setTotal(0);
    } finally {
      setCarregando(false);
    }
  }, []);

  const carregarMinhaAvaliacao = useCallback(async (jogoId) => {
    if (!jogoId) return;
    try {
      const { data, status } = await api.get('/avaliacoes', { params: { jogoId } });
      if (status === 204 || !data) {
        setMinhaAvaliacao(null);
      } else {
        setMinhaAvaliacao(data);
      }
    } catch {
      setMinhaAvaliacao(null);
    }
  }, []);

  const carregarMinhasAvaliacoes = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data, status } = await api.get('/avaliacoes');
      if (status === 204 || !data) {
        setMinhasAvaliacoes([]);
      } else {
        setMinhasAvaliacoes(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        setErro('Erro ao carregar avaliações.');
      }
      setMinhasAvaliacoes([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  const criar = useCallback(async (jogoId, nota, comentario) => {
    setErro(null);
    try {
      const { data } = await api.post('/avaliacoes', { jogoId, nota, comentario });
      await carregarAvaliacoesJogo(jogoId);
      await carregarMinhaAvaliacao(jogoId);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao criar avaliação.';
      setErro(msg);
      throw err;
    }
  }, [carregarAvaliacoesJogo, carregarMinhaAvaliacao]);

  const atualizar = useCallback(async (jogoId, nota, comentario) => {
    setErro(null);
    try {
      const { data } = await api.put('/avaliacoes', { jogoId, nota, comentario });
      await carregarAvaliacoesJogo(jogoId);
      await carregarMinhaAvaliacao(jogoId);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao atualizar avaliação.';
      setErro(msg);
      throw err;
    }
  }, [carregarAvaliacoesJogo, carregarMinhaAvaliacao]);

  const enviar = useCallback(async (jogoId, nota, comentario) => {
    if (minhaAvaliacao) {
      return atualizar(jogoId, nota, comentario);
    }
    return criar(jogoId, nota, comentario);
  }, [minhaAvaliacao, criar, atualizar]);

  const remover = useCallback(async (jogoId) => {
    setErro(null);
    try {
      await api.delete('/avaliacoes', { data: { jogoId } });
      await carregarAvaliacoesJogo(jogoId);
      await carregarMinhaAvaliacao(jogoId);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao excluir avaliação.';
      setErro(msg);
      throw err;
    }
  }, [carregarAvaliacoesJogo, carregarMinhaAvaliacao]);

  return {
    avaliacoes,
    media,
    total,
    minhaAvaliacao,
    minhasAvaliacoes,
    carregando,
    erro,
    carregarAvaliacoesJogo,
    carregarMinhaAvaliacao,
    carregarMinhasAvaliacoes,
    enviar,
    remover,
  };
}
