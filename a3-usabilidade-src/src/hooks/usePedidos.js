import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

function normalizarItem(item) {
  return {
    nome: item.nome || item.titulo || item.jogo?.nome || `Jogo #${item.fkJogo || item.jogoId || item.id}`,
    preco: Number(item.preco ?? item.valor ?? item.jogo?.preco ?? 0),
    quantidade: Number(item.quantidade || 1),
  };
}

function normalizarPedido(pedido) {
  const itens = (pedido.itens || pedido.jogos || []).map(normalizarItem);
  const totalCalculado = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return {
    id: pedido.id || pedido.idPedido || pedido.pedidoId,
    data: pedido.data || pedido.createdAt || pedido.dataPedido || null,
    status: pedido.status || 'Concluído',
    total: Number(pedido.total ?? pedido.valorTotal ?? totalCalculado),
    itens,
  };
}

export default function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const { data } = await api.get('/pedidos');
      const lista = Array.isArray(data) ? data : Array.isArray(data?.value) ? data.value : [];
      setPedidos(lista.map(normalizarPedido));
    } catch (err) {
      if (err.response?.status !== 401) {
        setErro('Não foi possível carregar seus pedidos. Verifique se o backend está rodando e tente novamente.');
      }
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return { pedidos, carregando, erro, recarregar: carregar };
}
