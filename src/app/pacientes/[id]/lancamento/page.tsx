import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pacientes } from '../../../../lib/pacientes.data';
import styles from './lancamento.module.css';

type Props = { params: Promise<{ id: string }> };

export default async function NovoLancamentoPage({ params }: Props) {
  const { id } = await params;
  const paciente = pacientes.find((p) => p.id === id);
  if (!paciente) notFound();

  type Opcao = { titulo: string; texto: string; href?: string; aviso?: string };
  const opcoes: Opcao[] = [
    { titulo: 'Ultrassom', texto: 'Exame de imagem da gestação em andamento.', href: `/ultrassons/novo?paciente=${id}` },
    { titulo: 'Exame', texto: 'Resultado do catálogo, no trimestre da paciente.', href: `/exames/novo?paciente=${id}` },
    { titulo: 'Vacina', texto: 'Aplicação, pendência ou recusa, para gestante ou bebê.', href: `/vacinas/nova?paciente=${id}` },
    { titulo: 'Desfecho ou parto', texto: 'Encerra a gestação atual e registra os bebês.', href: `/pacientes/${id}/desfecho` },
    { titulo: 'Consulta', texto: 'Evolução: peso, PA, BCF, conduta.', aviso: 'Tela ainda não desenhada' },
    { titulo: 'Anotação', texto: 'Nota por especialidade.', aviso: 'Ainda não existe na API' },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PACIENTE · {paciente.nome.toUpperCase()}</p>
          <h1>Novo lançamento</h1>
        </div>
        <Link href={`/pacientes/${id}`} className={styles.secondary}>Voltar à ficha</Link>
      </header>

      <div className={styles.cards}>
        {opcoes.map((o) =>
          o.href ? (
            <Link key={o.titulo} href={o.href} className={styles.card}>
              <span className={styles.titulo}>{o.titulo}</span>
              <span className={styles.texto}>{o.texto}</span>
            </Link>
          ) : (
            <div key={o.titulo} className={`${styles.card} ${styles.desabilitado}`} aria-disabled="true">
              <span className={styles.titulo}>{o.titulo}</span>
              <span className={styles.texto}>{o.texto}</span>
              <span className={styles.aviso}>{o.aviso}</span>
            </div>
          ),
        )}
      </div>
    </>
  );
}
