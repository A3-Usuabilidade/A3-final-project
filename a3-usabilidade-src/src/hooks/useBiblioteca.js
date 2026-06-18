import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useBiblioteca() {
  const [compras, setCompras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarCompras = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get('/vendas');
      setCompras(data);
    } catch {
      setErro('Não foi possível carregar a biblioteca.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarCompras(); }, [buscarCompras]);

  return { compras, carregando, erro, recarregar: buscarCompras };
}
