import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useWishlist() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarWishlist = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get('/lista-desejo');
      setItens(Array.isArray(data) ? data : []);
    } catch {
      setErro('Não foi possível carregar a lista de desejos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarWishlist(); }, [buscarWishlist]);

  // POST /lista-desejo com { jogoId }
  const adicionarJogo = useCallback(async (jogoId) => {
    await api.post('/lista-desejo', { jogoId });
    await buscarWishlist();
  }, [buscarWishlist]);

  // DELETE /lista-desejo com { jogoId } no body
  const removerJogo = useCallback(async (jogoId) => {
    await api.delete('/lista-desejo', { data: { jogoId } });
    await buscarWishlist();
  }, [buscarWishlist]);

  return { itens, carregando, erro, adicionarJogo, removerJogo, recarregar: buscarWishlist };
}
