'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './pacientes.module.css';

// Linha inteira clicável. O link do nome continua disponível para teclado e leitores de tela.
export function LinhaPaciente({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();

  function navegar(e: React.MouseEvent<HTMLTableRowElement>) {
    if ((e.target as HTMLElement).closest('a')) return;
    router.push(href);
  }

  return (
    <tr className={styles.linha} onClick={navegar}>
      {children}
    </tr>
  );
}
