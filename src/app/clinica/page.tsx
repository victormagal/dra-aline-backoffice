import Link from 'next/link';
import { cartoesEquipe } from '../../lib/equipe.data';
import { acessoPacientes, backup, clinica, responsavel } from '../../lib/clinica.data';
import styles from './clinica.module.css';

export default function PerfilClinicaPage() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>CLÍNICA</p>
          <h1>Perfil da clínica</h1>
        </div>
        <button type="button" className={styles.secondary}>Editar dados</button>
      </header>

      <div className={styles.rows}>
        <div className={styles.pair}>
          <section className={styles.card}>
            <h2 className={styles.nome}>{clinica.nome}</h2>
            <p className={styles.muted}>{clinica.descricao}</p>
            <ul className={styles.lista}>
              {clinica.contatos.map((c) => (
                <li key={c.rotulo}><span className={styles.muted}>{c.rotulo}</span><span>{c.valor}</span></li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <p className={styles.eyebrow}>PROFISSIONAL RESPONSÁVEL</p>
            <h2 className={styles.nome}>{responsavel.nome}</h2>
            <p className={styles.muted}>{responsavel.cargo}</p>
            <ul className={styles.lista}>
              {responsavel.registros.map((r) => (
                <li key={r.rotulo}><span className={styles.muted}>{r.rotulo}</span><span>{r.valor}</span></li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <div className={styles.cardHead} style={{ marginBottom: 14 }}>
            <h2 className={styles.title}>Equipe da clínica</h2>
            <Link href="/equipe/novo" className={styles.primary}>Adicionar profissional</Link>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">NOME</th>
                <th scope="col">ESPECIALIDADE</th>
                <th scope="col">REGISTRO</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {cartoesEquipe.map((c) => (
                <tr key={c.id}>
                  <td className={c.nome ? '' : styles.apagado}>{c.nome ?? 'A cadastrar'}</td>
                  <td>{c.especialidade}</td>
                  <td className={c.registro ? '' : styles.apagado}>{c.registro ?? '—'}</td>
                  <td><span className={styles.pill}>{c.situacao === 'Ativo' ? 'Ativa' : c.situacao}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className={styles.pair}>
          <section className={styles.card}>
            <h2 className={styles.title}>Acesso dos pacientes</h2>
            <ul className={styles.lista}>
              {acessoPacientes.map((a) => (
                <li key={a.rotulo}><span className={styles.muted}>{a.rotulo}</span><span>{a.valor}</span></li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.title}>Backup</h2>
            <p className={styles.muted}>{backup.ultimo}</p>
            <p>{backup.instrucao}</p>
            <button type="button" className={styles.primary} style={{ alignSelf: 'flex-start' }}>Gerar backup agora</button>
          </section>
        </div>
      </div>
    </>
  );
}
