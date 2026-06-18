import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

export default function ThemeToggleGlobal() {
  const { pathname } = useLocation();

  if (pathname === '/cadastro') {
    return <ThemeToggle variant="auth" position="authTopRight" />;
  }

  if (pathname === '/entrar') {
    return <ThemeToggle variant="auth" position="floating" />;
  }

  return <ThemeToggle variant="surface" position="floating" />;
}
