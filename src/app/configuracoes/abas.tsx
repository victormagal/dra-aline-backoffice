import Link from 'next/link';
import styles from './configuracoes.module.css';

export default function AbasConfiguracoes({ ativa }: { ativa: 'formularios' | 'exames' }) {
  return (
    <nav className={styles.tabs} aria-label="Seções de configurações">
      <Link href="/configuracoes" className={`${styles.tab} ${ativa === 'formularios' ? styles.tabOn : ''}`}>Formulários</Link>
      <Link href="/configuracoes/exames" className={`${styles.tab} ${ativa === 'exames' ? styles.tabOn : ''}`}>Catálogo de exames</Link>
    </nav>
  );
}
