import { z } from 'zod';
import { especialidades } from './equipe.data';
import {
  categoriasDesfecho,
  loginOpcoes,
  primeiroAcessoOpcoes,
  recuperacaoOpcoes,
  situacoesProfissional,
  ufs,
} from './configuracoes.data';

const telefone = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Use o formato (00) 00000-0000');

export const configuracoesSchema = z.object({
  clinica: z.object({
    nome: z.string().trim().min(3, 'Informe o nome da clínica'),
    subtitulo: z.string().trim(),
    cidade: z.string().trim().min(2, 'Informe a cidade'),
    uf: z.enum(ufs, { error: 'Selecione a UF' }),
    telefoneConsultorio: telefone,
    whatsapp: telefone,
    telefoneUrgencia: telefone,
    horarioUrgencia: z.string().trim().regex(/^\d{2}h às \d{2}h$/, 'Use o formato 22h às 06h'),
  }),
  profissional: z.object({
    nome: z.string().trim().min(3, 'Informe o nome completo'),
    especialidade: z.enum(especialidades, { error: 'Selecione a especialidade' }),
    crm: z.string().trim().regex(/^CRM-[A-Z]{2} \d{4,6}$/, 'Use o formato CRM-UF 00000'),
    rqe: z.union([z.literal(''), z.string().trim().regex(/^RQE \d{3,8}$/, 'Use o formato RQE 00000')]),
    situacao: z.enum(situacoesProfissional, { error: 'Selecione a situação' }),
  }),
  acesso: z.object({
    login: z.enum(loginOpcoes, { error: 'Selecione o tipo de login' }),
    recuperacao: z.enum(recuperacaoOpcoes, { error: 'Selecione a recuperação' }),
    primeiroAcesso: z.enum(primeiroAcessoOpcoes, { error: 'Selecione o primeiro acesso' }),
    validadeSenhaProvisoria: z
      .number({ error: 'Informe a validade em dias' })
      .int('Use número inteiro')
      .min(1, 'Mínimo de 1 dia')
      .max(30, 'Máximo de 30 dias'),
  }),
  desfechos: z.array(
    z.object({
      codigo: z.string(),
      rotulo: z.string(),
      categoria: z.enum(categoriasDesfecho),
      geraNascimento: z.boolean(),
    }),
  ),
  // Desfecho em edição. Só é validado quando algum campo foi preenchido.
  novoDesfecho: z
    .object({
      codigo: z.string().trim(),
      rotulo: z.string().trim(),
      categoria: z.union([z.literal(''), z.enum(categoriasDesfecho)]),
      geraNascimento: z.boolean(),
    })
    .superRefine((v, ctx) => {
      if (!v.codigo && !v.rotulo && !v.categoria) return;
      if (!/^[a-z][a-z0-9_]*$/.test(v.codigo)) {
        ctx.addIssue({ code: 'custom', path: ['codigo'], message: 'Use minúsculas e _ (ex.: parto_forceps)' });
      }
      if (v.rotulo.length < 3) {
        ctx.addIssue({ code: 'custom', path: ['rotulo'], message: 'Informe o rótulo do desfecho' });
      }
      if (!v.categoria) {
        ctx.addIssue({ code: 'custom', path: ['categoria'], message: 'Selecione a categoria' });
      }
      if (v.geraNascimento && v.categoria !== 'Nascimento') {
        ctx.addIssue({
          code: 'custom',
          path: ['geraNascimento'],
          message: 'Só desfechos da categoria Nascimento geram nascimento',
        });
      }
    }),
});

export type ConfiguracoesInput = z.input<typeof configuracoesSchema>;
export type ConfiguracoesValues = z.output<typeof configuracoesSchema>;
