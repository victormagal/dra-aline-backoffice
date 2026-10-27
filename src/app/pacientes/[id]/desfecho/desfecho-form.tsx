'use client';

import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { catalogoDesfechos, FORM_REGISTRAR_DESFECHO, geraNascimento } from '../../../../lib/desfechos.data';
import { desfechoSchema, type DesfechoInput, type DesfechoValues } from '../../../../lib/desfecho.schema';
import styles from '../../nova/nova.module.css';

const novoBebe = () => ({ nome: '', sexo: '' as const, vivo: true, pesoG: '', comprimentoCm: '', apgar1: '', apgar5: '' });

export default function DesfechoForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DesfechoInput, unknown, DesfechoValues>({
    resolver: zodResolver(desfechoSchema),
    defaultValues: {
      desfecho: '',
      data: '',
      igDias: '',
      numBebes: 1,
      bebes: [novoBebe()],
      observacoes: '',
    },
  });

  const bebes = useFieldArray({ control, name: 'bebes' });
  const desfecho = useWatch({ control, name: 'desfecho' });
  const comNascimento = geraNascimento(desfecho ?? '');

  // Mantém um bloco por bebê, preservando o que já foi digitado.
  function ajustarBebes(n: number) {
    const atuais = getValues('bebes');
    bebes.replace(Array.from({ length: n }, (_, i) => atuais[i] ?? novoBebe()));
  }

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Desfecho registrado (simulação).');
  }

  return (
    <form id={FORM_REGISTRAR_DESFECHO} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Desfecho da gestação em andamento</h2>
        <div className={styles.grid}>
          <Field label="Desfecho" error={errors.desfecho?.message}>
            <select className={styles.input} aria-invalid={!!errors.desfecho} {...register('desfecho')}>
              <option value="">Selecione</option>
              {catalogoDesfechos.map((d) => <option key={d.codigo} value={d.codigo}>{d.rotulo}</option>)}
            </select>
          </Field>
          <Field label="Data do desfecho" error={errors.data?.message}>
            <input type="date" className={styles.input} aria-invalid={!!errors.data} {...register('data')} />
          </Field>
        </div>
        <p className={styles.hint}>Ao salvar, a gestação em andamento é encerrada com este desfecho.</p>
      </section>

      {comNascimento && (
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Nascimento</h2>
          <div className={styles.grid}>
            <Field label="IG no parto (dias)" error={errors.igDias?.message}>
              <input type="number" min={140} max={350} className={styles.input} aria-invalid={!!errors.igDias} {...register('igDias')} />
            </Field>
            <Field label="Número de bebês" error={errors.numBebes?.message}>
              <select
                className={styles.input}
                {...register('numBebes', { onChange: (e) => ajustarBebes(Number(e.target.value)) })}
              >
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
        </section>
      )}

      {comNascimento && bebes.fields.map((field, index) => (
        <section key={field.id} className={styles.card}>
          <h2 className={styles.sectionTitle}>Bebê {index + 1}</h2>
          <div className={styles.grid}>
            <Field label="Nome (opcional)">
              <input className={styles.input} {...register(`bebes.${index}.nome`)} />
            </Field>
            <Field label="Sexo" error={errors.bebes?.[index]?.sexo?.message}>
              <select className={styles.input} aria-invalid={!!errors.bebes?.[index]?.sexo} {...register(`bebes.${index}.sexo`)}>
                <option value="">Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="indeterminado">Indeterminado</option>
              </select>
            </Field>
            <label className={`${styles.check} ${styles.linhaCheck}`}>
              <input type="checkbox" {...register(`bebes.${index}.vivo`)} /> Nasceu vivo
            </label>
            {errors.bebes?.[index]?.vivo && <span role="alert" className={styles.error}>{errors.bebes[index]?.vivo?.message}</span>}
            <Field label="Peso (g)" error={errors.bebes?.[index]?.pesoG?.message}>
              <input type="number" className={styles.input} {...register(`bebes.${index}.pesoG`)} />
            </Field>
            <Field label="Comprimento (cm)" error={errors.bebes?.[index]?.comprimentoCm?.message}>
              <input type="number" step="0.1" className={styles.input} {...register(`bebes.${index}.comprimentoCm`)} />
            </Field>
            <Field label="Apgar 1º minuto" error={errors.bebes?.[index]?.apgar1?.message}>
              <input type="number" min={0} max={10} className={styles.input} {...register(`bebes.${index}.apgar1`)} />
            </Field>
            <Field label="Apgar 5º minuto" error={errors.bebes?.[index]?.apgar5?.message}>
              <input type="number" min={0} max={10} className={styles.input} {...register(`bebes.${index}.apgar5`)} />
            </Field>
          </div>
        </section>
      ))}

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Observações</h2>
        <Field label="Observações do parto (opcional)" error={errors.observacoes?.message}>
          <input className={styles.input} {...register('observacoes')} />
        </Field>
      </section>

      {errors.numBebes && <span role="alert" className={styles.error}>{errors.numBebes.message}</span>}
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
