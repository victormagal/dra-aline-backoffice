import Link from 'next/link';
import { notFound } from 'next/navigation';
import AgendamentoForm from '../../novo/agendamento-form';
import { consultas } from '../../../../lib/consultas.data';
import { FORM_ID, profissionais } from '../../../../lib/agendamento.data';
import type { AgendamentoInput } from '../../../../lib/agendamento.schema';
import styles from '../../novo/novo.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function EditarConsultaPage({ params }: Props) {
  const { id } = await params;
  const consulta = consultas.find((c) => c.id === id);
  if (!consulta) notFound();

  const inicial: AgendamentoInput = {
    paciente: consulta.pacienteId,
    tipo: consulta.tipo,
    profissional: profissionais[0],
    data: consulta.data,
    horario: consulta.horario,
    duracao: consulta.duracao,
  };

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CONSULTAS · {consulta.paciente.toUpperCase()}</p>
          <h1>Editar agendamento</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/consultas" className={styles.secondary}>Cancelar</Link>
          <button type="submit" form={FORM_ID} className={styles.primary}>Salvar alterações</button>
        </div>
      </header>
      <AgendamentoForm modo="editar" consultaId={id} inicial={inicial} />
    </>
  );
}
