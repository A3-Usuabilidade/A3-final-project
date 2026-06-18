import { Outlet, useLocation } from 'react-router-dom';

export default function LayoutAuth() {
  const location = useLocation();
  const ehCadastro = location.pathname === '/cadastro';
  const ehLogin = location.pathname === '/entrar';

  if (ehCadastro) {
    return (
      <div
        className="relative min-h-screen overflow-hidden bg-[linear-gradient(96deg,#f7fbff_0%,#eef5fc_26%,#d6e6f8_44%,#8db5e8_68%,#2f5f99_100%)] dark:bg-[linear-gradient(96deg,#000000_0%,#000000_28%,#07101b_33%,#234f88_46%,#d7e5f8_74%,#f4f8fe_100%)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_36%_44%,rgba(57,140,235,0.28)_0%,rgba(57,140,235,0.12)_18%,rgba(0,0,0,0)_40%)] dark:bg-[radial-gradient(circle_at_36%_44%,rgba(57,140,235,0.42)_0%,rgba(57,140,235,0.14)_18%,rgba(0,0,0,0)_40%)]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.75'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '220px 220px',
            opacity: 5,
            mixBlendMode: 'soft-light',
          }}
        />
        <div className="relative z-10 min-h-screen">
          <Outlet />
        </div>
      </div>
    );
  }

  if (ehLogin) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(96deg,#f7fbff_0%,#eef5fc_26%,#d6e6f8_44%,#8db5e8_68%,#2f5f99_100%)] dark:bg-[linear-gradient(96deg,#000000_0%,#000000_28%,#07101b_33%,#234f88_46%,#d7e5f8_74%,#f4f8fe_100%)] md:flex md:min-h-screen md:flex-col md:items-center md:justify-center md:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_42%,rgba(57,140,235,0.24)_0%,rgba(57,140,235,0.10)_18%,rgba(0,0,0,0)_42%)] dark:bg-[radial-gradient(circle_at_36%_44%,rgba(57,140,235,0.42)_0%,rgba(57,140,235,0.14)_18%,rgba(0,0,0,0)_40%)]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '220px 220px',
            opacity: 0.08,
            mixBlendMode: 'soft-light',
          }}
        />

        <div className="relative z-10 flex w-full flex-col items-center md:min-h-0">
          <Outlet />
        </div>

        <div className="relative z-10 mt-8 hidden space-x-2 text-center text-sm font-medium text-slate-700 dark:text-white/78 md:block">
          <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Termos de Uso</a>
          <span>&bull;</span>
          <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Politica de Privacidade</a>
          <span>&bull;</span>
          <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Suporte</a>
        </div>
        <p className="relative z-10 mb-4 mt-2 hidden text-center text-xs font-medium text-slate-600 dark:text-white/62 md:block">
          &copy; 2026 NEXUS DIGITAL STORE. TODOS OS DIREITOS RESERVADOS.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(96deg,#f7fbff_0%,#eef5fc_26%,#d6e6f8_44%,#8db5e8_68%,#2f5f99_100%)] p-4 dark:bg-[linear-gradient(96deg,#000000_0%,#000000_28%,#07101b_33%,#234f88_46%,#d7e5f8_74%,#f4f8fe_100%)]"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_34%_42%,rgba(57,140,235,0.24)_0%,rgba(57,140,235,0.1)_18%,rgba(0,0,0,0)_42%)] dark:bg-[radial-gradient(circle_at_36%_44%,rgba(57,140,235,0.42)_0%,rgba(57,140,235,0.14)_18%,rgba(0,0,0,0)_40%)]"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '220px 220px',
          opacity: 0.08,
          mixBlendMode: 'soft-light',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <Outlet />
      </div>

      <div className="relative z-10 mt-8 space-x-2 text-center text-sm font-medium text-slate-700 dark:text-white/78">
        <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Termos de Uso</a>
        <span>&bull;</span>
        <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Politica de Privacidade</a>
        <span>&bull;</span>
        <a href="#" className="transition-colors hover:text-slate-950 dark:hover:text-white">Suporte</a>
      </div>
      <p className="relative z-10 mb-4 mt-2 text-center text-xs font-medium text-slate-600 dark:text-white/62">
        &copy; 2026 NEXUS DIGITAL STORE. TODOS OS DIREITOS RESERVADOS.
      </p>
    </div>
  );
}
