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
    const { data: novoJogo } = await api.post('/jogos', dados);
    setJogos((prev) => [...prev, novoJogo]);
  };

  const atualizarJogo = async (id, dados) => {
    const { data: jogoAtualizado } = await api.put(`/jogos/${id}`, dados);
    setJogos((prev) => prev.map((j) => (j.id === id ? jogoAtualizado : j)));
  };

  const deletarJogo = async (id) => {
    await api.delete(`/jogos/${id}`);
    setJogos((prev) => prev.filter((j) => j.id !== id));
  };

  return { jogos, categorias, empresas, carregando, erro, criarJogo, atualizarJogo, deletarJogo };
}