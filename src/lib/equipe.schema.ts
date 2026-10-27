import { z } from 'zod';
import { especialidades, situacoes } from './equipe.data';

export const profissionalSchema = z
  .object({
    nome: z.string().trim(),
    especialidade: z.enum(especialidades, { error: 'Selecione a especialidade' }),
    registro: z.string().trim(),
    rqe: z.string().trim(),
    situacao: z.enum(situacoes, { error: 'Selecione a situação' }),
    responsavel: z.boolean(),
    email: z.union([z.literal(''), z.email('E-mail inválido')]),
  })
  .superRefine((v, ctx) => {
    // Profissional ativo ou inativo já é contratado: precisa de nome e de registro no conselho.
    if (v.situacao !== 'Em breve') {
      if (v.nome.length < 3) ctx.addIssue({ code: 'custom', path: ['nome'], message: 'Informe o nome completo' });
      if (!v.registro) ctx.addIssue({ code: 'custom', path: ['registro'], message: 'Informe o registro no conselho' });
    }
    if (v.rqe && !/^\d{3,8}$/.test(v.rqe.replace(/^RQE\s*/i, ''))) {
      ctx.addIssue({ code: 'custom', path: ['rqe'], message: 'RQE com 3 a 8 dígitos' });
    }
    if (v.situacao === 'Ativo' && !v.email) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Informe o e-mail para o acesso ao sistema' });
    }
  });

export type ProfissionalInput = z.input<typeof profissionalSchema>;
export type ProfissionalValues = z.output<typeof profissionalSchema>;
