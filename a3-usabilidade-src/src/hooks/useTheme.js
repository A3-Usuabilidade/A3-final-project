import { useCallback, useEffect, useState } from 'react';

const EVENTO_TEMA = 'nexus-theme-change';

function obterTemaEscuro() {
  if (typeof window === 'undefined') return false;

  const temaSalvo = window.localStorage.getItem('theme');
  if (temaSalvo) return temaSalvo === 'dark';

  return document.documentElement.classList.contains('dark');
}

function aplicarTema(escuro) {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.toggle('dark', escuro);
  window.localStorage.setItem('theme', escuro ? 'dark' : 'light');
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: { dark: escuro } }));
}

export default function useTheme() {
  const [dark, setDark] = useState(obterTemaEscuro);

  useEffect(() => {
    aplicarTema(dark);
  }, [dark]);

  useEffect(() => {
    function sincronizarTema(evento) {
      if (evento?.detail && typeof evento.detail.dark === 'boolean') {
        setDark(evento.detail.dark);
        return;
      }

      setDark(obterTemaEscuro());
    }

    window.addEventListener(EVENTO_TEMA, sincronizarTema);
    window.addEventListener('storage', sincronizarTema);

    return () => {
      window.removeEventListener(EVENTO_TEMA, sincronizarTema);
      window.removeEventListener('storage', sincronizarTema);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((valorAtual) => !valorAtual);
  }, []);

  const setTheme = useCallback((valor) => {
    setDark(Boolean(valor));
  }, []);

  return {
    dark,
    toggleTheme,
    setTheme,
  };
}
