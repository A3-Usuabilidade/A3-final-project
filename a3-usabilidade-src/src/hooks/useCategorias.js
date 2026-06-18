import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resCategorias = await api.get('/categorias');
      // 204 → axios devolve data: '' (string vazia), não um array
      setCategorias(Array.isArray(resCategorias.data) ? resCategorias.data : []);
    } catch {
      setErro('Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const criarCategoria = async (dados) => {
    const { data: novaCategoria } = await api.post('/categorias', dados);
    setCategorias((prev) => [...prev, novaCategoria]);
  };

  const atualizarCategoria = async (id, dados) => {
    await api.put(`/categorias/${id}`, dados);
    setCategorias((prev) =>
      prev.map((c) =>
        Number(c.id) === Number(id)
          ? { ...c, ...dados, id: Number(id) }
          : c
      )
    );
  };

  const deletarCategoria = async (id) => {
    await api.delete(`/categorias/${id}`);
    setCategorias((prev) => prev.filter((c) => Number(c.id) !== Number(id)));
  };

  return { categorias, carregando, erro, criarCategoria, atualizarCategoria, deletarCategoria };
}
