import Link from 'next/link';
import { FichaShell } from './ficha-shell';
import { montarFicha } from '../../../lib/pacientes.data';
import styles from './ficha.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function FichaPacienteResumo({ params }: Props) {
  const { id } = await params;
  const ficha = montarFicha(id);
  const h = ficha?.historico;

  return (
    <FichaShell id={id} aba="resumo">
      {ficha && h && (
        <div className={styles.body}>
          <div className={styles.col}>
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Dados do casal</h2>
              <dl className={styles.kv}>
                <div><dt>Idade</dt><dd>{ficha.idade}</dd></div>
                <div><dt>Tipo sanguíneo</dt><dd>{ficha.tipoSanguineo}</dd></div>
                <div><dt>Parceiro</dt><dd>{ficha.parceiro}</dd></div>
              </dl>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Histórico obstétrico</h2>
              <div className={styles.tiles}>
                <div className={styles.tile}><div className={styles.tileValor}>{h.g}</div><div className={styles.tileRotulo}>G</div></div>
                <div className={styles.tile}><div className={styles.tileValor}>{h.pn}</div><div className={styles.tileRotulo}>PN</div></div>
                <div className={styles.tile}><div className={styles.tileValor}>{h.pc}</div><div className={styles.tileRotulo}>PC</div></div>
                <div className={styles.tile}><div className={styles.tileValor}>{h.a}</div><div className={styles.tileRotulo}>A</div></div>
                <div className={styles.tile}><div className={styles.tileValor}>{h.outros}</div><div className={styles.tileRotulo}>Outros</div></div>
              </div>
              {ficha.condicoes.length > 0 ? (
                <ul className={styles.lista}>
                  {ficha.condicoes.map((c) => (
                    <li key={c.rotulo}><span className={styles.muted}>{c.rotulo}</span><span>{c.valor}</span></li>
                  ))}
                </ul>
              ) : (
                <p className={styles.vazio}>Sem histórico cadastrado.</p>
              )}
              <Link href={`/pacientes/${id}/desfecho`} className={`${styles.botaoLargo} ${styles.linkBotao}`}>Registrar desfecho</Link>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Linha do tempo</h2>
              {ficha.linhaDoTempo.length > 0 ? (
                <ul className={styles.lista}>
                  {ficha.linhaDoTempo.map((e) => (
                    <li key={e.data + e.texto}><span className={styles.muted}>{e.data}</span><span>{e.texto}</span></li>
                  ))}
                </ul>
              ) : (
                <p className={styles.vazio}>Nenhum evento registrado.</p>
              )}
            </section>
          </div>

          <div className={styles.col}>
            <section className={styles.card}>
              <p className={styles.eyebrow}>PRÓXIMA CONSULTA</p>
              <h3>{ficha.proximaConsulta.titulo}</h3>
              <p className={styles.muted}>{ficha.proximaConsulta.data}</p>
              <button type="button" className={styles.botaoLargo}>{ficha.proximaConsulta.acao}</button>
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Pendências de vacinas</h2>
              {ficha.pendenciasVacinas.length > 0 ? (
                <ul className={styles.lista}>
                  {ficha.pendenciasVacinas.map((v) => (
                    <li key={v.vacina}>
                      <span>{v.vacina}</span>
                      <span className={`${styles.pill} ${v.status === 'Pendente' ? styles.alerta : styles.neutro}`}>{v.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.vazio}>Nenhuma pendência.</p>
              )}
            </section>

            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Acesso</h2>
              <dl className={styles.kv}>
                <div><dt>Login</dt><dd>{ficha.login}</dd></div>
                <div><dt>E-mail</dt><dd>{ficha.email}</dd></div>
                <div><dt>Último acesso</dt><dd>{ficha.ultimoAcesso}</dd></div>
              </dl>
              <button type="button" className={styles.botaoLargo}>Enviar link de redefinição</button>
            </section>
          </div>
        </div>
      )}
    </FichaShell>
  );
}
