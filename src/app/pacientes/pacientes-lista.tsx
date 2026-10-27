import Link from 'next/link';
import type { ReactNode } from 'react';
import type { PacienteResumo } from '../../lib/pacientes.data';
import { LinhaPaciente } from './linha-paciente';
import styles from './pacientes.module.css';

const colunas = ['PACIENTE', 'SITUAÇÃO', 'IG / PÓS-PARTO', 'PRÓXIMA CONSULTA', 'ACESSO'];

type Props = { pacientes: PacienteResumo[]; children: ReactNode };

export function PacientesLista({ pacientes, children }: Props) {
  return (
    <>
      <div className={styles.toolbar}>{children}</div>

      {pacientes.length === 0 ? (
        <p className={styles.vazio}>Nenhuma paciente encontrada.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <LinhaPaciente key={p.id} href={`/pacientes/${p.id}`}>
                <td>
                  <Link href={`/pacientes/${p.id}`} className={styles.nome}>{p.nome}</Link>
                </td>
                <td>{p.situacao}</td>
                <td>{p.igOuPosParto}</td>
                <td>{p.proximaConsulta}</td>
                <td>
                  <span className={`${styles.pill} ${p.acesso === 'Ativo' ? styles.ok : styles.alerta}`}>{p.acesso}</span>
                </td>
              </LinhaPaciente>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
