'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bebesDaPaciente, catalogoVacinas, FORM_NOVA_VACINA, pacientesVacina, statusAplicacao } from '../../../lib/vacinas.data';
import { vacinaSchema, type VacinaInput, type VacinaValues } from '../../../lib/vacinas.schema';
import styles from './nova.module.css';

export default function NovaVacinaForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VacinaInput, unknown, VacinaValues>({
    resolver: zodResolver(vacinaSchema),
    defaultValues: {
      vacinaId: 'dtpa',
      alvo: 'Gestante',
      pacienteId: 'p1',
      bebeId: '',
      status: 'Aplicada',
      data: '2026-10-27',
      observacao: '',
    },
  });

  const alvo = useWatch({ control, name: 'alvo' });
  const status = useWatch({ control, name: 'status' });

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Vacina salva (simulação).');
  }

  return (
    <form id={FORM_NOVA_VACINA} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Aplicação</h2>
        <div className={styles.grid}>
          <Field label="Vacina do catálogo" error={errors.vacinaId?.message}>
            <select className={styles.input} aria-invalid={!!errors.vacinaId} {...register('vacinaId')}>
              {catalogoVacinas.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
            </select>
          </Field>
          <Field label="Alvo" error={errors.alvo?.message}>
            <div className={styles.radios} role="radiogroup" aria-label="Alvo">
              <label><input type="radio" value="Gestante" {...register('alvo')} /> Gestante</label>
              <label><input type="radio" value="Bebê" {...register('alvo')} /> Bebê</label>
            </div>
          </Field>
          <Field label="Paciente" error={errors.pacienteId?.message}>
            <select className={styles.input} aria-invalid={!!errors.pacienteId} {...register('pacienteId')}>
              {pacientesVacina.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </Field>
          <Field label="Bebê" error={errors.bebeId?.message}>
            <select className={styles.input} disabled={alvo !== 'Bebê'} aria-invalid={!!errors.bebeId} {...register('bebeId')}>
              <option value="">{alvo === 'Bebê' ? 'Selecione' : 'Disponível quando o alvo for bebê'}</option>
              {bebesDaPaciente.map((b) => <option key={b.id} value={b.id}>{b.rotulo}</option>)}
            </select>
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select className={styles.input} aria-invalid={!!errors.status} {...register('status')}>
              {statusAplicacao.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Data" error={errors.data?.message}>
            <input type="date" className={styles.input} aria-invalid={!!errors.data} {...register('data')} />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Observações</h2>
        <Field label={status === 'Recusada' ? 'Motivo da recusa' : 'Observação'} error={errors.observacao?.message}>
          <textarea
            rows={4}
            className={styles.input}
            style={{ height: 'auto', padding: '12px 14px' }}
            placeholder="Lote, local de aplicação ou motivo da recusa"
            aria-invalid={!!errors.observacao}
            {...register('observacao')}
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
