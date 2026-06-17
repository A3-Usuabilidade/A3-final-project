import { Outlet } from 'react-router-dom';
import ThemeToggle from '../componentes/ThemeToggle.jsx';

export default function LayoutApp() {
  return (
    <>
      <Outlet />
      <ThemeToggle />
    </>
  );
}
