function obterIniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

export default function CapaJogo({ jogo, className = '' }) {
  if (jogo.capa) {
    return <img src={jogo.capa} alt={`Capa do jogo ${jogo.nome}`} loading="lazy" decoding="async" className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div role="img" aria-label={`Capa do jogo ${jogo.nome}`} className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,#aed4ff_0,#398ceb_30%,#000000_78%)] ${className}`}>
      <span className="text-4xl font-black tracking-[0.08em] text-white/90" aria-hidden="true">{obterIniciais(jogo.nome)}</span>
    </div>
  );
}
