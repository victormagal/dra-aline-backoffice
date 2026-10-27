'use client';

import { useEffect, useRef } from 'react';
import type { Consulta } from '../../lib/consultas.data';
import styles from './consultas.module.css';

type Props = {
  consulta: Consulta;
  onFechar: () => void;
  onConfirmar: () => void;
};

// Confirmação antes de excluir. Usa o <dialog> nativo: foco preso, Esc fecha e o fundo fica escurecido.
export function ExcluirConsultaDialog({ consulta, onFechar, onConfirmar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="titulo-excluir-consulta" onClose={onFechar}>
      <h2 id="titulo-excluir-consulta" className={styles.dialogTitulo}>Excluir consulta?</h2>
      <p>
        Você está excluindo a consulta de <strong>{consulta.paciente}</strong>, em {consulta.data} às {consulta.horario} ({consulta.tipo}).
      </p>
      <p className={styles.dialogAviso}>Essa ação não pode ser desfeita.</p>
      <div className={styles.dialogAcoes}>
        <button type="button" className={styles.botaoSecundario} onClick={() => ref.current?.close()}>
          Cancelar
        </button>
        <button
          type="button"
          className={styles.botaoPerigo}
          onClick={() => {
            onConfirmar();
            ref.current?.close();
          }}
        >
          Excluir consulta
        </button>
      </div>
    </dialog>
  );
}
