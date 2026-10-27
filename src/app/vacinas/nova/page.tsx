import Link from 'next/link';
import NovaVacinaForm from './nova-vacina-form';
import { FORM_NOVA_VACINA } from '../../../lib/vacinas.data';
import styles from './nova.module.css';

export default function NovaVacinaPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>VACINAS</p>
          <h1>Nova vacina</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/vacinas" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_NOVA_VACINA} className={styles.primary}>Salvar vacina</button>
        </div>
      </header>
      <NovaVacinaForm />
    </>
  );
}
