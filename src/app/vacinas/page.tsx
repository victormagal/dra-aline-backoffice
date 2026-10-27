import Link from 'next/link';
import { catalogoVacinas, filtrosVacinas } from '../../lib/vacinas.data';
import styles from './vacinas.module.css';

const colunas = ['VACINA', 'ALVO', 'JANELA', 'NOTA', 'STATUS'];

type Props = { searchParams: Promise<{ alvo?: string }> };

export default async function VacinasPage({ searchParams }: Props) {
  const { alvo: slug = 'todas' } = await searchParams;
  const filtro = filtrosVacinas.find((f) => f.slug === slug) ?? filtrosVacinas[0];
  const lista = 'alvo' in filtro ? catalogoVacinas.filter((v) => v.alvo === filtro.alvo) : catalogoVacinas;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CALENDÁRIO VACINAL</p>
          <h1>Vacinas</h1>
        </div>
        <Link href="/vacinas/nova" className={styles.primary}>Nova vacina</Link>
      </header>

      <div className={styles.filters} role="group" aria-label="Filtrar por alvo">
        {filtrosVacinas.map((f) => (
          <Link
            key={f.slug}
            href={f.slug === 'todas' ? '/vacinas' : `/vacinas?alvo=${f.slug}`}
            className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
          >
            {f.rotulo}
          </Link>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {lista.map((v) => (
            <tr key={v.id}>
              <td>{v.nome}</td>
              <td>{v.alvo}</td>
              <td>{v.janela}</td>
              <td className={styles.nota}>{v.nota}</td>
              <td><span className={styles.pill}>{v.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
