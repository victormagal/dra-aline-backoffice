'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { especialidades, FORM_NOVO_PROFISSIONAL, situacoes } from '../../../lib/equipe.data';
import { profissionalSchema, type ProfissionalInput, type ProfissionalValues } from '../../../lib/equipe.schema';
import styles from './novo.module.css';

export default function NovoProfissionalForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfissionalInput, unknown, ProfissionalValues>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: {
      nome: '',
      especialidade: 'Nutrição',
      registro: '',
      rqe: '',
      situacao: 'Em breve',
      responsavel: false,
      email: '',
    },
  });

  const situacao = useWatch({ control, name: 'situacao' });

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Profissional salvo (simulação).');
  }

  return (
    <form id={FORM_NOVO_PROFISSIONAL} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Dados profissionais</h2>
        <div className={styles.grid}>
          <Field
            label="Nome completo"
            hint={situacao === 'Em breve' ? 'Deixe em branco se ainda não contratado' : undefined}
            error={errors.nome?.message}
          >
            <input className={styles.input} placeholder="Nome completo" aria-invalid={!!errors.nome} {...register('nome')} />
          </Field>
          <Field label="Especialidade" error={errors.especialidade?.message}>
            <select className={styles.input} aria-invalid={!!errors.especialidade} {...register('especialidade')}>
              {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </Field>
          <Field label="Registro (conselho)" error={errors.registro?.message}>
            <input className={styles.input} placeholder="ex.: CRN-DF 1234" aria-invalid={!!errors.registro} {...register('registro')} />
          </Field>
          <Field label="RQE" error={errors.rqe?.message}>
            <input className={styles.input} placeholder="ex.: RQE 1234" aria-invalid={!!errors.rqe} {...register('rqe')} />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Situação e acesso</h2>
        <div className={styles.grid}>
          <Field label="Situação" error={errors.situacao?.message}>
            <select className={styles.input} aria-invalid={!!errors.situacao} {...register('situacao')}>
              {situacoes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Responsável pela clínica">
            <label className={styles.check}>
              <input type="checkbox" {...register('responsavel')} /> Esta profissional é responsável pela clínica
            </label>
          </Field>
          <Field label="Acesso ao sistema (e-mail)" error={errors.email?.message}>
            <input type="email" className={styles.input} placeholder="email@exemplo.com" aria-invalid={!!errors.email} {...register('email')} />
          </Field>
        </div>
      </section>

      {isSubmitting && <p role="status" className={styles.status}>Salvando…</p>}
      {mensagem && <p role="status" className={styles.status}>{mensagem}</p>}
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </label>
  );
}
