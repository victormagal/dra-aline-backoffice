import Link from 'next/link';
import { notFound } from 'next/navigation';
import DesfechoForm from './desfecho-form';
import { pacientes } from '../../../../lib/pacientes.data';
import { FORM_REGISTRAR_DESFECHO } from '../../../../lib/desfechos.data';
import styles from '../../nova/nova.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function RegistrarDesfechoPage({ params }: Props) {
  const { id } = await params;
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) notFound();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PACIENTE · {paciente.nome.toUpperCase()}</p>
          <h1>Registrar desfecho</h1>
        </div>
        <div className={styles.actions}>
          <Link href={`/pacientes/${id}`} className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_REGISTRAR_DESFECHO} className={styles.primary}>Salvar desfecho</button>
        </div>
      </header>
      <DesfechoForm />
    </>
  );
}
