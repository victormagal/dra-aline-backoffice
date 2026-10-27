import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { montarFicha } from '../../../lib/pacientes.data';
import styles from './ficha.module.css';

export type AbaFicha = 'resumo' | 'consultas' | 'exames' | 'ultrassons' | 'vacinas';

const abas: { aba: AbaFicha; rotulo: string; href: (id: string) => string }[] = [
  { aba: 'resumo', rotulo: 'Resumo', href: (id) => `/pacientes/${id}` },
  { aba: 'consultas', rotulo: 'Consultas', href: (id) => `/pacientes/${id}/consultas` },
  { aba: 'exames', rotulo: 'Exames', href: (id) => `/pacientes/${id}/exames` },
  { aba: 'ultrassons', rotulo: 'Ultrassons', href: (id) => `/pacientes/${id}/ultrassons` },
  { aba: 'vacinas', rotulo: 'Vacinas', href: (id) => `/pacientes/${id}/vacinas` },
];

// Cabeçalho e abas da ficha. Cada aba é uma subrota; o conteúdo da aba vem como children.
export function FichaShell({ id, aba, children }: { id: string; aba: AbaFicha; children: ReactNode }) {
  const ficha = montarFicha(id);
  if (!ficha) notFound();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>
            <Link href="/pacientes">Pacientes</Link> › {ficha.nome}
          </p>
          <h1>{ficha.nome}</h1>
          <p className={styles.sub}>
            {ficha.situacao}
            <span className={`${styles.pill} ${ficha.acesso === 'Ativo' ? styles.ok : styles.alerta}`}>
              {ficha.acesso === 'Ativo' ? 'Acesso ativo' : 'Primeiro acesso'}
            </span>
          </p>
        </div>
        <div className={styles.actions}>
          <Link href={`/pacientes/${id}/editar`} className={styles.secondary}>Editar ficha</Link>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Abas da ficha">
        {abas.map((a) => (
          <Link
            key={a.aba}
            href={a.href(id)}
            aria-current={a.aba === aba ? 'page' : undefined}
            className={`${styles.tab} ${a.aba === aba ? styles.tabOn : ''}`}
          >
            {a.rotulo}
          </Link>
        ))}
      </nav>

      {children}
    </>
  );
}
