import { useState, useEffect } from 'react';
import api from '../servicos/api.js';

export default function useDashboard() {
  const [kpis, setKpis] = useState({ usuarios: 0, jogos: 0, empresas: 0, vendas: 0 });
  const [topJogos, setTopJogos] = useState([]);           // [{jogo, empresa, total_vendas}]
  const [jogosPorEmpresa, setJogosPorEmpresa] = useState([]);
  const [rankingCategorias, setRankingCategorias] = useState([]); // derivado no front
  const [empresas, setEmpresas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [carregandoEmpresa, setCarregandoEmpresa] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/jogos'),                                          // tem fkEmpresa, fkCategoria
      api.get('/empresas'),
      api.get('/categorias'),
      api.get('/relatorios/jogos-mais-vendidos', { params: { top: 9999 } }),
    ])
      .then(([usuariosRes, jogosRes, empresasRes, categoriasRes, relatorioRes]) => {
        const todosJogos = jogosRes.data || [];          // [{id, nome, fkEmpresa, fkCategoria, ...}]
        const todasEmpresas = empresasRes.data || [];
        const todasCategorias = categoriasRes.data || [];
        const vendas = relatorioRes.data || [];          // [{jogo, empresa, total_vendas}]

        const totalVendas = vendas.reduce((s, i) => s + i.total_vendas, 0);

        // --- Ranking por categoria: cruzar vendas (por nome de jogo) com jogos (fkCategoria) ---
        const mapaJogoPorNome = {};
        todosJogos.forEach(j => { mapaJogoPorNome[j.nome] = j; });
        const mapaCategoria = {};
        todasCategorias.forEach(c => { mapaCategoria[c.id] = c.nome; });

        const totalPorCategoria = {};
        vendas.forEach(v => {
          const jogoObj = mapaJogoPorNome[v.jogo];
          if (!jogoObj) return;
          const catNome = mapaCategoria[jogoObj.fkCategoria] ?? 'Sem categoria';
          totalPorCategoria[catNome] = (totalPorCategoria[catNome] || 0) + v.total_vendas;
        });

        const rankingCat = Object.entries(totalPorCategoria)
          .map(([categoria, total_vendas]) => ({ categoria, total_vendas }))
          .sort((a, b) => b.total_vendas - a.total_vendas);

        setKpis({
          usuarios: usuariosRes.data.length,
          jogos: todosJogos.length,
          empresas: todasEmpresas.length,
          vendas: totalVendas,
        });
        setTopJogos(vendas);
        setEmpresas(todasEmpresas);
        setCategorias(todasCategorias);
        setRankingCategorias(rankingCat);
      })
      .catch(() => setErro('Erro ao carregar dados do dashboard'))
      .finally(() => setCarregando(false));
  }, []);

  // Recarrega quando empresa selecionada muda
  useEffect(() => {
    if (!empresaSelecionada) { setJogosPorEmpresa([]); return; }
    setCarregandoEmpresa(true);
    api.get('/relatorios/jogos-mais-vendidos', { params: { top: 10, empresa: empresaSelecionada } })
      .then(res => setJogosPorEmpresa(res.data || []))
      .catch(() => setJogosPorEmpresa([]))
      .finally(() => setCarregandoEmpresa(false));
  }, [empresaSelecionada]);

  return {
    kpis, topJogos, jogosPorEmpresa, rankingCategorias,
    empresas, categorias, empresaSelecionada, setEmpresaSelecionada,
    carregando, carregandoEmpresa, erro,
  };
}
