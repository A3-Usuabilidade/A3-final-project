// src/hooks/useJogos.js
import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useJogos() {
  const [jogos, setJogos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [resJogos, resCategorias, resEmpresas] = await Promise.all([
        api.get('/jogos'),
        api.get('/categorias'),
        api.get('/empresas'),
      ]);
      setJogos(resJogos.data);
      setCategorias(resCategorias.data);
      setEmpresas(resEmpresas.data);
    } catch {
      setErro('Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const criarJogo = async (dados) => {
    const { data } = await api.post('/jogos', dados);
    await buscarDados();
    return data;
  };

  const atualizarJogo = async (id, dados) => {
    const { data } = await api.put(`/jogos/${id}`, dados);
    await buscarDados();
    return data;
  };

  const deletarJogo = async (id) => {
    await api.delete(`/jogos/${id}`);
    await buscarDados();
  };

  return { jogos, categorias, empresas, carregando, erro, criarJogo, atualizarJogo, deletarJogo };
}