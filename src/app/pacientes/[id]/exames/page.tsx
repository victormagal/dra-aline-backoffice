import Link from 'next/link';
import { FichaShell } from '../ficha-shell';
import { examesPaciente } from '../../../../lib/exames.data';
import styles from '../ficha.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function ExamesPaciente({ params }: Props) {
  const { id } = await params;
  const lista = examesPaciente.filter((e) => e.pacienteId === id);

  return (
    <FichaShell id={id} aba="exames">
      <section className={styles.card}>
        <div className={styles.cabecalhoAba}>
          <h2 className={styles.cardTitle}>Exames</h2>
          <Link href={`/exames/novo?paciente=${id}`} className={styles.primaryLink}>Novo exame</Link>
        </div>
        {lista.length === 0 ? (
          <p className={styles.vazio}>Nenhum exame registrado.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr><th scope="col">EXAME</th><th scope="col">TRIMESTRE</th><th scope="col">DATA</th><th scope="col">VALOR</th><th scope="col">REFERÊNCIA</th><th scope="col">SITUAÇÃO</th></tr>
            </thead>
            <tbody>
              {lista.map((e) => (
                <tr key={e.id}>
                  <td>{e.exame}</td>
                  <td>{e.trimestre}</td>
                  <td>{e.data}</td>
                  <td>{e.valor === '—' ? '—' : `${e.valor} ${e.unidade}`}</td>
                  <td>{e.referencia}</td>
                  <td><span className={`${styles.pill} ${e.situacao === 'Disponível' ? styles.ok : styles.alerta}`}>{e.situacao}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </FichaShell>
  );
}
