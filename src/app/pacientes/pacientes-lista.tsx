'use client';

import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { PacienteResumo } from '../../lib/pacientes.data';
import { normalizar } from '../../lib/texto';
import styles from './pacientes.module.css';

const colunas = ['PACIENTE', 'SITUAÇÃO', 'IG / PÓS-PARTO', 'PRÓXIMA CONSULTA', 'ACESSO'];

type Props = { pacientes: PacienteResumo[]; children: ReactNode };

export function PacientesLista({ pacientes, children }: Props) {
  const [busca, setBusca] = useState('');
  const buscaAdiada = useDeferredValue(busca);

  const indice = useMemo(
    () => pacientes.map((paciente) => ({ paciente, nome: normalizar(paciente.nome) })),
    [pacientes],
  );

  const resultado = useMemo(() => {
    const termo = normalizar(buscaAdiada);
    if (!termo) return pacientes;
    return indice.filter((item) => item.nome.includes(termo)).map((item) => item.paciente);
  }, [indice, buscaAdiada, pacientes]);

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar por nome"
        />
        {children}
      </div>

      {resultado.length === 0 ? (
        <p className={styles.vazio}>Nenhuma paciente encontrada.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {resultado.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link href={`/pacientes/${p.id}`} className={styles.nome}>{p.nome}</Link>
                </td>
                <td>{p.situacao}</td>
                <td>{p.igOuPosParto}</td>
                <td>{p.proximaConsulta}</td>
                <td>
                  <span className={`${styles.pill} ${p.acesso === 'Ativo' ? styles.ok : styles.alerta}`}>{p.acesso}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
