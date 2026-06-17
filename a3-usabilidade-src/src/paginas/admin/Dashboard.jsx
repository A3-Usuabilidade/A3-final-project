import useDashboard from '../../hooks/useDashboard.js';
import CardKPI from '../../componentes/CardKPI.jsx';

function gerarCSV(jogos) {
  const cabecalho = 'Jogo,Empresa,Total Vendas\n';
  const linhas = jogos
    .map((j) => `"${j.jogo}","${j.empresa}",${j.total_vendas}`)
    .join('\n');
  const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-vendas.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const { kpis, topJogos, carregando, erro } = useDashboard();

  if (carregando) {
    return (
      <p className="text-on-surface-variant text-center py-12">
        Carregando dados do dashboard...
      </p>
    );
  }

  if (erro) {
    return (
      <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-3 max-w-md mx-auto">
        {erro}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-on-surface">Dashboard</h1>
        <button
          onClick={() => gerarCSV(topJogos)}
          disabled={topJogos.length === 0}
          title={topJogos.length === 0 ? 'Nenhum dado para exportar' : 'Baixar relatório em CSV'}
          className="self-start text-sm text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 cursor-pointer hover:text-on-surface hover:bg-surface-container-high transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Exportar CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardKPI rotulo="Usuarios" valor={kpis.usuarios} />
        <CardKPI rotulo="Jogos" valor={kpis.jogos} />
        <CardKPI rotulo="Empresas" valor={kpis.empresas} />
        <CardKPI rotulo="Vendas" valor={kpis.vendas} />
      </div>

      {/* Top 5 jogos mais vendidos */}
      <section className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h2 className="text-lg font-semibold text-on-surface">
            Jogos Mais Vendidos
          </h2>
        </div>

        {topJogos.length === 0 ? (
          <p className="text-on-surface-variant text-center py-12">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Jogo</th>
                <th className="px-6 py-3">Empresa</th>
                <th className="px-6 py-3 text-right">Total Vendas</th>
              </tr>
            </thead>
            <tbody>
              {topJogos.slice(0, 5).map((jogo, i) => (
                <tr
                  key={i}
                  className="border-b border-outline-variant hover:bg-surface-container-high transition"
                >
                  <td className="px-6 py-3 text-on-surface text-sm">{jogo.jogo}</td>
                  <td className="px-6 py-3 text-on-surface-variant text-sm">{jogo.empresa}</td>
                  <td className="px-6 py-3 text-on-surface text-sm text-right font-medium">
                    {jogo.total_vendas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
