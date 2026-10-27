'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  agendamentosVinculo,
  apresentacoes,
  FORM_REGISTRAR_ULTRASSOM,
  liquidos,
  pacientesUltrassom,
  placentas,
  tiposUltrassom,
} from '../../../lib/ultrassons.data';
import { ultrassomSchema, type UltrassomInput, type UltrassomValues } from '../../../lib/ultrassons.schema';
import styles from './novo.module.css';

// Idade gestacional da paciente na data do exame (vem do cálculo com a DUM/USG; fixo nesta versão).
const IDADE_GESTACIONAL = '32 semanas e 4 dias';

export default function RegistrarUltrassomForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UltrassomInput, unknown, UltrassomValues>({
    resolver: zodResolver(ultrassomSchema),
    defaultValues: {
      paciente: 'p1',
      agendamento: 'a1',
      tipo: 'Obstétrico',
      apresentacao: 'Cefálica',
      placenta: 'Anterior',
      liquido: 'Normal',
      bcf: '142',
      laudo: '',
    },
  });

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Ultrassom salvo (simulação).');
  }

  return (
    <form id={FORM_REGISTRAR_ULTRASSOM} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Atendimento</h2>
        <div className={styles.grid}>
          <Field label="Paciente" error={errors.paciente?.message}>
            <select className={styles.input} aria-invalid={!!errors.paciente} {...register('paciente')}>
              {pacientesUltrassom.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </Field>
          <Field label="Agendamento vinculado" error={errors.agendamento?.message}>
            <select className={styles.input} {...register('agendamento')}>
              <option value="">Nenhum</option>
              {agendamentosVinculo.map((a) => <option key={a.id} value={a.id}>{a.rotulo}</option>)}
            </select>
          </Field>
          <Field label="Tipo" error={errors.tipo?.message}>
            <select className={styles.input} aria-invalid={!!errors.tipo} {...register('tipo')}>
              {tiposUltrassom.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Idade gestacional na data">
            <span className={styles.readonly}>{IDADE_GESTACIONAL}</span>
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Achados</h2>
        <div className={styles.grid}>
          <Field label="Apresentação" error={errors.apresentacao?.message}>
            <select className={styles.input} aria-invalid={!!errors.apresentacao} {...register('apresentacao')}>
              {apresentacoes.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Placenta" error={errors.placenta?.message}>
            <select className={styles.input} aria-invalid={!!errors.placenta} {...register('placenta')}>
              {placentas.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Líquido amniótico" error={errors.liquido?.message}>
            <select className={styles.input} aria-invalid={!!errors.liquido} {...register('liquido')}>
              {liquidos.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="BCF (bpm)" error={errors.bcf?.message}>
            <input inputMode="numeric" className={styles.input} aria-invalid={!!errors.bcf} {...register('bcf')} />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Laudo</h2>
        <Field label="Descrição do exame" error={errors.laudo?.message}>
          <textarea
            rows={8}
            className={styles.input}
            style={{ height: 'auto', padding: '12px 14px' }}
            placeholder="Descreva os achados do exame"
            aria-invalid={!!errors.laudo}
            {...register('laudo')}
          />
        </Field>
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
