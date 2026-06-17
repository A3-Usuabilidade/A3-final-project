export default function CardKPI({ rotulo, valor }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-2xl p-6">
      <p className="text-sm text-on-surface-variant">{rotulo}</p>
      <p className="text-4xl font-bold text-on-surface mt-2">{valor}</p>
    </div>
  );
}
