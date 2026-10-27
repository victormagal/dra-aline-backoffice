import Link from 'next/link';
import { filtrosPacientes, pacientes, type PacienteResumo } from '../../lib/pacientes.data';
import { normalizar } from '../../lib/texto';
import { PacientesLista } from './pacientes-lista';
import styles from './pacientes.module.css';

type Props = { searchParams: Promise<{ filtro?: string; q?: string }> };

// Monta a URL da listagem mantendo filtro e busca (estado fica na URL, sem JavaScript)
function urlPacientes(slug: string, busca: string) {
  const params = new URLSearchParams();
  if (slug !== 'ativas') params.set('filtro', slug);
  if (busca) params.set('q', busca);
  const texto = params.toString();
  return texto ? `/pacientes?${texto}` : '/pacientes';
}

export default async function PacientesPage({ searchParams }: Props) {
  const { filtro: slug = 'ativas', q = '' } = await searchParams;
  const filtro = filtrosPacientes.find((f) => f.slug === slug) ?? filtrosPacientes[0];
  const busca = q.trim();
  const termo = normalizar(busca);

  const porBusca = (p: PacienteResumo) => !termo || normalizar(p.nome).includes(termo);
  const lista = pacientes.filter((p) => filtro.aplica(p) && porBusca(p));

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
        <form role="search" method="get" className={styles.toolbar}>
          {filtro.slug !== 'ativas' && <input type="hidden" name="filtro" value={filtro.slug} />}
          <input
            type="search"
            name="q"
            defaultValue={busca}
            className={styles.search}
            placeholder="Buscar por nome"
            aria-label="Buscar por nome"
          />
          <button type="submit" className={styles.botaoBusca}>Buscar</button>
          {busca && <Link href={urlPacientes(filtro.slug, '')} className={styles.limpar}>Limpar busca</Link>}
          <div role="group" aria-label="Filtrar pacientes" className={styles.filters}>
            {filtrosPacientes.map((f) => (
              <Link
                key={f.slug}
                href={urlPacientes(f.slug, busca)}
                aria-current={f.slug === filtro.slug ? 'page' : undefined}
                className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
              >
                {f.rotulo} · {pacientes.filter((p) => f.aplica(p) && porBusca(p)).length}
              </Link>
            ))}
          </div>
        </form>
      </PacientesLista>
    </>
  );
}
