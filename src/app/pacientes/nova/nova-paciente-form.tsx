'use client';

import { useState, type ReactNode } from 'react';
import { Controller, useFieldArray, useForm, useWatch, type Path, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { catalogoDesfechos } from '../../../lib/desfechos.data';
import { FORM_EDITAR_FICHA, FORM_NOVA_PACIENTE } from '../../../lib/pacientes.data';
import {
  calcularDpp,
  edicaoFichaSchema,
  mascaraCpf,
  mascaraData,
  mascaraTelefone,
  pacienteSchema,
  type EdicaoFichaInput,

  type PacienteInput,
  type PacienteValues,
} from '../../../lib/pacientes.schema';
import styles from './nova.module.css';

export type ModoCadastro = 'nova' | 'editar';

const estadosCivis = [
  { valor: 'solteira', rotulo: 'Solteira' },
  { valor: 'casada', rotulo: 'Casada' },
  { valor: 'uniao_estavel', rotulo: 'União estável' },
  { valor: 'divorciada', rotulo: 'Divorciada' },
  { valor: 'viuva', rotulo: 'Viúva' },
  { valor: 'outro', rotulo: 'Outro' },
];

const sangues = ['A', 'B', 'AB', 'O'];

const valoresVazios: PacienteInput = {
  nome: '', cpf: '', nascimento: '', telefone: '', email: '', profissao: '', estadoCivil: '', religiao: '',
  tipoSanguineo: '', fatorRh: '',
  parceiro: { nome: '', nascimento: '', tipoSanguineo: '', fatorRh: '', religiao: '' },
  contatos: [{ nome: '', parentesco: '', telefone: '' }],
  referencia: 'dum', dum: '', usgData: '', usgIdadeDias: '',
  gestacoesAnteriores: [],
};

const gestacaoVazia: PacienteInput['gestacoesAnteriores'][number] = {
  desfecho: '', bebes: '', tipoGemelar: '', ano: '', semanas: '', intercorrencias: '', observacoes: '',
};

type Props = { modo: ModoCadastro; inicial?: EdicaoFichaInput };

// Cadastro da paciente (modo "nova") e edição da ficha (modo "editar"), com as mesmas seções.
// O envio é simulado até a API existir.
export function CadastroForm({ modo, inicial }: Props) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const nova = modo === 'nova';

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PacienteInput, unknown, PacienteValues>({
    // A edição usa o schema sem CPF e sem gestações; os campos extras ficam nos valores e são ignorados.
    resolver: zodResolver((nova ? pacienteSchema : edicaoFichaSchema) as typeof pacienteSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { ...valoresVazios, ...(inicial as Partial<PacienteInput>) },
  });

  const contatos = useFieldArray({ control, name: 'contatos' });
  const gestacoes = useFieldArray({ control, name: 'gestacoesAnteriores' });

  const [referencia, dum, usgData, usgIdadeDias, gestacoesValores] = useWatch({
    control,
    name: ['referencia', 'dum', 'usgData', 'usgIdadeDias', 'gestacoesAnteriores'],
  });
  const dpp = calcularDpp({
    referencia: referencia as 'dum' | 'usg',
    dum: dum ?? '',
    usgData: usgData ?? '',
    usgIdadeDias: usgIdadeDias ?? '',
  });

  async function onSubmit() {
    setMensagem(null);
    await new Promise((r) => setTimeout(r, 300));
    setMensagem(nova ? 'Paciente cadastrada (simulação).' : 'Ficha atualizada (simulação).');
  }

  return (
    <form
      id={nova ? FORM_NOVA_PACIENTE : FORM_EDITAR_FICHA}
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Dados pessoais</h2>
        {!nova && <p className={styles.hint}>O CPF não é alterado por esta tela.</p>}
        <div className={styles.grid}>
          <Field label="Nome completo" error={errors.nome?.message}>
            <input className={styles.input} placeholder="Nome da paciente" aria-invalid={!!errors.nome} {...register('nome')} />
          </Field>
          {nova && (
            <Field label="CPF" error={errors.cpf?.message}>
              <CampoMascarado control={control} name="cpf" mascara={mascaraCpf} placeholder="000.000.000-00" invalido={!!errors.cpf} />
            </Field>
          )}
          <Field label="Data de nascimento" error={errors.nascimento?.message}>
            <CampoMascarado control={control} name="nascimento" mascara={mascaraData} placeholder="dd/mm/aaaa" invalido={!!errors.nascimento} />
          </Field>
          <Field label="Telefone" error={errors.telefone?.message}>
            <CampoMascarado control={control} name="telefone" mascara={mascaraTelefone} placeholder="(61) 00000-0000" invalido={!!errors.telefone} />
          </Field>
          <Field label="E-mail" error={errors.email?.message}>
            <input type="email" className={styles.input} placeholder="paciente@exemplo.com" aria-invalid={!!errors.email} {...register('email')} />
          </Field>
          <Field label="Profissão" error={errors.profissao?.message}>
            <input className={styles.input} placeholder="Médica" {...register('profissao')} />
          </Field>
          <Field label="Estado civil" error={errors.estadoCivil?.message}>
            <select className={styles.input} aria-invalid={!!errors.estadoCivil} {...register('estadoCivil')}>
              <option value="">Selecione</option>
              {estadosCivis.map((e) => <option key={e.valor} value={e.valor}>{e.rotulo}</option>)}
            </select>
          </Field>
          <Field label="Religião" error={errors.religiao?.message}>
            <input className={styles.input} {...register('religiao')} />
          </Field>
          <Field label="Tipo sanguíneo" error={errors.tipoSanguineo?.message}>
            <select className={styles.input} {...register('tipoSanguineo')}>
              <option value="">Não informado</option>
              {sangues.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Fator Rh" error={errors.fatorRh?.message}>
            <select className={styles.input} {...register('fatorRh')}>
              <option value="">Não informado</option>
              <option value="+">Positivo (+)</option>
              <option value="-">Negativo (−)</option>
            </select>
          </Field>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Dados do casal</h2>
        <p className={styles.subsection}>Parceiro</p>
        <div className={styles.grid}>
          <Field label="Nome" error={errors.parceiro?.nome?.message}>
            <input className={styles.input} {...register('parceiro.nome')} />
          </Field>
          <Field label="Data de nascimento" error={errors.parceiro?.nascimento?.message}>
            <CampoMascarado control={control} name="parceiro.nascimento" mascara={mascaraData} placeholder="dd/mm/aaaa" invalido={!!errors.parceiro?.nascimento} />
          </Field>
          <Field label="Tipo sanguíneo" error={errors.parceiro?.tipoSanguineo?.message}>
            <select className={styles.input} {...register('parceiro.tipoSanguineo')}>
              <option value="">Não informado</option>
              {sangues.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Fator Rh" error={errors.parceiro?.fatorRh?.message}>
            <select className={styles.input} {...register('parceiro.fatorRh')}>
              <option value="">Não informado</option>
              <option value="+">Positivo (+)</option>
              <option value="-">Negativo (−)</option>
            </select>
          </Field>
          <Field label="Religião" error={errors.parceiro?.religiao?.message}>
            <input className={styles.input} {...register('parceiro.religiao')} />
          </Field>
        </div>
        {errors.parceiro?.fatorRh?.message && <span role="alert" className={styles.error}>{errors.parceiro.fatorRh.message}</span>}
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>Contatos de emergência</h2>
        {contatos.fields.map((field, index) => (
          <div key={field.id} className={styles.linhaContato}>
            <Field label={`Contato ${index + 1} · Nome`} error={errors.contatos?.[index]?.nome?.message}>
              <input className={styles.input} aria-invalid={!!errors.contatos?.[index]?.nome} {...register(`contatos.${index}.nome`)} />
            </Field>
            <Field label="Parentesco" error={errors.contatos?.[index]?.parentesco?.message}>
              <input className={styles.input} placeholder="Cônjuge" {...register(`contatos.${index}.parentesco`)} />
            </Field>
            <Field label="Telefone" error={errors.contatos?.[index]?.telefone?.message}>
              <CampoMascarado
                control={control}
                name={`contatos.${index}.telefone`}
                mascara={mascaraTelefone}
                placeholder="(61) 00000-0000"
                invalido={!!errors.contatos?.[index]?.telefone}
              />
            </Field>
            {index > 0 && (
              <button type="button" className={styles.remover} onClick={() => contatos.remove(index)}>Remover</button>
            )}
          </div>
        ))}
        {errors.contatos?.root && <span role="alert" className={styles.error}>{errors.contatos.root.message}</span>}
        <button
          type="button"
          className={styles.secaoAdicionar}
          onClick={() => contatos.append({ nome: '', parentesco: '', telefone: '' })}
        >
          + Adicionar contato
        </button>
      </section>

      <>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Gestação atual</h2>
            <div className={styles.radios} role="radiogroup" aria-label="Referência da gestação">
              <label><input type="radio" value="dum" {...register('referencia')} /> DUM</label>
              <label><input type="radio" value="usg" {...register('referencia')} /> USG</label>
            </div>
            <div className={styles.grid}>
              {referencia === 'dum' ? (
                <Field label="Data da DUM" error={errors.dum?.message}>
                  <CampoMascarado control={control} name="dum" mascara={mascaraData} placeholder="dd/mm/aaaa" invalido={!!errors.dum} />
                </Field>
              ) : (
                <>
                  <Field label="Data do USG" error={errors.usgData?.message}>
                    <CampoMascarado control={control} name="usgData" mascara={mascaraData} placeholder="dd/mm/aaaa" invalido={!!errors.usgData} />
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
            <p className={styles.hint}>Parto normal e cesárea contam bebês. Aborto conta gestações. Mais de um bebê é gemelar. Gestações são numeradas na ordem da lista (G1, G2…).</p>
            {gestacoes.fields.map((field, index) => {
              // Mais de um bebê é gemelar (mesma regra do banco: num_bebes > 1 ⇔ gemelar)
              const gemelar = Number(gestacoesValores?.[index]?.bebes) > 1;
              const erros = errors.gestacoesAnteriores?.[index];
              return (
                <div key={field.id} className={styles.gestacao}>
                  <div className={styles.linhaHistorico1}>
                    <Field label={`G${index + 1} · Desfecho`} error={erros?.desfecho?.message}>
                      <select className={styles.input} aria-invalid={!!erros?.desfecho} {...register(`gestacoesAnteriores.${index}.desfecho`)}>
                        <option value="">Selecione</option>
                        {catalogoDesfechos.map((d) => <option key={d.codigo} value={d.codigo}>{d.rotulo}</option>)}
                      </select>
                    </Field>
                    <Field label="Bebês" error={erros?.bebes?.message}>
                      <input
                        type="number"
                        min={1}
                        max={9}
                        className={styles.input}
                        aria-invalid={!!erros?.bebes}
                        {...register(`gestacoesAnteriores.${index}.bebes`, {
                          onChange: (e) => {
                            // Gestação de um bebê não tem tipo de gemelaridade
                            if (Number(e.target.value) <= 1) setValue(`gestacoesAnteriores.${index}.tipoGemelar`, '');
                          },
                        })}
                      />
                    </Field>
                    <Field label="Ano" error={erros?.ano?.message}>
                      <input type="number" min={1900} max={2100} className={styles.input} aria-invalid={!!erros?.ano} {...register(`gestacoesAnteriores.${index}.ano`)} />
                    </Field>
                    <Field label="Semanas no desfecho" error={erros?.semanas?.message}>
                      <input type="number" min={0} max={50} className={styles.input} aria-invalid={!!erros?.semanas} {...register(`gestacoesAnteriores.${index}.semanas`)} />
                    </Field>
                    <Field label="Tipo de gemelaridade" error={erros?.tipoGemelar?.message}>
                      <select className={styles.input} disabled={!gemelar} aria-invalid={!!erros?.tipoGemelar} {...register(`gestacoesAnteriores.${index}.tipoGemelar`)}>
                        <option value="">Selecione</option>
                        <option value="monocorionica">Monocoriônica</option>
                        <option value="dicorionica">Dicoriônica</option>
                        <option value="desconhecida">Desconhecida</option>
                      </select>
                    </Field>
                  </div>
                  <div className={styles.linhaHistorico2}>
                    <Field label="Intercorrências (opcional)" error={erros?.intercorrencias?.message}>
                      <textarea rows={2} className={styles.textarea} {...register(`gestacoesAnteriores.${index}.intercorrencias`)} />
                    </Field>
                    <Field label="Observações (opcional)" error={erros?.observacoes?.message}>
                      <textarea rows={2} className={styles.textarea} {...register(`gestacoesAnteriores.${index}.observacoes`)} />
                    </Field>
                  </div>
                  <button type="button" className={styles.pillRemover} onClick={() => gestacoes.remove(index)}>Remover</button>
                </div>
              );
            })}
            <button type="button" className={styles.secaoAdicionar} onClick={() => gestacoes.append({ ...gestacaoVazia })}>
              + Adicionar gestação anterior
            </button>
          </section>
      </>

      {isSubmitting && <p role="status" className={styles.status}>Salvando…</p>}
      {mensagem && <p role="status" className={styles.status}>{mensagem}</p>}
    </form>
  );
}

export default function NovaPacienteForm() {
  return <CadastroForm modo="nova" />;
}

// Campo com máscara: a máscara é só de tela; o schema valida o texto formatado.
type FormularioCadastro = UseFormReturn<PacienteInput, unknown, PacienteValues>;

function CampoMascarado({
  control,
  name,
  mascara,
  placeholder,
  invalido,
}: {
  control: FormularioCadastro['control'];
  name: Path<PacienteInput>;
  mascara: (valor: string) => string;
  placeholder: string;
  invalido: boolean;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          inputMode="numeric"
          className={styles.input}
          placeholder={placeholder}
          aria-invalid={invalido}
          value={String(field.value ?? '')}
          onChange={(e) => field.onChange(mascara(e.target.value))}
        />
      )}
    />
  );
}

function Field({ label, error, children }: { label: string; error?: string; children?: ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span role="alert" className={styles.error}>{error}</span>}
    </label>
  );
}

