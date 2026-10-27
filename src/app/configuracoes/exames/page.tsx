import Link from 'next/link';
import AbasConfiguracoes from '../abas';
import { catalogoExames, filtrosExames } from '../../../lib/configuracoes.data';
import styles from '../configuracoes.module.css';

type Props = { searchParams: Promise<{ grupo?: string }> };

export default async function CatalogoExamesPage({ searchParams }: Props) {
  const { grupo: slug = 'todos' } = await searchParams;
  const filtro = filtrosExames.find((f) => f.slug === slug) ?? filtrosExames[0];
  const lista = filtro.grupo ? catalogoExames.filter((e) => e.grupo === filtro.grupo) : catalogoExames;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CONFIGURAÇÕES</p>
          <h1>Catálogo de exames</h1>
        </div>
        <div className={styles.actions}>
          <Link href="/exames/novo" className={styles.primary}>Novo exame</Link>
        </div>
      </header>
      <AbasConfiguracoes ativa="exames" />

      <div className={styles.filters} role="group" aria-label="Filtrar por grupo">
        {filtrosExames.map((f) => (
          <Link
            key={f.slug}
            href={f.slug === 'todos' ? '/configuracoes/exames' : `/configuracoes/exames?grupo=${f.slug}`}
            className={`${styles.filterChip} ${f.slug === filtro.slug ? styles.filterOn : ''}`}
          >
            {f.rotulo}
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className={styles.muted}>Nenhum exame neste grupo.</p>
      ) : (
        <table className={styles.table}>
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">EXAME</th>
              <th scope="col">GRUPO</th>
              <th scope="col">JANELA DE COLETA</th>
              <th scope="col">OBRIGATÓRIO</th>
              <th scope="col">PREPARO</th>
              <th scope="col">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e) => (
              <tr key={e.id}>
                <td title={e.exame}>{e.exame}</td>
                <td>{e.grupo}</td>
                <td>{e.janela}</td>
                <td><span className={styles.pill}>{e.obrigatorio ? 'Sim' : 'Não'}</span></td>
                <td title={e.preparo}>{e.preparo}</td>
                <td><span className={`${styles.pill} ${styles.pillOk}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
