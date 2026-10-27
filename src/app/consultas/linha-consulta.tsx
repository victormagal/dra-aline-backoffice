'use client';

import Link from 'next/link';
import { useState } from 'react';
import { statusRotulo, type Consulta } from '../../lib/consultas.data';
import { ExcluirConsultaDialog } from './excluir-consulta-dialog';
import styles from './consultas.module.css';

export function LinhaConsulta({ consulta: c }: { consulta: Consulta }) {
  const [confirmando, setConfirmando] = useState(false);
  // Simulação: até a API existir, a exclusão só tira a linha da tela
  const [excluida, setExcluida] = useState(false);

  if (excluida) return null;

  return (
    <tr>
      <td>{c.data}</td>
      <td>{c.horario}</td>
      <td>{c.paciente}</td>
      <td>{c.tipo}</td>
      <td>{c.ig}</td>
      <td><span className={`${styles.pill} ${styles[c.status]}`}>{statusRotulo[c.status]}</span></td>
      <td className={styles.acoesCelula}>
        <Link
          href={`/consultas/${c.id}/editar`}
          className={styles.icone}
          aria-label={`Editar consulta de ${c.paciente} em ${c.data} às ${c.horario}`}
          title="Editar"
        >
          <IconeEditar />
        </Link>
        <button
          type="button"
          className={`${styles.icone} ${styles.iconeExcluir}`}
          aria-label={`Excluir consulta de ${c.paciente} em ${c.data} às ${c.horario}`}
          title="Excluir"
          onClick={() => setConfirmando(true)}
        >
          <IconeExcluir />
        </button>
        {confirmando && (
          <ExcluirConsultaDialog
            consulta={c}
            onFechar={() => setConfirmando(false)}
            onConfirmar={() => setExcluida(true)}
          />
        )}
      </td>
    </tr>
  );
}

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function IconeEditar() {
  return (
    <svg {...svgProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconeExcluir() {
  return (
    <svg {...svgProps}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
