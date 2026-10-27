'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { especialidades } from '../../lib/equipe.data';
import { backup } from '../../lib/clinica.data';
import {
  categoriasDesfecho,
  configuracoesIniciais,
  FORM_CONFIGURACOES,
  loginOpcoes,
  primeiroAcessoOpcoes,
  recuperacaoOpcoes,
  situacoesProfissional,
  ufs,
} from '../../lib/configuracoes.data';
import {
  configuracoesSchema,
  type ConfiguracoesInput,
  type ConfiguracoesValues,
} from '../../lib/configuracoes.schema';
import styles from './configuracoes.module.css';

const novoVazio = { codigo: '', rotulo: '', categoria: '', geraNascimento: false } as const;

export default function ConfiguracoesForm() {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConfiguracoesInput, unknown, ConfiguracoesValues>({
    resolver: zodResolver(configuracoesSchema),
    defaultValues: configuracoesIniciais as ConfiguracoesInput,
  });

  const { fields, append } = useFieldArray({ control, name: 'desfechos' });
  const erroNovo = errors.novoDesfecho;

  // Valida só o desfecho em edição; se estiver vazio, não faz nada.
  async function adicionarDesfecho() {
    const ok = await trigger('novoDesfecho');
    if (!ok) return;
    const { codigo, rotulo, categoria, geraNascimento } = getValues('novoDesfecho');
    if (!codigo && !rotulo && !categoria) return;
    append({ codigo, rotulo, categoria: categoria as 'Nascimento', geraNascimento });
    setValue('novoDesfecho', { ...novoVazio });
  }

  async function onSubmit() {
    setMensagem(null);
    // Simulação: a gravação entra quando a API existir.
    await new Promise((r) => setTimeout(r, 300));
    setMensagem('Configurações salvas (simulação).');
  }

  return (
    <form id={FORM_CONFIGURACOES} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.linha1}>
        <section className={styles.card}>
          <div>
            <h2 className={styles.sectionTitle}>Dados da clínica</h2>
            <p className={styles.hint}>Aparecem no cabeçalho, na agenda e nas mensagens às pacientes</p>
          </div>
          <div className={styles.grid2}>
            <Field label="Nome da clínica" error={errors.clinica?.nome?.message}>
              <input className={styles.input} aria-invalid={!!errors.clinica?.nome} {...register('clinica.nome')} />
            </Field>
            <Field label="Subtítulo" error={errors.clinica?.subtitulo?.message}>
              <input className={styles.input} aria-invalid={!!errors.clinica?.subtitulo} {...register('clinica.subtitulo')} />
            </Field>
            <Field label="Cidade" error={errors.clinica?.cidade?.message}>
              <input className={styles.input} aria-invalid={!!errors.clinica?.cidade} {...register('clinica.cidade')} />
            </Field>
            <Field label="UF" error={errors.clinica?.uf?.message}>
              <select className={styles.input} aria-invalid={!!errors.clinica?.uf} {...register('clinica.uf')}>
                {ufs.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </Field>
            <Field label="Telefone do consultório" error={errors.clinica?.telefoneConsultorio?.message}>
              <input className={styles.input} placeholder="(00) 0000-0000" aria-invalid={!!errors.clinica?.telefoneConsultorio} {...register('clinica.telefoneConsultorio')} />
            </Field>
            <Field label="WhatsApp" error={errors.clinica?.whatsapp?.message}>
              <input className={styles.input} placeholder="(00) 00000-0000" aria-invalid={!!errors.clinica?.whatsapp} {...register('clinica.whatsapp')} />
            </Field>
            <Field label="Telefone de urgências" error={errors.clinica?.telefoneUrgencia?.message}>
              <input className={styles.input} placeholder="(00) 00000-0000" aria-invalid={!!errors.clinica?.telefoneUrgencia} {...register('clinica.telefoneUrgencia')} />
            </Field>
            <Field label="Horário de urgência" error={errors.clinica?.horarioUrgencia?.message}>
              <input className={styles.input} placeholder="22h às 06h" aria-invalid={!!errors.clinica?.horarioUrgencia} {...register('clinica.horarioUrgencia')} />
            </Field>
          </div>
        </section>

        <section className={styles.card}>
          <div>
            <h2 className={styles.sectionTitle}>Profissional responsável</h2>
            <p className={styles.hint}>Assina laudos e aparece no perfil da clínica</p>
          </div>
          <div className={styles.grid2}>
            <Field label="Nome completo" error={errors.profissional?.nome?.message} full>
              <input className={styles.input} aria-invalid={!!errors.profissional?.nome} {...register('profissional.nome')} />
            </Field>
            <Field label="Especialidade" error={errors.profissional?.especialidade?.message} full>
              <select className={styles.input} aria-invalid={!!errors.profissional?.especialidade} {...register('profissional.especialidade')}>
                {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </Field>
            <Field label="CRM" error={errors.profissional?.crm?.message}>
              <input className={styles.input} placeholder="CRM-DF 00000" aria-invalid={!!errors.profissional?.crm} {...register('profissional.crm')} />
            </Field>
            <Field label="RQE" error={errors.profissional?.rqe?.message}>
              <input className={styles.input} placeholder="RQE 00000" aria-invalid={!!errors.profissional?.rqe} {...register('profissional.rqe')} />
            </Field>
            <Field label="Situação" error={errors.profissional?.situacao?.message} full>
              <select className={styles.input} aria-invalid={!!errors.profissional?.situacao} {...register('profissional.situacao')}>
                {situacoesProfissional.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </section>
      </div>

      <div className={styles.linha2}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Acesso dos pacientes</h2>
          <div className={styles.grid2}>
            <Field label="Login" error={errors.acesso?.login?.message}>
              <select className={styles.input} aria-invalid={!!errors.acesso?.login} {...register('acesso.login')}>
                {loginOpcoes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Recuperação de senha" error={errors.acesso?.recuperacao?.message}>
              <select className={styles.input} aria-invalid={!!errors.acesso?.recuperacao} {...register('acesso.recuperacao')}>
                {recuperacaoOpcoes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Primeiro acesso" error={errors.acesso?.primeiroAcesso?.message}>
              <select className={styles.input} aria-invalid={!!errors.acesso?.primeiroAcesso} {...register('acesso.primeiroAcesso')}>
                {primeiroAcessoOpcoes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Validade da senha provisória (dias)" error={errors.acesso?.validadeSenhaProvisoria?.message}>
              <input
                type="number"
                min={1}
                max={30}
                className={styles.input}
                aria-invalid={!!errors.acesso?.validadeSenhaProvisoria}
                {...register('acesso.validadeSenhaProvisoria', { valueAsNumber: true })}
              />
            </Field>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Backup</h2>
          <p className={styles.backupTexto}>{backup.ultimo}</p>
          <p className={styles.backupTexto}>{backup.instrucao}</p>
          <button type="button" className={styles.primary} style={{ alignSelf: 'flex-start' }}>Gerar backup agora</button>
        </section>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.sectionTitle}>Desfechos obstétricos</h2>
          <button type="button" className={styles.secondary} onClick={adicionarDesfecho}>Adicionar desfecho</button>
        </div>

        <div className={styles.chips}>
          {fields.map((f) => (
            <span key={f.id} className={styles.chip}>{f.rotulo}</span>
          ))}
        </div>

        <div className={styles.novo}>
          <Field label="Código técnico" error={erroNovo?.codigo?.message}>
            <input className={styles.input} placeholder="ex.: parto_forceps" aria-invalid={!!erroNovo?.codigo} {...register('novoDesfecho.codigo')} />
          </Field>
          <Field label="Rótulo" error={erroNovo?.rotulo?.message}>
            <input className={styles.input} placeholder="ex.: Parto com fórceps" aria-invalid={!!erroNovo?.rotulo} {...register('novoDesfecho.rotulo')} />
          </Field>
          <Field label="Categoria" error={erroNovo?.categoria?.message}>
            <select className={styles.input} aria-invalid={!!erroNovo?.categoria} {...register('novoDesfecho.categoria')}>
              <option value="">Selecione</option>
              {categoriasDesfecho.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Gera nascimento" error={erroNovo?.geraNascimento?.message}>
            <label className={styles.toggle}>
              <input type="checkbox" role="switch" {...register('novoDesfecho.geraNascimento')} />
              Gera nascimento
            </label>
          </Field>
        </div>
      </section>

      {isSubmitting && <p role="status" className={styles.status}>Salvando…</p>}
      {mensagem && <p role="status" className={styles.status}>{mensagem}</p>}
    </form>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`${styles.field} ${full ? styles.full : ''}`}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </label>
  );
}
