import { useState, useCallback, useRef } from 'react';

let idContador = 0;

export default function useToast() {
  const [lista, setLista] = useState([]);
  const timeoutsRef = useRef({});

  const mostrarToast = useCallback((texto, tipo = 'sucesso') => {
    const id = ++idContador;
    setLista((prev) => [...prev, { id, texto, tipo }]);
    timeoutsRef.current[id] = setTimeout(() => {
      setLista((prev) => prev.filter((t) => t.id !== id));
      delete timeoutsRef.current[id];
    }, 4000);
  }, []);

  const removerToast = useCallback((id) => {
    clearTimeout(timeoutsRef.current[id]);
    delete timeoutsRef.current[id];
    setLista((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { lista, mostrarToast, removerToast };
}
