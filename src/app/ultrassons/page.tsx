import Link from 'next/link';
import { filtrosUltrassom, ultrassons } from '../../lib/ultrassons.data';
import { UltrassonsLista } from './ultrassons-lista';
import styles from './ultrassons.module.css';

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

      <UltrassonsLista ultrassons={lista}>
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
      </UltrassonsLista>
    </>
  );
}
