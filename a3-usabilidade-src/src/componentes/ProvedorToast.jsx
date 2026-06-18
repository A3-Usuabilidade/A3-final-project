import useToast from '../hooks/useToast.js';
import { ContextoToast } from '../hooks/useToastContext.js';
import Toast from './Toast.jsx';

// Mantém a lista de toasts num único lugar e renderiza a pilha global,
// expondo `mostrarToast` para qualquer página via useToastContext().
export default function ProvedorToast({ children }) {
  const { lista, mostrarToast, removerToast } = useToast();

  return (
    <ContextoToast.Provider value={mostrarToast}>
      {children}
      <Toast lista={lista} remover={removerToast} />
    </ContextoToast.Provider>
  );
}
