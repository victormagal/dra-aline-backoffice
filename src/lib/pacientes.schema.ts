import { z } from 'zod';
import { desfechos } from './pacientes.data';

const nomeCompleto = /^[\p{L}']+(?:\s+[\p{L}']+)+$/u;
const nomeSchema = z
  .string()
  .trim()
  .min(3, 'Informe o nome completo')
  .regex(nomeCompleto, 'Informe nome e sobrenome, apenas letras');
const nomeOpcional = z.string().trim().pipe(z.union([z.literal(''), nomeSchema]));

function cpfValido(valor: string): boolean {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (tamanho: number) => {
    const soma = d
      .slice(0, tamanho)
      .split('')
      .reduce((acc, n, i) => acc + Number(n) * (tamanho + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

const cpf = z
  .string()
  .min(1, 'Informe o CPF')
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF no formato 000.000.000-00')
  .refine(cpfValido, 'CPF inválido');
const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const telefone = z
  .string()
  .min(1, 'Informe o telefone')
  .regex(telefoneRegex, 'Telefone no formato (00) 00000-0000');
const telefoneOpcional = z
  .string()
  .refine((v) => v === '' || telefoneRegex.test(v), 'Telefone no formato (00) 00000-0000');

export function mascaraData(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length > 2) out += `/${d.slice(2, 4)}`;
  if (d.length > 4) out += `/${d.slice(4, 8)}`;
  return out;
}

// Converte dd/mm/aaaa em aaaa-mm-dd; retorna null se a data não existir no calendário
export function paraIso(valor: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!m) return null;
  const [, dd, mm, aaaa] = m;
  const data = new Date(Date.UTC(Number(aaaa), Number(mm) - 1, Number(dd)));
  if (data.getUTCFullYear() !== Number(aaaa) || data.getUTCMonth() !== Number(mm) - 1 || data.getUTCDate() !== Number(dd)) {
    return null;
  }
  return `${aaaa}-${mm}-${dd}`;
}

const dataBr = (vazia: string) =>
  z.string().min(1, vazia).refine((v) => paraIso(v) !== null, 'Data inválida (use dd/mm/aaaa)');

export const pacienteSchema = z
  .object({
    nome: nomeSchema,
    cpf,
    nascimento: dataBr('Informe a data de nascimento'),
    telefone,
    email: z.string().min(1, 'Informe o e-mail').pipe(z.email('E-mail inválido')),
    profissao: nomeOpcional,
    estadoCivil: z.string().min(1, 'Selecione o estado civil'),
    contatoNome: nomeOpcional,
    contatoParentesco: nomeOpcional,
    contatoTelefone: telefoneOpcional,
    referencia: z.enum(['dum', 'usg']),
    dum: z.string(),
    usgData: z.string(),
    usgIdadeDias: z.string(),
    gestacoesAnteriores: z.array(
      z.object({
        desfecho: z.enum(desfechos.map((d) => d.valor) as [string, ...string[]], { error: 'Selecione o desfecho' }),
        bebes: z
          .string()
          .min(1, 'Informe o número de bebês')
          .regex(/^\d+$/, 'Informe um número inteiro')
          .transform(Number)
          .pipe(z.number().min(1, 'Mínimo 1').max(5, 'Máximo 5')),
      }),
    ),
  })
  .superRefine((v, ctx) => {
    const nascimentoIso = paraIso(v.nascimento);
    if (nascimentoIso && new Date(nascimentoIso) > new Date()) {
      ctx.addIssue({ code: 'custom', path: ['nascimento'], message: 'A data de nascimento não pode ser futura' });
    }
    if (v.referencia === 'dum') {
      if (!v.dum) ctx.addIssue({ code: 'custom', path: ['dum'], message: 'Informe a data da DUM' });
      else if (!paraIso(v.dum)) ctx.addIssue({ code: 'custom', path: ['dum'], message: 'Data inválida (use dd/mm/aaaa)' });
    }
    if (v.referencia === 'usg') {
      if (!v.usgData) ctx.addIssue({ code: 'custom', path: ['usgData'], message: 'Informe a data do USG' });
      else if (!paraIso(v.usgData)) ctx.addIssue({ code: 'custom', path: ['usgData'], message: 'Data inválida (use dd/mm/aaaa)' });
      const dias = Number(v.usgIdadeDias);
      if (!v.usgIdadeDias || Number.isNaN(dias) || dias < 0 || dias > 300) {
        ctx.addIssue({ code: 'custom', path: ['usgIdadeDias'], message: 'Informe a idade gestacional em dias (0 a 300)' });
      }
    }
  });

export type PacienteInput = z.input<typeof pacienteSchema>;
export type PacienteValues = z.output<typeof pacienteSchema>;

export function mascaraCpf(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  let out = d.slice(0, 3);
  if (d.length > 3) out += `.${d.slice(3, 6)}`;
  if (d.length > 6) out += `.${d.slice(6, 9)}`;
  if (d.length > 9) out += `-${d.slice(9, 11)}`;
  return out;
}

export function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  let out = `(${d.slice(0, 2)}) ${d.slice(2, 7)}`;
  if (d.length > 7) out += `-${d.slice(7, 11)}`;
  return out;
}

const DIA = 24 * 60 * 60 * 1000;

// DPP = DUM + 280 dias; com USG, DPP = data do exame + (280 − idade gestacional em dias)
export function calcularDpp(v: Pick<PacienteValues, 'referencia' | 'dum' | 'usgData' | 'usgIdadeDias'>): string | null {
  let iso: string | null = null;
  let offset = 280;
  if (v.referencia === 'dum') {
    iso = paraIso(v.dum);
  } else if (v.usgData && v.usgIdadeDias !== '') {
    iso = paraIso(v.usgData);
    offset = 280 - Number(v.usgIdadeDias);
  }
  if (!iso || Number.isNaN(offset)) return null;
  const base = new Date(iso);
  const dpp = new Date(base.getTime() + offset * DIA);
  return dpp.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
