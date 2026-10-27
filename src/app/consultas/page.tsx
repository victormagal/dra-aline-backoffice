import Link from 'next/link';
import { consultas, filtrosConsultas } from '../../lib/consultas.data';
import { ConsultasLista } from './consultas-lista';
import styles from './consultas.module.css';

type Props = { searchParams: Promise<{ filtro?: string }> };

export default async function ConsultasPage({ searchParams }: Props) {
  const { filtro: slug = 'hoje' } = await searchParams;
  const filtro = filtrosConsultas.find((f) => f.slug === slug) ?? filtrosConsultas[0];
  const hoje = new Date();
  const lista = consultas.filter((c) => filtro.aplica(c, hoje));

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AGENDA</p>
          <h1>Consultas</h1>
        </div>
        <Link href="/consultas/novo" className={styles.primary}>Novo agendamento</Link>
      </header>

      <ConsultasLista consultas={lista}>
        <div role="group" aria-label="Filtrar consultas" className={styles.filters}>
          {filtrosConsultas.map((f) => (
            <Link
              key={f.slug}
              href={f.slug === 'hoje' ? '/consultas' : `/consultas?filtro=${f.slug}`}
              className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
            >
              {f.rotulo} · {consultas.filter((c) => f.aplica(c, hoje)).length}
            </Link>
          ))}
        </div>
      </ConsultasLista>
    </>
  );
}
