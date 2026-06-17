export default function BotaoSenha({ visivel, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
    >
      {/* se a senha estiver visivel mostra o emoji de fechado, senao mostra aberto */}
      {visivel ? '🙈' : '👁️'}
    </button>
  );
}