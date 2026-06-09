import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed bottom-4 right-4 z-50 bg-surface-container border border-outline-variant rounded-full p-3 shadow-lg cursor-pointer transition-all duration-500 ease-in-out hover:brightness-90 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 group"
      title={dark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      aria-label={dark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      <span className="relative block w-6 h-6">
        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ease-in-out ${
            dark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-[135deg] scale-50'
          } text-on-surface`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.15" />
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </svg>

        <svg
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ease-in-out ${
            !dark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-[135deg] scale-50'
          } text-on-surface-variant`}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          <circle cx="18" cy="4.5" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="5.5" cy="20" r="0.8" fill="currentColor" opacity="0.4" />
          <circle cx="17" cy="19" r="0.6" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </button>
  );
}
