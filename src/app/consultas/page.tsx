import Link from 'next/link';
import { consultas, filtrosConsultas, type Consulta } from '../../lib/consultas.data';
import { normalizar } from '../../lib/texto';
import { ConsultasLista } from './consultas-lista';
import styles from './consultas.module.css';

type Props = { searchParams: Promise<{ filtro?: string; q?: string }> };

// Monta a URL da agenda mantendo filtro e busca (estado fica na URL, sem JavaScript)
function urlConsultas(slug: string, busca: string) {
  const params = new URLSearchParams();
  if (slug !== 'hoje') params.set('filtro', slug);
  if (busca) params.set('q', busca);
  const texto = params.toString();
  return texto ? `/consultas?${texto}` : '/consultas';
}

export default async function ConsultasPage({ searchParams }: Props) {
  const { filtro: slug = 'hoje', q = '' } = await searchParams;
  const filtro = filtrosConsultas.find((f) => f.slug === slug) ?? filtrosConsultas[0];
  const busca = q.trim();
  const termo = normalizar(busca);
  const hoje = new Date();

  const porBusca = (c: Consulta) => !termo || normalizar(c.paciente).includes(termo);
  const lista = consultas.filter((c) => filtro.aplica(c, hoje) && porBusca(c));

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
        <form role="search" method="get" className={styles.toolbar}>
          {filtro.slug !== 'hoje' && <input type="hidden" name="filtro" value={filtro.slug} />}
          <input
            type="search"
            name="q"
            defaultValue={busca}
            className={styles.search}
            placeholder="Buscar por paciente"
            aria-label="Buscar por paciente"
          />
          <button type="submit" className={styles.botaoBusca}>Buscar</button>
          {busca && <Link href={urlConsultas(filtro.slug, '')} className={styles.limpar}>Limpar busca</Link>}
          <div role="group" aria-label="Filtrar consultas" className={styles.filters}>
            {filtrosConsultas.map((f) => (
              <Link
                key={f.slug}
                href={urlConsultas(f.slug, busca)}
                aria-current={f.slug === filtro.slug ? 'page' : undefined}
                className={`${styles.chip} ${f.slug === filtro.slug ? styles.chipOn : ''}`}
              >
                {f.rotulo} · {consultas.filter((c) => f.aplica(c, hoje) && porBusca(c)).length}
              </Link>
            ))}
          </div>
        </form>
      </ConsultasLista>
    </>
  );
}
