import { useState, useEffect } from 'react';
import api from '../servicos/api.js';

export default function useDashboard() {
  const [kpis, setKpis] = useState({ usuarios: 0, jogos: 0, empresas: 0, vendas: 0 });
  const [topJogos, setTopJogos] = useState([]);
  const [jogosPorEmpresa, setJogosPorEmpresa] = useState([]);
  const [rankingCategorias, setRankingCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(false);
  const [erro, setErro] = useState(null);

  // A API retorna cada item como { nome, empresa, total } —
  // normaliza aqui para { jogo, empresa, total_vendas }, formato usado no resto do hook/tela.
  const normalizarVendas = (lista) =>
    (Array.isArray(lista) ? lista : []).map(v => ({
      jogo: v.jogo ?? v.nome,
      empresa: v.empresa,
      total_vendas: v.total_vendas ?? v.total,
    }));

  useEffect(() => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/jogos'),
      api.get('/empresas'),
      api.get('/categorias'),
      // 204 = sem dados; axios lança erro só em 4xx/5xx, mas o body pode ser vazio
      api.get('/relatorios/jogos-mais-vendidos', { params: { top: 9999 } })
        .catch(() => ({ data: [] })),
    ])
      .then(([usuariosRes, jogosRes, empresasRes, categoriasRes, relatorioRes]) => {
        const todosJogos    = Array.isArray(jogosRes.data)      ? jogosRes.data      : [];
        const todasEmpresas = Array.isArray(empresasRes.data)   ? empresasRes.data   : [];
        const todasCats     = Array.isArray(categoriasRes.data) ? categoriasRes.data : [];
        // 204 retorna string vazia ou null — garante array já normalizado
        const vendas        = normalizarVendas(relatorioRes.data);

        const totalVendas = vendas.reduce((s, v) => s + (Number(v.total_vendas) || 0), 0);

        // Ranking por categoria: cruza nome do jogo (relatorio) com fkCategoria (jogos)
        const porNome  = Object.fromEntries(todosJogos.map(j => [j.nome, j]));
        const porCatId = Object.fromEntries(todasCats.map(c => [c.id, c.nome]));
        const totalCat = {};
        vendas.forEach(v => {
          const jogo    = porNome[v.jogo];
          if (!jogo) return;
          const catNome = porCatId[jogo.fkCategoria] ?? 'Sem categoria';
          totalCat[catNome] = (totalCat[catNome] || 0) + (Number(v.total_vendas) || 0);
        });
        const rankingCat = Object.entries(totalCat)
          .map(([categoria, total_vendas]) => ({ categoria, total_vendas }))
          .sort((a, b) => b.total_vendas - a.total_vendas);

        setKpis({
          usuarios: usuariosRes.data?.length  ?? 0,
          jogos:    todosJogos.length,
          empresas: todasEmpresas.length,
          vendas:   totalVendas,
        });
        setTopJogos(vendas);
        setEmpresas(todasEmpresas);
        setRankingCategorias(rankingCat);
      })
      .catch(() => setErro('Erro ao carregar dados do dashboard'))
      .finally(() => setCarregando(false));
  }, []);

  // Recarrega quando filtro de empresa muda
  useEffect(() => {
    if (!empresaSelecionada) { setJogosPorEmpresa([]); return; }
    setCarregandoEmpresa(true);
    api.get('/relatorios/jogos-mais-vendidos', { params: { top: 10, empresa: empresaSelecionada } })
      .then(res => setJogosPorEmpresa(normalizarVendas(res.data)))
      .catch(() => setJogosPorEmpresa([]))
      .finally(() => setCarregandoEmpresa(false));
  }, [empresaSelecionada]);

  return {
    kpis, topJogos, jogosPorEmpresa, rankingCategorias,
    empresas, empresaSelecionada, setEmpresaSelecionada,
    carregando, carregandoEmpresa, erro,
  };
}