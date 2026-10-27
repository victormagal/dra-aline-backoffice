'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FORM_ID,
  duracoes,
  horariosOcupados,
  pacientes,
  profissionais,
  tiposAtendimento,
} from '../../../lib/agendamento.data';
import { agendamentoSchema, mascaraHorario, type AgendamentoInput, type AgendamentoValues } from '../../../lib/agendamento.schema';
import { mascaraData, paraIso } from '../../../lib/pacientes.schema';
import styles from './novo.module.css';

export default function AgendamentoForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AgendamentoInput, unknown, AgendamentoValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      paciente: '',
      tipo: '',
      profissional: 'Dra. Aline Magalhães',
      data: '27/10/2026',
      horario: '09:00',
      duracao: '',
    },
  });

  async function onSubmit(values: AgendamentoValues) {
    setMensagem(null);
    const dataIso = paraIso(values.data);
    const ocupado = horariosOcupados.some(
      (h) => h.data === dataIso && h.horario === values.horario && h.profissional === values.profissional,
    );
    if (ocupado) {
      setError('horario', { message: 'Este horário já está ocupado para a profissional' });
      return;
    }
    // Simulação: a integração com a API entra depois.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Agendamento salvo (simulação).');
  }

  return (
    <form id={FORM_ID} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card} aria-labelledby="sec-paciente">
        <h2 id="sec-paciente" className={styles.sectionTitle}>Paciente e tipo</h2>
        <div className={styles.grid}>
          <Field label="Paciente" error={errors.paciente?.message}>
            <select className={styles.input} aria-invalid={!!errors.paciente} {...register('paciente')}>
              <option value="">Selecione a paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de atendimento" error={errors.tipo?.message}>
            <select className={styles.input} aria-invalid={!!errors.tipo} {...register('tipo')}>
              <option value="">Selecione o tipo</option>
              {tiposAtendimento.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Profissional" error={errors.profissional?.message}>
            <select className={styles.input} aria-invalid={!!errors.profissional} {...register('profissional')}>
              {profissionais.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>
      </section>

      <section className={styles.card} aria-labelledby="sec-data">
        <h2 id="sec-data" className={styles.sectionTitle}>Data e horário</h2>
        <div className={styles.grid}>
          <Field label="Data" error={errors.data?.message}>
            <Controller
              name="data"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="dd/mm/aaaa"
                  aria-invalid={!!errors.data}
                  onChange={(e) => field.onChange(mascaraData(e.target.value))}
                />
              )}
            />
          </Field>
          <Field label="Horário" error={errors.horario?.message}>
            <Controller
              name="horario"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="HH:mm"
                  aria-invalid={!!errors.horario}
                  onChange={(e) => field.onChange(mascaraHorario(e.target.value))}
                />
              )}
            />
          </Field>
          <Field label="Duração" error={errors.duracao?.message}>
            <select className={styles.input} aria-invalid={!!errors.duracao} {...register('duracao')}>
              <option value="">Selecione a duração</option>
              {duracoes.map((d) => <option key={d.valor} value={d.valor}>{d.rotulo}</option>)}
            </select>
          </Field>
        </div>
        <p className={styles.hint}>Se o horário já estiver ocupado, o sistema avisa antes de salvar.</p>
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
