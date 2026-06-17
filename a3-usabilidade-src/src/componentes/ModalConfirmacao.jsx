import { AlertTriangle, X } from 'lucide-react';

export default function ModalConfirmacao({ aberto, titulo, mensagem, onConfirmar, onCancelar, erro }) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        className="bg-surface-container border border-outline-variant rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center">
              <AlertTriangle size={20} className="text-error" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface">{titulo}</h3>
          </div>
          <button onClick={onCancelar} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <p className="text-on-surface-variant text-sm mb-6">{mensagem}</p>

        {erro && (
          <p className="text-error text-sm text-center bg-error-container/20 border border-error-container rounded-lg p-2 mb-4">
            {erro}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-medium bg-error text-on-error rounded-lg hover:brightness-110 transition cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
