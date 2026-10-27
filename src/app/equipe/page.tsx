import Link from 'next/link';
import { cartoesEquipe, membrosAcesso } from '../../lib/equipe.data';
import styles from './equipe.module.css';

const colunas = ['NOME', 'PAPEL', 'ACESSO', 'ÚLTIMO ACESSO'];

export default function EquipePage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PERFIL DA CLÍNICA</p>
          <h1>Equipe</h1>
        </div>
        <Link href="/equipe/novo" className={styles.primary}>Adicionar profissional</Link>
      </header>

      <div className={styles.cards}>
        {cartoesEquipe.map((c) => (
          <article key={c.id} className={styles.card}>
            <h2 className={c.nome ? styles.nome : `${styles.nome} ${styles.apagado}`}>
              {c.nome ?? 'A cadastrar'}
            </h2>
            <p className={styles.esp}>{c.especialidade}</p>
            <p className={`${styles.linha} ${c.registro ? '' : styles.apagado}`}>{c.registro ?? 'Registro pendente'}</p>
            {c.rqe && <p className={styles.linha}>{c.rqe}</p>}
            <div className={styles.pills}>
              <span className={`${styles.pill} ${c.situacao === 'Ativo' ? styles.ok : styles.alerta}`}>
                {c.situacao === 'Ativo' ? 'Ativa' : c.situacao}
              </span>
              {c.responsavel && <span className={`${styles.pill} ${styles.neutro}`}>Responsável</span>}
            </div>
          </article>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>{colunas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
        </thead>
        <tbody>
          {membrosAcesso.map((m) => (
            <tr key={m.id}>
              <td>{m.nome}</td>
              <td>{m.papel}</td>
              <td><span className={`${styles.pill} ${styles.ok}`}>{m.acesso}</span></td>
              <td>{m.ultimoAcesso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
