'use client';

import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { desfechos, FORM_NOVA_PACIENTE } from '../../../lib/pacientes.data';
import { calcularDpp, pacienteSchema, type PacienteInput, type PacienteValues } from '../../../lib/pacientes.schema';
import styles from './nova.module.css';

const estadosCivis = ['Solteira', 'Casada', 'União estável', 'Divorciada', 'Viúva'];

export default function NovaPacienteForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PacienteInput, unknown, PacienteValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nome: '', cpf: '', nascimento: '', telefone: '', email: '', profissao: '', estadoCivil: '',
      contatoNome: '', contatoParentesco: '', contatoTelefone: '',
      referencia: 'dum', dum: '', usgData: '', usgIdadeDias: '',
      gestacoesAnteriores: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'gestacoesAnteriores' });

  const [referencia, dum, usgData, usgIdadeDias] = useWatch({
    control,
    name: ['referencia', 'dum', 'usgData', 'usgIdadeDias'],
  });
  const dpp = calcularDpp({ referencia: referencia as 'dum' | 'usg', dum: dum ?? '', usgData: usgData ?? '', usgIdadeDias: usgIdadeDias ?? '' });

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Paciente cadastrada (simulação).');
  }

  return (
    <form id={FORM_NOVA_PACIENTE} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Dados pessoais</h2>
        <div className={styles.grid}>
          <Field label="Nome completo" error={errors.nome?.message}>
            <input className={styles.input} placeholder="Nome da paciente" aria-invalid={!!errors.nome} {...register('nome')} />
          </Field>
          <Field label="CPF" error={errors.cpf?.message}>
            <input className={styles.input} placeholder="000.000.000-00" aria-invalid={!!errors.cpf} {...register('cpf')} />
          </Field>
          <Field label="Data de nascimento" error={errors.nascimento?.message}>
            <input type="date" className={styles.input} aria-invalid={!!errors.nascimento} {...register('nascimento')} />
          </Field>
          <Field label="Telefone" error={errors.telefone?.message}>
            <input className={styles.input} placeholder="(61) 00000-0000" aria-invalid={!!errors.telefone} {...register('telefone')} />
          </Field>
          <Field label="E-mail" error={errors.email?.message}>
            <input type="email" className={styles.input} placeholder="paciente@exemplo.com" aria-invalid={!!errors.email} {...register('email')} />
          </Field>
          <Field label="Profissão" error={errors.profissao?.message}>
            <input className={styles.input} placeholder="ex.: professora" {...register('profissao')} />
          </Field>
          <Field label="Estado civil" error={errors.estadoCivil?.message}>
            <select className={styles.input} {...register('estadoCivil')}>
              <option value="">Selecione</option>
              {estadosCivis.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Contato de emergência</h2>
        <div className={styles.grid}>
          <Field label="Nome" error={errors.contatoNome?.message}>
            <input className={styles.input} placeholder="Nome do contato" aria-invalid={!!errors.contatoNome} {...register('contatoNome')} />
          </Field>
          <Field label="Parentesco" error={errors.contatoParentesco?.message}>
            <input className={styles.input} placeholder="ex.: marido" {...register('contatoParentesco')} />
          </Field>
          <Field label="Telefone do contato" error={errors.contatoTelefone?.message}>
            <input className={styles.input} placeholder="(61) 00000-0000" aria-invalid={!!errors.contatoTelefone} {...register('contatoTelefone')} />
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Gestação atual</h2>
        <div className={styles.radios} role="radiogroup" aria-label="Referência da gestação">
          <label><input type="radio" value="dum" {...register('referencia')} /> DUM</label>
          <label><input type="radio" value="usg" {...register('referencia')} /> USG</label>
        </div>
        <div className={styles.grid}>
          {referencia === 'dum' ? (
            <Field label="Data da DUM" error={errors.dum?.message}>
              <input type="date" className={styles.input} aria-invalid={!!errors.dum} {...register('dum')} />
            </Field>
          ) : (
            <>
              <Field label="Data do USG" error={errors.usgData?.message}>
                <input type="date" className={styles.input} aria-invalid={!!errors.usgData} {...register('usgData')} />
              </Field>
              <Field label="Idade gestacional na data (dias)" error={errors.usgIdadeDias?.message}>
                <input type="number" min={0} max={300} className={styles.input} aria-invalid={!!errors.usgIdadeDias} {...register('usgIdadeDias')} />
              </Field>
            </>
          )}
          <Field label="DPP calculada">
            <span className={styles.dpp}>{dpp ?? '—'}</span>
          </Field>
        </div>
        <p className={styles.hint}>DPP = DUM + 280 dias. Para USG, informe a data do exame e a idade gestacional em dias.</p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Histórico obstétrico</h2>
        <p className={styles.hint}>Parto normal e cesárea contam bebês. Aborto conta gestações.</p>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.gestacao}>
            <Field label="Desfecho" error={errors.gestacoesAnteriores?.[index]?.desfecho?.message}>
              <select className={styles.input} {...register(`gestacoesAnteriores.${index}.desfecho`)}>
                <option value="">Selecione</option>
                {desfechos.map((d) => <option key={d.valor} value={d.valor}>{d.rotulo}</option>)}
              </select>
            </Field>
            <Field label="Bebês" error={errors.gestacoesAnteriores?.[index]?.bebes?.message}>
              <input type="number" min={0} max={10} className={styles.input} {...register(`gestacoesAnteriores.${index}.bebes`)} />
            </Field>
            <button type="button" className={styles.rowRemove} onClick={() => remove(index)}>Remover</button>
          </div>
        ))}
        <button type="button" className={styles.secaoAdicionar} onClick={() => append({ desfecho: '', bebes: 1 })}>
          + Adicionar gestação anterior
        </button>
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
