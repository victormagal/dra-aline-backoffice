import type { ReactNode } from 'react';
import type { Consulta } from '../../lib/consultas.data';
import { LinhaConsulta } from './linha-consulta';
import styles from './consultas.module.css';

const colunas = ['DATA', 'HORÁRIO', 'PACIENTE', 'TIPO', 'IG', 'STATUS', 'AÇÕES'];

type Props = { consultas: Consulta[]; children: ReactNode };

export function ConsultasLista({ consultas, children }: Props) {
  return (
    <>
      <div className={styles.toolbar}>{children}</div>

      {consultas.length === 0 ? (
        <p className={styles.vazio}>Nenhuma consulta encontrada.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              {colunas.map((c) => (
                <th key={c} scope="col" className={c === 'AÇÕES' ? styles.colunaAcoes : undefined}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {consultas.map((c) => <LinhaConsulta key={c.id} consulta={c} />)}
          </tbody>
        </table>
      )}
    </>
  );
}
