import { z } from 'zod';
import { codigosDesfecho } from './desfechos.data';

// Nome e sobrenome, só letras
const nomeCompleto = /^[\p{L}']+(?:\s+[\p{L}']+)+$/u;
const nomeSchema = z
  .string()
  .trim()
  .min(3, 'Informe o nome completo')
  .regex(nomeCompleto, 'Informe nome e sobrenome, apenas letras');

const textoOpcional = z.string().trim();

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

export const dataBr = (vazia: string) =>
  z.string().min(1, vazia).refine((v) => paraIso(v) !== null, 'Data inválida (use dd/mm/aaaa)');
const dataOpcional = z.string().refine((v) => v === '' || paraIso(v) !== null, 'Data inválida (use dd/mm/aaaa)');

const sangue = z.union([z.literal(''), z.enum(['A', 'B', 'AB', 'O'])]);
const fatorRh = z.union([z.literal(''), z.enum(['+', '-'])]);
const estadosCivis = ['solteira', 'casada', 'uniao_estavel', 'divorciada', 'viuva', 'outro'];
const estadoCivil = z.string().refine((v) => estadosCivis.includes(v), 'Selecione o estado civil');

// Inteiro obrigatório dentro de uma faixa
const inteiroEntre = (min: number, max: number, msg: string) =>
  z.string().min(1, msg).refine((v) => /^\d+$/.test(v) && Number(v) >= min && Number(v) <= max, msg);

// Contato de emergência (contato_emergencia): uma linha por contato, ordenados pela ordem da lista
const contatoSchema = z.object({
  nome: nomeSchema,
  parentesco: textoOpcional,
  telefone,
});

// Parceiro (paciente_clinico.parceiro_*): opcional, mas tipo sanguíneo e Rh andam juntos
const parceiroSchema = z.object({
  nome: textoOpcional,
  nascimento: dataOpcional,
  tipoSanguineo: sangue,
  fatorRh,
  religiao: textoOpcional,
});

// Gestação anterior (gestacao_previa): uma linha por gestação, G1..Gn
const gestacaoAnterior = z.object({
  desfecho: z.enum(codigosDesfecho, { error: 'Selecione o desfecho' }),
  bebes: z
    .string()
    .min(1, 'Informe o número de bebês')
    .regex(/^\d+$/, 'Informe um número inteiro')
    .transform(Number)
    .pipe(z.number().min(1, 'Mínimo 1').max(9, 'Máximo 9')),
  tipoGemelar: z.union([z.literal(''), z.enum(['monocorionica', 'dicorionica', 'desconhecida'])]),
  ano: inteiroEntre(1900, 2100, 'Informe o ano entre 1900 e 2100'),
  semanas: inteiroEntre(0, 50, 'Informe as semanas entre 0 e 50'),
  intercorrencias: textoOpcional,
  observacoes: textoOpcional,
});

// Campos do cadastro (paciente, casal e contatos). Usados no cadastro e na edição da ficha.
export const cadastroCampos = {
  nome: nomeSchema,
  nascimento: dataBr('Informe a data de nascimento'),
  telefone,
  email: z.string().min(1, 'Informe o e-mail').pipe(z.email('E-mail inválido')),
  profissao: textoOpcional,
  estadoCivil,
  religiao: textoOpcional,
  tipoSanguineo: sangue,
  fatorRh,
  parceiro: parceiroSchema,
  contatos: z.array(contatoSchema).min(1, 'Informe ao menos um contato de emergência'),
};

type CadastroValores = {
  nascimento: string;
  tipoSanguineo: string;
  fatorRh: string;
  parceiro: { tipoSanguineo: string; fatorRh: string };
};

// Regras que cruzam campos do cadastro.
export function regrasCadastro(v: CadastroValores, ctx: z.RefinementCtx) {
  const nascimentoIso = paraIso(v.nascimento);
  if (nascimentoIso && new Date(nascimentoIso) > new Date()) {
    ctx.addIssue({ code: 'custom', path: ['nascimento'], message: 'A data de nascimento não pode ser futura' });
  }
  if ((v.tipoSanguineo === '') !== (v.fatorRh === '')) {
    ctx.addIssue({ code: 'custom', path: ['fatorRh'], message: 'Informe o tipo sanguíneo e o fator Rh juntos' });
  }
  const p = v.parceiro;
  if ((p.tipoSanguineo === '') !== (p.fatorRh === '')) {
    ctx.addIssue({ code: 'custom', path: ['parceiro', 'fatorRh'], message: 'Informe o tipo sanguíneo e o fator Rh do parceiro juntos' });
  }
}

// Gestação atual e histórico obstétrico. Entram na edição e no cadastro.
const gestacaoCampos = {
  referencia: z.enum(['dum', 'usg']),
  dum: z.string(),
  usgData: z.string(),
  usgIdadeDias: z.string(),
  gestacoesAnteriores: z.array(gestacaoAnterior),
};

type GestacaoValores = {
  referencia: string;
  dum: string;
  usgData: string;
  usgIdadeDias: string;
  gestacoesAnteriores: { bebes: number; tipoGemelar: string }[];
};

function regrasGestacao(v: GestacaoValores, ctx: z.RefinementCtx) {
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
  // Gemelar (gestacao_previa): mais de um bebê é gemelar, e a gemelar exige o tipo.
  v.gestacoesAnteriores.forEach((g, i) => {
    if (g.bebes > 1 && !g.tipoGemelar) {
      ctx.addIssue({ code: 'custom', path: ['gestacoesAnteriores', i, 'tipoGemelar'], message: 'Informe o tipo de gemelaridade' });
    }
  });
}

// Edição da ficha: cadastro e gestação, sem CPF.
export const edicaoFichaSchema = z
  .object({ ...cadastroCampos, ...gestacaoCampos })
  .superRefine((v, ctx) => {
    regrasCadastro(v, ctx);
    regrasGestacao(v, ctx);
  });

export const pacienteSchema = z
  .object({
    ...cadastroCampos,
    cpf,
    ...gestacaoCampos,
  })
  .superRefine((v, ctx) => {
    regrasCadastro(v, ctx);
    regrasGestacao(v, ctx);
  });

export type PacienteInput = z.input<typeof pacienteSchema>;
export type PacienteValues = z.output<typeof pacienteSchema>;
export type EdicaoFichaInput = z.input<typeof edicaoFichaSchema>;
export type EdicaoFichaValues = z.output<typeof edicaoFichaSchema>;

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
