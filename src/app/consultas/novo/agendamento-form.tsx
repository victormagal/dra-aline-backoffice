'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FORM_ID,
  duracoes,
  horariosOcupados,
  pacientes,
  profissionais,
  tiposAtendimento,
} from '../../../lib/agendamento.data';
import { agendamentoSchema, type AgendamentoInput, type AgendamentoValues } from '../../../lib/agendamento.schema';
import styles from './novo.module.css';

export default function AgendamentoForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AgendamentoInput, unknown, AgendamentoValues>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      paciente: '',
      tipo: 'Consulta pré-natal',
      profissional: 'Dra. Aline Magalhães',
      data: '2026-10-27',
      horario: '09:00',
      duracao: '30',
    },
  });

  async function onSubmit(values: AgendamentoValues) {
    setMensagem(null);
    const ocupado = horariosOcupados.some(
      (h) => h.data === values.data && h.horario === values.horario && h.profissional === values.profissional,
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
              <option value="">Buscar por nome ou CPF</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome} · {p.cpf}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de atendimento" error={errors.tipo?.message}>
            <select className={styles.input} aria-invalid={!!errors.tipo} {...register('tipo')}>
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
            <input type="date" className={styles.input} aria-invalid={!!errors.data} {...register('data')} />
          </Field>
          <Field label="Horário" error={errors.horario?.message}>
            <input type="time" className={styles.input} aria-invalid={!!errors.horario} {...register('horario')} />
          </Field>
          <Field label="Duração" error={errors.duracao?.message}>
            <select className={styles.input} aria-invalid={!!errors.duracao} {...register('duracao')}>
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
