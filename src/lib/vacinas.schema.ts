import { z } from 'zod';
import { catalogoVacinas, statusAplicacao } from './vacinas.data';

export const vacinaSchema = z
  .object({
    vacinaId: z.string().min(1, 'Selecione a vacina do catálogo'),
    alvo: z.enum(['Gestante', 'Bebê'], { error: 'Selecione o alvo' }),
    pacienteId: z.string().min(1, 'Selecione a paciente'),
    bebeId: z.string(),
    status: z.enum(statusAplicacao, { error: 'Selecione o status' }),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data'),
    observacao: z.string().trim().max(300, 'Máximo de 300 caracteres'),
  })
  .superRefine((v, ctx) => {
    const vacina = catalogoVacinas.find((c) => c.id === v.vacinaId);
    if (vacina && vacina.alvo !== v.alvo) {
      ctx.addIssue({ code: 'custom', path: ['alvo'], message: vacina.alvo === 'Gestante' ? 'Esta vacina é indicada para gestantes' : 'Esta vacina é indicada para bebês' });
    }
    if (v.alvo === 'Bebê' && !v.bebeId) {
      ctx.addIssue({ code: 'custom', path: ['bebeId'], message: 'Selecione o bebê' });
    }
    if (v.status === 'Recusada' && !v.observacao) {
      ctx.addIssue({ code: 'custom', path: ['observacao'], message: 'Informe o motivo da recusa' });
    }
  });

export type VacinaInput = z.input<typeof vacinaSchema>;
export type VacinaValues = z.output<typeof vacinaSchema>;
