import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import useDashboard from '../../hooks/useDashboard.js';
import CardKPI from '../../componentes/CardKPI.jsx';

const CORES = [
  '#a78bfa','#60a5fa','#34d399','#fb923c',
  '#f472b6','#facc15','#38bdf8','#a3e635','#f87171','#c084fc',
];

function gerarCSV(jogos) {
  const cab   = 'Jogo,Empresa,Total Vendas\n';
  const linhas = jogos.map(j => `"${j.jogo}","${j.empresa}",${j.total_vendas}`).join('\n');
  const blob  = new Blob([cab + linhas], { type: 'text/csv;charset=utf-8' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href = url; a.download = 'relatorio-vendas.csv'; a.click();
  URL.revokeObjectURL(url);
}

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="text-on-surface font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function SemDados({ msg = 'Nenhuma venda registrada ainda.' }) {
  return <p className="text-on-surface-variant text-center py-10 text-sm">{msg}</p>;
}

const abreviar = (s, max = 18) => s?.length > max ? s.slice(0, max) + '…' : s;

export default function Dashboard() {
  const {
    kpis, topJogos, jogosPorEmpresa, rankingCategorias,
    empresas, empresaSelecionada, setEmpresaSelecionada,
    carregando, carregandoEmpresa, erro,
  } = useDashboard();

  if (carregando) return (
    <p className="text-on-surface-variant text-center py-12">Carregando dados do dashboard...</p>
  );
  if (erro) return (
    <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-3 max-w-md mx-auto">{erro}</p>
  );

  const dadosTop      = topJogos.slice(0, 10).map(j => ({ name: abreviar(j.jogo), vendas: j.total_vendas, empresa: j.empresa }));
  const dadosEmpresa  = jogosPorEmpresa.map(j => ({ name: abreviar(j.jogo), vendas: j.total_vendas }));
  const dadosPie      = rankingCategorias.map(c => ({ name: c.categoria, value: c.total_vendas }));
  const ranking       = [...topJogos].sort((a, b) => b.total_vendas - a.total_vendas).slice(0, 10);

  return (
    <div className="space-y-8">

      {/* Cabeçalho */}
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-on-surface">Dashboard</h1>
        <button
          onClick={() => gerarCSV(topJogos)}
          disabled={topJogos.length === 0}
          title={topJogos.length === 0 ? 'Nenhum dado para exportar' : 'Baixar relatório em CSV'}
          className="text-sm text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:text-on-surface hover:bg-surface-container-high transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardKPI rotulo="Usuários" valor={kpis.usuarios} />
        <CardKPI rotulo="Jogos"    valor={kpis.jogos} />
        <CardKPI rotulo="Empresas" valor={kpis.empresas} />
        <CardKPI rotulo="Vendas"   valor={kpis.vendas} />
      </div>

      {/* ── Gráfico 1: Top 10 Jogos Mais Vendidos ── */}
      <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-lg font-semibold text-on-surface">Top 10 — Jogos Mais Vendidos</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Ranking geral por total de vendas</p>
        </div>
        {dadosTop.length === 0 ? <SemDados /> : (
          <div className="p-4">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dadosTop} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipCustom />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="vendas" name="Vendas" radius={[0, 4, 4, 0]}>
                  {dadosTop.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ── Gráfico 2: Jogos Mais Vendidos por Empresa ── */}
      <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-on-surface">Jogos Mais Vendidos por Empresa</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Selecione uma empresa para filtrar</p>
          </div>
          <select
            value={empresaSelecionada}
            onChange={e => setEmpresaSelecionada(e.target.value)}
            className="bg-surface border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Selecione uma empresa...</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
        {!empresaSelecionada ? (
          <SemDados msg="Selecione uma empresa para visualizar o gráfico." />
        ) : carregandoEmpresa ? (
          <SemDados msg="Carregando..." />
        ) : dadosEmpresa.length === 0 ? (
          <SemDados msg="Nenhuma venda registrada para esta empresa." />
        ) : (
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dadosEmpresa} margin={{ left: 8, right: 16, top: 4, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<TooltipCustom />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="vendas" name="Vendas" radius={[4, 4, 0, 0]}>
                  {dadosEmpresa.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ── Gráfico 3 + 4 lado a lado ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Gráfico 3: Ranking de Jogos */}
        <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-lg font-semibold text-on-surface">Ranking de Jogos</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Top 10 por total de vendas</p>
          </div>
          {ranking.length === 0 ? <SemDados /> : (
            <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 w-8">#</th>
                  <th className="px-4 py-3">Jogo</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3 text-right">Vendas</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((j, i) => (
                  <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                    <td className="px-4 py-2.5 text-on-surface-variant text-sm font-bold">{i + 1}</td>
                    <td className="px-4 py-2.5 text-on-surface text-sm">{j.jogo}</td>
                    <td className="px-4 py-2.5 text-on-surface-variant text-xs">{j.empresa}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-sm font-semibold" style={{ color: CORES[i % CORES.length] }}>
                        {j.total_vendas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Gráfico 4: Ranking por Categoria (Donut) */}
        <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant">
            <h2 className="text-lg font-semibold text-on-surface">Ranking por Categoria</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Distribuição de vendas por categoria</p>
          </div>
          {dadosPie.length === 0 ? <SemDados /> : (
            <div className="p-4">
              <ResponsiveContainer width="100%" height={310}>
                <PieChart>
                  <Pie data={dadosPie} cx="50%" cy="44%" outerRadius={100} innerRadius={50} dataKey="value" nameKey="name" paddingAngle={2}>
                    {dadosPie.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                  </Pie>
                  <Tooltip content={<TooltipCustom />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
