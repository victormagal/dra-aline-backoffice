import Link from 'next/link';
import { filtrosUltrassom, ultrassons } from '../../lib/ultrassons.data';
import styles from './ultrassons.module.css';

const colunas = ['DATA', 'PACIENTE', 'IG', 'TIPO', 'APRESENTAÇÃO', 'BCF', 'LAUDO'];

type Props = { searchParams: Promise<{ tipo?: string }> };

export default async function UltrassonsPage({ searchParams }: Props) {
  const { tipo: slug = 'todos' } = await searchParams;
  const filtro = filtrosUltrassom.find((f) => f.slug === slug) ?? filtrosUltrassom[0];
  const lista = 'tipo' in filtro ? ultrassons.filter((u) => u.tipo === filtro.tipo) : ultrassons;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>EXAMES DE IMAGEM</p>
          <h1>Ultrassons</h1>
        </div>
        <Link href="/ultrassons/novo" className={styles.primary}>Registrar ultrassom</Link>
      </header>

      <div className={styles.filters} role="group" aria-label="Filtrar por tipo">
        {filtrosUltrassom.map((f) => (
          <Link
            key={f.slug}
            href={f.slug === 'todos' ? '/ultrassons' : `/ultrassons?tipo=${f.slug}`}
            className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
          >
            {f.rotulo}
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className={styles.vazio}>Nenhum ultrassom deste tipo.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {lista.map((u) => (
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
