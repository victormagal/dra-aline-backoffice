import Link from 'next/link';
import NovoProfissionalForm from './novo-profissional-form';
import { FORM_NOVO_PROFISSIONAL } from '../../../lib/equipe.data';
import styles from './novo.module.css';

export default function NovoProfissionalPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PERFIL DA CLÍNICA · EQUIPE</p>
          <h1>Adicionar profissional</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/equipe" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_NOVO_PROFISSIONAL} className={styles.primary}>Salvar profissional</button>
        </div>
      </header>
      <NovoProfissionalForm />
    </>
  );
}
