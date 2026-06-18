import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../servicos/api.js';
import useAuth from './useAuth.js';

function normalizarItensCarrinho(data) {
  let itensList = [];

  if (Array.isArray(data?.carrinho?.itens)) itensList = data.carrinho.itens;
  else if (Array.isArray(data?.itens)) itensList = data.itens;
  else if (Array.isArray(data?.value?.itens)) itensList = data.value.itens;

  return itensList.map((item) => ({
    id: item.fkJogo || item.jogoId || item.id,
    quantidade: item.quantidade || 1,
  }));
}

export default function useCarrinho() {
  const { estaAutenticado } = useAuth();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarCarrinho = useCallback(async () => {
    if (!estaAutenticado) return;

    setCarregando(true);
    setErro(null);

    try {
      const resposta = await api.get('/carrinho/ativo');
      setItens(normalizarItensCarrinho(resposta.data));
    } catch {
      setItens([]);
    } finally {
      setCarregando(false);
    }
  }, [estaAutenticado]);

  useEffect(() => {
    if (!estaAutenticado) {
      setCarregando(false);
      setItens([]);
      return;
    }

    carregarCarrinho();
  }, [estaAutenticado, carregarCarrinho]);

  const quantidade = useMemo(
    () => itens.reduce((acc, item) => acc + Number(item.quantidade || 1), 0),
    [itens],
  );

  const adicionar = useCallback(
    async (jogoId) => {
      if (!estaAutenticado || !jogoId) return false;

      setErro(null);

      try {
        const resposta = await api.post('/carrinho/add', { jogoId });
        setItens(normalizarItensCarrinho(resposta.data));
        return true;
      } catch (erroCapturado) {
        setErro(
          erroCapturado.response?.data?.message ||
            'Nao foi possivel adicionar o jogo ao carrinho.',
        );
        return false;
      }
    },
    [estaAutenticado],
  );

  const remover = useCallback(
    async (jogoId) => {
      if (!estaAutenticado || !jogoId) return false;

      setErro(null);

      try {
        await api.delete(`/carrinho/${jogoId}`);
        await carregarCarrinho();
        return true;
      } catch (erroCapturado) {
        setErro(
          erroCapturado.response?.data?.message ||
            'Nao foi possivel remover o item do carrinho.',
        );
        return false;
      }
    },
    [carregarCarrinho, estaAutenticado],
  );

  const finalizar = useCallback(async () => {
    setErro(null);

    try {
      const resposta = await api.post('/vendas/checkout');
      setItens([]);
      return resposta.data;
    } catch (erroCapturado) {
      setErro(
        erroCapturado.response?.data?.message ||
          'Nao foi possivel finalizar a compra.',
      );
      throw erroCapturado;
    }
  }, []);

  return {
    itens,
    carregando,
    erro,
    quantidade,
    adicionar,
    remover,
    finalizar,
    carregarCarrinho,
  };
}
