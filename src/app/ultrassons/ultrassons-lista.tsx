'use client';

import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import type { UltrassomRegistro } from '../../lib/ultrassons.data';
import { normalizar } from '../../lib/texto';
import styles from './ultrassons.module.css';

const colunas = ['DATA', 'PACIENTE', 'IG', 'TIPO', 'APRESENTAÇÃO', 'BCF', 'LAUDO'];

type Props = { ultrassons: UltrassomRegistro[]; children: ReactNode };

export function UltrassonsLista({ ultrassons, children }: Props) {
  const [busca, setBusca] = useState('');
  const buscaAdiada = useDeferredValue(busca);

  const indice = useMemo(
    () => ultrassons.map((u) => ({ u, paciente: normalizar(u.paciente) })),
    [ultrassons],
  );

  const resultado = useMemo(() => {
    const termo = normalizar(buscaAdiada);
    if (!termo) return ultrassons;
    return indice.filter((item) => item.paciente.includes(termo)).map((item) => item.u);
  }, [indice, buscaAdiada, ultrassons]);

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
        <p className={styles.vazio}>Nenhum ultrassom encontrado.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {resultado.map((u) => (
              <tr key={u.id}>
                <td>{u.data}</td>
                <td>{u.paciente}</td>
                <td>{u.ig}</td>
                <td>{u.tipo}</td>
                <td>{u.apresentacao}</td>
                <td>{u.bcf}</td>
                <td><span className={styles.pill}>Assinado</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
