import Link from 'next/link';
import RegistrarUltrassomForm from './registrar-ultrassom-form';
import { FORM_REGISTRAR_ULTRASSOM } from '../../../lib/ultrassons.data';
import styles from './novo.module.css';

export default function RegistrarUltrassomPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ULTRASSONS</p>
          <h1>Registrar ultrassom</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/ultrassons" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_REGISTRAR_ULTRASSOM} className={styles.primary}>Salvar ultrassom</button>
        </div>
      </header>
      <RegistrarUltrassomForm />
    </>
  );
}
