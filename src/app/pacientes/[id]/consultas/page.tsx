import Link from 'next/link';
import { FichaShell } from '../ficha-shell';
import { consultas, statusRotulo } from '../../../../lib/consultas.data';
import styles from '../ficha.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function ConsultasPaciente({ params }: Props) {
  const { id } = await params;
  const lista = consultas.filter((c) => c.pacienteId === id);

  return (
    <FichaShell id={id} aba="consultas">
      <section className={styles.card}>
        <div className={styles.cabecalhoAba}>
          <h2 className={styles.cardTitle}>Consultas</h2>
          <Link href="/consultas/novo" className={styles.primaryLink}>Agendar consulta</Link>
        </div>
        {lista.length === 0 ? (
          <p className={styles.vazio}>Nenhuma consulta registrada.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr><th scope="col">DATA</th><th scope="col">HORÁRIO</th><th scope="col">TIPO</th><th scope="col">IG</th><th scope="col">STATUS</th></tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.id}>
                  <td>{c.data}</td>
                  <td>{c.horario}</td>
                  <td>{c.tipo}</td>
                  <td>{c.ig}</td>
                  <td>{statusRotulo[c.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </FichaShell>
  );
}
