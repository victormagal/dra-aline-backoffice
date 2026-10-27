import Link from 'next/link';
import { filtrosPacientes, pacientes } from '../../lib/pacientes.data';
import { PacientesLista } from './pacientes-lista';
import styles from './pacientes.module.css';

type Props = { searchParams: Promise<{ filtro?: string }> };

export default async function PacientesPage({ searchParams }: Props) {
  const { filtro: slug = 'ativas' } = await searchParams;
  const filtro = filtrosPacientes.find((f) => f.slug === slug) ?? filtrosPacientes[0];
  const lista = pacientes.filter(filtro.aplica);

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PACIENTES</p>
          <h1>Pacientes</h1>
        </div>
        <Link href="/pacientes/nova" className={styles.primary}>Nova paciente</Link>
      </header>

      <PacientesLista pacientes={lista}>
        <div role="group" aria-label="Filtrar pacientes" className={styles.filters}>
          {filtrosPacientes.map((f) => (
            <Link
              key={f.slug}
              href={f.slug === 'ativas' ? '/pacientes' : `/pacientes?filtro=${f.slug}`}
              className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
            >
              {f.rotulo} · {pacientes.filter(f.aplica).length}
            </Link>
          ))}
        </div>
      </PacientesLista>
    </>
  );
}
