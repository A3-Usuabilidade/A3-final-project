import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resEmpresas = await api.get('/empresas');
      setEmpresas(resEmpresas.data ?? []);
    } catch {
      setErro('Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const criarEmpresa = async (dados) => {
<<<<<<< HEAD
    const { data: novaEmpresa } = await api.post('/empresas', dados);
    setEmpresas((prev) => [...prev, novaEmpresa]);
  };

  const atualizarEmpresa = async (id, dados) => {
    const { data: empresaAtualizada } = await api.put(`/empresas/${id}`, dados);
    setEmpresas((prev) => prev.map((e) => (e.id === id ? empresaAtualizada : e)));
=======
    const { data } = await api.post('/empresas', dados);
    await buscarDados();
    return data;
  };

  const atualizarEmpresa = async (id, dados) => {
    const { data } = await api.put(`/empresas/${id}`, dados);
    await buscarDados();
    return data;
>>>>>>> feature-crud-empresa
  };

  const deletarEmpresa = async (id) => {
    await api.delete(`/empresas/${id}`);
<<<<<<< HEAD
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
=======
    await buscarDados();
>>>>>>> feature-crud-empresa
  };

  return { empresas, carregando, erro, criarEmpresa, atualizarEmpresa, deletarEmpresa };
}
