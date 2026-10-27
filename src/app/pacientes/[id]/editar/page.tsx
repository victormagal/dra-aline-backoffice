import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditarFichaForm from './editar-ficha-form';
import { cadastroInicial, FORM_EDITAR_FICHA, pacientes } from '../../../../lib/pacientes.data';
import styles from '../../nova/nova.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function EditarFichaPage({ params }: Props) {
  const { id } = await params;
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) notFound();

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PACIENTE · {paciente.nome.toUpperCase()}</p>
          <h1>Editar ficha</h1>
        </div>
        <div className={styles.actions}>
          <Link href={`/pacientes/${id}`} className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_EDITAR_FICHA} className={styles.primary}>Salvar alterações</button>
        </div>
      </header>
      <EditarFichaForm inicial={cadastroInicial(id)} />
    </>
  );
}
