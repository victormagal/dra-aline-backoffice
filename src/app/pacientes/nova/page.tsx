import Link from 'next/link';
import NovaPacienteForm from './nova-paciente-form';
import { FORM_NOVA_PACIENTE } from '../../../lib/pacientes.data';
import styles from './nova.module.css';

export default function NovaPacientePage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PACIENTES</p>
          <h1>Nova paciente</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/pacientes" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_NOVA_PACIENTE} className={styles.primary}>Salvar paciente</button>
        </div>
      </header>
      <NovaPacienteForm />
    </>
  );
}
