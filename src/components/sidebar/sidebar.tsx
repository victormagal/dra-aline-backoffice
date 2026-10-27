import NavLink from '../nav-link/nav-link';
import styles from './sidebar.module.css';

const items = [
  { href: '/pacientes', label: 'Pacientes' },
  { href: '/consultas', label: 'Consultas' },
  { href: '/ultrassons', label: 'Ultrassons' },
  { href: '/vacinas', label: 'Vacinas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/clinica', label: 'Perfil da clínica' },
  { href: '/configuracoes', label: 'Configurações' },
];

export default function Sidebar() {
  return (
    <nav className={styles.nav} aria-label="Navegação principal">
      <div className={styles.logo} aria-hidden="true">AM</div>
      <p className={styles.section}>BACKOFFICE</p>
      {items.map((item) => (
        <NavLink key={item.href} href={item.href} className={styles.link} activeClassName={styles.active}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
