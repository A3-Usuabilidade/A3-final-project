import { createContext, useContext } from 'react';

// Contexto global de notificações. O valor é a função `mostrarToast(texto, tipo)`
// disponibilizada pelo ProvedorToast no topo da árvore.
export const ContextoToast = createContext(() => {});

export default function useToastContext() {
  return useContext(ContextoToast);
}
