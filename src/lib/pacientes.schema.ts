import { z } from 'zod';
import { desfechos } from './pacientes.data';

const cpf = z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF no formato 000.000.000-00');
const telefone = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone no formato (00) 00000-0000');
const dataIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida');

export const pacienteSchema = z
  .object({
    nome: z.string().trim().min(3, 'Informe o nome completo'),
    cpf,
    nascimento: dataIso,
    telefone,
    email: z.union([z.literal(''), z.email('E-mail inválido')]),
    profissao: z.string().trim(),
    estadoCivil: z.string(),
    contatoNome: z.string().trim().min(2, 'Informe o contato de emergência'),
    contatoParentesco: z.string().trim(),
    contatoTelefone: telefone,
    referencia: z.enum(['dum', 'usg']),
    dum: z.string(),
    usgData: z.string(),
    usgIdadeDias: z.string(),
    gestacoesAnteriores: z.array(
      z.object({
        desfecho: z.enum(desfechos.map((d) => d.valor) as [string, ...string[]], { error: 'Selecione o desfecho' }),
        bebes: z.coerce.number().int().min(0, 'Mínimo 0').max(10, 'Máximo 10'),
      }),
    ),
  })
  .superRefine((v, ctx) => {
    if (v.nascimento && new Date(v.nascimento) > new Date()) {
      ctx.addIssue({ code: 'custom', path: ['nascimento'], message: 'A data de nascimento não pode ser futura' });
    }
    if (v.referencia === 'dum' && !v.dum) {
      ctx.addIssue({ code: 'custom', path: ['dum'], message: 'Informe a data da DUM' });
    }
    if (v.referencia === 'usg') {
      if (!v.usgData) ctx.addIssue({ code: 'custom', path: ['usgData'], message: 'Informe a data do USG' });
      const dias = Number(v.usgIdadeDias);
      if (!v.usgIdadeDias || Number.isNaN(dias) || dias < 0 || dias > 300) {
        ctx.addIssue({ code: 'custom', path: ['usgIdadeDias'], message: 'Informe a idade gestacional em dias (0 a 300)' });
      }
    }
  });

export type PacienteInput = z.input<typeof pacienteSchema>;
export type PacienteValues = z.output<typeof pacienteSchema>;

const DIA = 24 * 60 * 60 * 1000;

// DPP = DUM + 280 dias; com USG, DPP = data do exame + (280 − idade gestacional em dias)
export function calcularDpp(v: Pick<PacienteValues, 'referencia' | 'dum' | 'usgData' | 'usgIdadeDias'>): string | null {
  let base: Date | null = null;
  let offset = 280;
  if (v.referencia === 'dum' && v.dum) {
    base = new Date(v.dum);
  } else if (v.referencia === 'usg' && v.usgData && v.usgIdadeDias !== '') {
    base = new Date(v.usgData);
    offset = 280 - Number(v.usgIdadeDias);
  }
  if (!base || Number.isNaN(base.getTime()) || Number.isNaN(offset)) return null;
  const dpp = new Date(base.getTime() + offset * DIA);
  return dpp.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
