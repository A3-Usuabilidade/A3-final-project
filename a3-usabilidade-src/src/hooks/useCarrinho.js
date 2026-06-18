import { useState, useEffect, useCallback } from 'react';
import api from '../servicos/api.js';

function obterListaApi(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.value)) return data.value;
  return [];
}

function normalizarJogo(jogo) {
  const categoria = String(jogo.categoria?.nome || jogo.categoria || jogo.nomeCategoria || '').trim();
  const empresa = String(jogo.empresa?.nome || jogo.empresa || jogo.nomeEmpresa || jogo.empresa_nome || '').trim();

  return {
    id: jogo.id || jogo.idJogo || jogo.jogoId || null,
    nome: String(jogo.nome || jogo.titulo || '').trim(),
    categoria: categoria || 'Sem classificação',
    empresa: empresa || 'Empresa não informada',
    preco: Number(jogo.preco || jogo.valor || 0),
    capa: jogo.capa || jogo.imagem || jogo.urlImagem || jogo.imageUrl || '',
  };
}

function obterItensCarrinho(data) {
  if (Array.isArray(data?.carrinho?.itens)) return data.carrinho.itens;
  if (Array.isArray(data?.itens)) return data.itens;
  if (Array.isArray(data?.value?.itens)) return data.value.itens;
  return [];
}

// O carrinho da API guarda apenas o id do jogo e a quantidade, então juntamos
// com o catálogo para conseguir nome, capa e preço de cada item.
export default function useCarrinho() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const [respostaCarrinho, respostaPublicos, respostaAutenticados] = await Promise.all([
        api.get('/carrinho/ativo'),
        api.get('/public/jogos').catch(() => ({ data: [] })),
        api.get('/jogos').catch(() => ({ data: [] })),
      ]);

      const catalogo = [
        ...obterListaApi(respostaPublicos.data),
        ...obterListaApi(respostaAutenticados.data),
      ].map(normalizarJogo);

      const detalhesPorId = new Map();
      catalogo.forEach((jogo) => {
        if (jogo.id != null) detalhesPorId.set(String(jogo.id), jogo);
      });

      const itensCarrinho = obterItensCarrinho(respostaCarrinho.data).map((item) => {
        const idJogo = item.fkJogo ?? item.jogoId ?? item.id;
        const detalhes = detalhesPorId.get(String(idJogo)) || {};

        return {
          id: idJogo,
          quantidade: Number(item.quantidade || 1),
          nome: detalhes.nome || item.nome || `Jogo #${idJogo}`,
          categoria: detalhes.categoria || '',
          empresa: detalhes.empresa || '',
          preco: detalhes.preco ?? Number(item.preco || item.valor || 0),
          capa: detalhes.capa || '',
        };
      });

      setItens(itensCarrinho);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErro('Não foi possível carregar o carrinho. Verifique se o backend está rodando e tente novamente.');
      }
      setItens([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const remover = useCallback(async (jogoId) => {
    setErro('');
    try {
      await api.post('/carrinho/remove', { jogoId });
      await carregar();
      return true;
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível remover o item do carrinho.');
      return false;
    }
  }, [carregar]);

  const finalizar = useCallback(async () => {
    await api.post('/carrinho/finalizar');
    await carregar();
  }, [carregar]);

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const quantidade = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return {
    itens,
    total,
    quantidade,
    carregando,
    erro,
    remover,
    finalizar,
    recarregar: carregar,
  };
}
