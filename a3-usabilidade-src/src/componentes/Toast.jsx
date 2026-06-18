import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Toast({ lista, remover }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2" aria-live="polite">
      <AnimatePresence>
        {lista.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md ${
              t.tipo === 'erro'
                ? 'border-error-container bg-error-container/30 text-error'
                : 'border-outline-variant bg-surface-container-high text-on-surface'
            }`}
          >
            <span className="text-sm font-semibold">{t.texto}</span>
            <button
              type="button"
              onClick={() => remover(t.id)}
              aria-label="Fechar notificação"
              className="ml-2 shrink-0 rounded-full p-0.5 opacity-60 transition hover:opacity-100"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
