import Link from 'next/link';
import { FichaShell } from '../ficha-shell';
import { registrosVacina } from '../../../../lib/vacinas.data';
import styles from '../ficha.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function VacinasPaciente({ params }: Props) {
  const { id } = await params;
  const lista = registrosVacina.filter((v) => v.pacienteId === id);

  return (
    <FichaShell id={id} aba="vacinas">
      <section className={styles.card}>
        <div className={styles.cabecalhoAba}>
          <h2 className={styles.cardTitle}>Vacinas</h2>
          <Link href={`/vacinas/nova?paciente=${id}`} className={styles.primaryLink}>Nova vacina</Link>
        </div>
        {lista.length === 0 ? (
          <p className={styles.vazio}>Nenhuma vacina registrada.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr><th scope="col">VACINA</th><th scope="col">STATUS</th><th scope="col">DATA</th><th scope="col">OBSERVAÇÃO</th></tr>
            </thead>
            <tbody>
              {lista.map((v) => (
                <tr key={v.id}>
                  <td>{v.vacina}</td>
                  <td><span className={`${styles.pill} ${v.status === 'Aplicada' ? styles.ok : v.status === 'Pendente' ? styles.alerta : styles.neutro}`}>{v.status}</span></td>
                  <td>{v.data}</td>
                  <td>{v.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </FichaShell>
  );
}
