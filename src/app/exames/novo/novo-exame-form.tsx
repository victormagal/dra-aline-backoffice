'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pacientes } from '../../../lib/pacientes.data';
import { catalogoExames } from '../../../lib/configuracoes.data';
import { FORM_NOVO_EXAME, situacoesExame, trimestres } from '../../../lib/exames.data';
import { exameSchema, type ExameInput, type ExameValues } from '../../../lib/exames.schema';
import styles from './novo.module.css';

export default function NovoExameForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExameInput, unknown, ExameValues>({
    resolver: zodResolver(exameSchema),
    defaultValues: {
      pacienteId: '',
      exame: '',
      dataColeta: '27/10/2026',
      dataResultado: '',
      valor: '',
      unidade: '',
      situacao: 'Pendente',
      observacao: '',
    },
  });

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Exame salvo (simulação).');
  }

  return (
    <form id={FORM_NOVO_EXAME} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Exame</h2>
        <div className={styles.grid}>
          <Field label="Paciente" error={errors.pacienteId?.message}>
            <select className={styles.input} aria-invalid={!!errors.pacienteId} {...register('pacienteId')}>
              <option value="">Buscar por nome ou CPF</option>
              {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </Field>
          <Field label="Exame do catálogo" error={errors.exame?.message}>
            <select className={styles.input} aria-invalid={!!errors.exame} {...register('exame')}>
              <option value="">Selecione</option>
              {catalogoExames.map((e) => <option key={e.id} value={e.exame}>{e.exame}</option>)}
            </select>
          </Field>
        </div>
        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>Trimestre (aba onde aparece para a paciente)</legend>
          <div className={styles.radios}>
            {trimestres.map((t) => (
              <label key={t} className={styles.radio}>
                <input type="radio" value={t} {...register('trimestre')} /> {t}
              </label>
            ))}
          </div>
          {errors.trimestre && <span role="alert" className={styles.error}>{errors.trimestre.message}</span>}
        </fieldset>
        <p className={styles.aviso}>Cada resultado entra na aba do trimestre escolhido. Não há limite de exames por trimestre.</p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Resultado</h2>
        <div className={styles.grid}>
          <Field label="Data da coleta" error={errors.dataColeta?.message}>
            <input className={styles.input} placeholder="dd/mm/aaaa" aria-invalid={!!errors.dataColeta} {...register('dataColeta')} />
          </Field>
          <Field label="Data do resultado" error={errors.dataResultado?.message}>
            <input className={styles.input} placeholder="dd/mm/aaaa" aria-invalid={!!errors.dataResultado} {...register('dataResultado')} />
          </Field>
          <Field label="Valor" error={errors.valor?.message}>
            <input className={styles.input} placeholder="Valor ou descrição" aria-invalid={!!errors.valor} {...register('valor')} />
          </Field>
          <Field label="Unidade" error={errors.unidade?.message}>
            <input className={styles.input} placeholder="ex.: g/dL" aria-invalid={!!errors.unidade} {...register('unidade')} />
          </Field>
          <Field label="Situação" error={errors.situacao?.message}>
            <select className={styles.input} aria-invalid={!!errors.situacao} {...register('situacao')}>
              {situacoesExame.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Observação do exame" error={errors.observacao?.message}>
            <input className={styles.input} placeholder="ex.: refeito em 04/09/2026" aria-invalid={!!errors.observacao} {...register('observacao')} />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Laudo</h2>
        <label className={styles.dropzone}>
          <span>Arraste o laudo em PDF ou clique para anexar</span>
          <input type="file" accept="application/pdf" className={styles.fileInput} />
        </label>
      </section>

      {isSubmitting && <p role="status" className={styles.status}>Salvando…</p>}
      {mensagem && <p role="status" className={styles.status}>{mensagem}</p>}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </label>
  );
}
