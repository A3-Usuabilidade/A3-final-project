import { useState, useEffect } from 'react';
import api from '../servicos/api.js';

export default function useDashboard() {
  const [kpis, setKpis] = useState(null);
  const [topJogos, setTopJogos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/usuarios'),
      api.get('/jogos'),
      api.get('/empresas'),
      api.get('/relatorios/jogos-mais-vendidos', { params: { top: 9999 } }),
    ])
      .then(([usuariosRes, jogosRes, empresasRes, relatorioRes]) => {
        const totalVendas = relatorioRes.data.reduce(
          (soma, item) => soma + item.total_vendas,
          0,
        );

        setKpis({
          usuarios: usuariosRes.data.length,
          jogos: jogosRes.data.length,
          empresas: empresasRes.data.length,
          vendas: totalVendas,
        });
        setTopJogos(relatorioRes.data);
      })
      .catch(() => setErro('Erro ao carregar dados do dashboard'))
      .finally(() => setCarregando(false));
  }, []);

  return { kpis, topJogos, carregando, erro };
}
