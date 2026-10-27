import Link from 'next/link';
import { FichaShell } from '../ficha-shell';
import { ultrassons } from '../../../../lib/ultrassons.data';
import styles from '../ficha.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function UltrassonsPaciente({ params }: Props) {
  const { id } = await params;
  const lista = ultrassons.filter((u) => u.pacienteId === id);

  return (
    <FichaShell id={id} aba="ultrassons">
      <section className={styles.card}>
        <div className={styles.cabecalhoAba}>
          <h2 className={styles.cardTitle}>Ultrassons</h2>
          <Link href={`/ultrassons/novo?paciente=${id}`} className={styles.primaryLink}>Registrar ultrassom</Link>
        </div>
        {lista.length === 0 ? (
          <p className={styles.vazio}>Nenhum ultrassom registrado.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr><th scope="col">DATA</th><th scope="col">IG</th><th scope="col">TIPO</th><th scope="col">APRESENTAÇÃO</th><th scope="col">BCF</th></tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td>{u.data}</td>
                  <td>{u.ig}</td>
                  <td>{u.tipo}</td>
                  <td>{u.apresentacao}</td>
                  <td>{u.bcf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </FichaShell>
  );
}
