'use client';

import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import { statusRotulo, type Consulta } from '../../lib/consultas.data';
import { normalizar } from '../../lib/texto';
import styles from './consultas.module.css';

const colunas = ['DATA', 'HORÁRIO', 'PACIENTE', 'TIPO', 'IG', 'STATUS', 'NOTA CLÍNICA'];

type Props = { consultas: Consulta[]; children: ReactNode };

export function ConsultasLista({ consultas, children }: Props) {
  const [busca, setBusca] = useState('');
  const buscaAdiada = useDeferredValue(busca);

  const indice = useMemo(
    () => consultas.map((consulta) => ({ consulta, paciente: normalizar(consulta.paciente) })),
    [consultas],
  );

  const resultado = useMemo(() => {
    const termo = normalizar(buscaAdiada);
    if (!termo) return consultas;
    return indice.filter((item) => item.paciente.includes(termo)).map((item) => item.consulta);
  }, [indice, buscaAdiada, consultas]);

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por paciente"
          aria-label="Buscar por paciente"
        />
        {children}
      </div>

      {resultado.length === 0 ? (
        <p className={styles.vazio}>Nenhuma consulta encontrada.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {resultado.map((c) => (
              <tr key={c.id}>
                <td>{c.data}</td>
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
      )}
    </>
  );
}
