import { useState, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useAvaliacoes(jogoId) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [resumo, setResumo] = useState({ media: 0, total: 0 });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarAvaliacoes = useCallback(async (id) => {
    const alvo = id || jogoId;
    if (!alvo) return;
    setCarregando(true);
    setErro(null);
    try {
      // GET /avaliacoes/media/:jogoId retorna { media, totalAvaliacoes, avaliacoes }
      const { data } = await api.get(`/avaliacoes/media/${alvo}`);

      if (data && data.avaliacoes) {
        setAvaliacoes(data.avaliacoes);
        setResumo({ media: data.media || 0, total: data.totalAvaliacoes || 0 });
      } else {
        // 204 sem conteúdo
        setAvaliacoes([]);
        setResumo({ media: 0, total: 0 });
      }
    } catch (err) {
      // 204 retorna como erro no axios
      if (err.response?.status === 204) {
        setAvaliacoes([]);
        setResumo({ media: 0, total: 0 });
      } else {
        setErro('Não foi possível carregar as avaliações.');
      }
    } finally {
      setCarregando(false);
    }
  }, [jogoId]);

  // POST /avaliacoes com { jogoId, nota, comentario }
  const criarAvaliacao = useCallback(async (idJogo, nota, comentario) => {
    await api.post('/avaliacoes', { jogoId: idJogo, nota, comentario });
  }, []);

  // PUT /avaliacoes com { jogoId, nota, comentario }
  const editarAvaliacao = useCallback(async (idJogo, nota, comentario) => {
    await api.put('/avaliacoes', { jogoId: idJogo, nota, comentario });
  }, []);

  return {
    avaliacoes,
    resumo,
    carregando,
    erro,
    buscarAvaliacoes,
    criarAvaliacao,
    editarAvaliacao,
  };
}
