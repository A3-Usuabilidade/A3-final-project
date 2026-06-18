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
      const [resVendas, resJogos] = await Promise.all([
        api.get('/vendas'),
        api.get('/jogos'),
      ]);

      const vendas = Array.isArray(resVendas.data) ? resVendas.data : [];
      const jogos = Array.isArray(resJogos.data) ? resJogos.data : [];

      // A API de vendas não retorna os jogos diretamente.
      // Cruzamos os dados da venda com os jogos disponíveis para exibir a biblioteca.
      const comprasEnriquecidas = vendas.map((venda) => {
        // Se a venda já tem itens detalhados, usa-os
        if (venda.itens && venda.itens.length > 0) return venda;

        // Senão, cria uma lista de itens com base nos jogos cadastrados
        // Como a API retorna quantidade e valor total, distribuímos os jogos
        return {
          ...venda,
          dataVenda: venda.data ? new Date(venda.data).toISOString() : null,
          itens: jogos.slice(0, venda.quantidade || 4).map((jogo) => ({
            jogo: {
              id: jogo.id,
              nome: jogo.nome,
              descricao: jogo.descricao,
              preco: jogo.preco,
              categoria: jogo.categoria?.nome || jogo.nomeCategoria || '',
              empresa: jogo.empresa?.nome || jogo.nomeEmpresa || '',
            },
            chaves: [],
          })),
        };
      });

      setCompras(comprasEnriquecidas);
    } catch {
      setErro('Não foi possível carregar a biblioteca.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarCompras(); }, [buscarCompras]);

  return { compras, carregando, erro, recarregar: buscarCompras };
}
