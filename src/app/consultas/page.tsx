import Link from 'next/link';
import { consultasDoDia, statusRotulo } from '../../lib/consultas.data';
import styles from './consultas.module.css';

const colunas = ['HORÁRIO', 'PACIENTE', 'TIPO', 'IG', 'STATUS', 'NOTA CLÍNICA'];

export default function ConsultasPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AGENDA DO DIA</p>
          <h1>Consultas</h1>
        </div>
        <Link href="/consultas/novo" className={styles.primary}>Novo agendamento</Link>
      </header>

      <div className={styles.filters} role="group" aria-label="Filtros">
        <span className={`${styles.chip} ${styles.chipOn}`}>Hoje · {consultasDoDia.length}</span>
        <span className={styles.chip}>Próximos 7 dias</span>
        <span className={styles.chip}>Realizadas</span>
        <span className={styles.chip}>Faltas</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {colunas.map((c) => (
              <th key={c} scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {consultasDoDia.map((c) => (
            <tr key={c.id}>
              <td>{c.horario}</td>
              <td>{c.paciente}</td>
              <td>{c.tipo}</td>
              <td>{c.ig}</td>
              <td><span className={`${styles.pill} ${styles[c.status]}`}>{statusRotulo[c.status]}</span></td>
              <td>{c.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
