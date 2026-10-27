import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fichaPatricia, pacientes, type FichaPaciente } from '../../../lib/pacientes.data';
import styles from './ficha.module.css';

type Props = { params: Promise<{ id: string }> };

// Pacientes ainda sem ficha detalhada aparecem com os dados da lista e traços nos demais campos.
function montarFicha(id: string): FichaPaciente | null {
  if (id === fichaPatricia.id) return fichaPatricia;
  const resumo = pacientes.find((p) => p.id === id);
  if (!resumo) return null;
  return {
    id,
    nome: resumo.nome,
    situacao: `${resumo.situacao} · ${resumo.igOuPosParto}`,
    acesso: resumo.acesso,
    idade: '—', tipoSanguineo: '—', parceiro: '—',
    historico: { g: 0, pn: 0, pc: 0, a: 0, outros: 0 },
    condicoes: [],
    linhaDoTempo: [],
    proximaConsulta: { titulo: resumo.proximaConsulta, data: '—', acao: 'Agendar' },
    pendenciasVacinas: [],
    login: '—', email: '—', ultimoAcesso: '—',
  };
}

const abas = ['Resumo', 'Consultas', 'Exames', 'Ultrassons', 'Vacinas', 'Anotações'];

export default async function FichaPacientePage({ params }: Props) {
  const { id } = await params;
  const ficha = montarFicha(id);

  if (!ficha) {
    notFound();
  }

  const h = ficha.historico;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>
            <Link href="/pacientes">Pacientes</Link> › {ficha.nome}
          </p>
          <h1>{ficha.nome}</h1>
          <p className={styles.sub}>
            {ficha.situacao}
            <span className={`${styles.pill} ${ficha.acesso === 'Ativo' ? styles.ok : styles.alerta}`}>
              {ficha.acesso === 'Ativo' ? 'Acesso ativo' : 'Primeiro acesso'}
            </span>
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary}>Editar ficha</button>
          <button type="button" className={styles.primary}>Novo lançamento</button>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Abas da ficha">
        {abas.map((a) => (
          <span key={a} className={`${styles.tab} ${a === 'Resumo' ? styles.tabOn : ''}`}>{a}</span>
        ))}
      </nav>

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

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Anotações</h2>
            <p className={styles.vazio}>Nenhuma anotação registrada.</p>
            <button type="button" className={styles.botaoLargo}>Adicionar anotação</button>
          </section>
        </div>
      </div>
    </>
  );
}
