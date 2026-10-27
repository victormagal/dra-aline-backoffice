import Link from 'next/link';
import AgendamentoForm from './agendamento-form';
import { FORM_ID } from '../../../lib/agendamento.data';
import styles from './novo.module.css';

export default function NovoAgendamentoPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CONSULTAS</p>
          <h1>Novo agendamento</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/consultas" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_ID} className={styles.primary}>Salvar agendamento</button>
        </div>
      </header>
      <AgendamentoForm />
    </>
  );
}
