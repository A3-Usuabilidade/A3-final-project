import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resUsuarios = await api.get('/usuarios');
      setUsuarios(Array.isArray(resUsuarios.data) ? resUsuarios.data : []);
    } catch {
      setErro('Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarDados(); }, [buscarDados]);

  const atualizarUsuario = async (id, dados) => {
    await api.put(`/usuarios/${id}`, dados);
    setUsuarios((prev) =>
      prev.map((u) =>
        Number(u.id) === Number(id)
          ? { ...u, ...dados, id: Number(id) }
          : u
      )
    );
  };

  const deletarUsuario = async (id) => {
    await api.delete(`/usuarios/${id}`);
    setUsuarios((prev) => prev.filter((u) => Number(u.id) !== Number(id)));
  };

  return { usuarios, carregando, erro, atualizarUsuario, deletarUsuario };
}
