import { Outlet } from 'react-router-dom';
import ThemeToggle from '../componentes/ThemeToggle.jsx';
import Navbar from '../componentes/Navbar.jsx';

export default function LayoutApp() {
  return (
    <>
      <Navbar />
      <Outlet />
      <ThemeToggle />
    </>
  );
}
