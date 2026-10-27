import Link from 'next/link';
import NovoExameForm from './novo-exame-form';
import { FORM_NOVO_EXAME } from '../../../lib/exames.data';
import styles from './novo.module.css';

export default function NovoExamePage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>EXAMES</p>
          <h1>Novo exame</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/configuracoes/exames" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_NOVO_EXAME} className={styles.primary}>Salvar exame</button>
        </div>
      </header>
      <NovoExameForm />
    </>
  );
}
