import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../servicos/api.js';

export default function useWishlist() {
  const [lista, setLista] = useState([]);
  const [idsDesejados, setIdsDesejados] = useState(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarLista = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get('/lista-desejo');
      const jogos = Array.isArray(data) ? data : [];
      setLista(jogos);
      setIdsDesejados(new Set(jogos.map((j) => j.id)));
    } catch (err) {
      if (err.response?.status !== 401) {
        setErro('Erro ao carregar lista de desejos.');
      }
      setLista([]);
      setIdsDesejados(new Set());
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarLista();
  }, [carregarLista]);

  const adicionar = useCallback(async (jogoId) => {
    try {
      await api.post('/lista-desejo', { jogoId });
      await carregarLista();
      return true;
    } catch (err) {
      if (err.response?.status === 409) {
        await carregarLista();
        return false;
      }
      throw err;
    }
  }, [carregarLista]);

  const remover = useCallback(async (jogoId) => {
    try {
      await api.delete('/lista-desejo', { data: { jogoId } });
      await carregarLista();
      return true;
    } catch {
      return false;
    }
  }, [carregarLista]);

  const idsDesejadosRef = useRef(idsDesejados);

  useEffect(() => {
    idsDesejadosRef.current = idsDesejados;
  }, [idsDesejados]);

  const alternar = useCallback(async (jogoId) => {
    if (idsDesejadosRef.current.has(jogoId)) {
      return remover(jogoId);
    }
    return adicionar(jogoId);
  }, [adicionar, remover]);

  const estaDesejado = useCallback((jogoId) => {
    return idsDesejados.has(jogoId);
  }, [idsDesejados]);

  return {
    lista,
    idsDesejados,
    carregando,
    erro,
    adicionar,
    remover,
    alternar,
    estaDesejado,
    recarregar: carregarLista,
  };
}
