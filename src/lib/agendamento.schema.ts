import { z } from 'zod';
import { profissionais, tiposAtendimento, duracoes } from './agendamento.data';

const dataIso = z
  .string()
  .min(1, 'Informe a data')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida');

const horario = z
  .string()
  .min(1, 'Informe o horário')
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido');

export const agendamentoSchema = z.object({
  paciente: z.string().min(1, 'Selecione a paciente'),
  tipo: z.enum(tiposAtendimento, { error: 'Selecione o tipo de atendimento' }),
  profissional: z.enum(profissionais, { error: 'Selecione o profissional' }),
  data: dataIso,
  horario,
  duracao: z.enum(duracoes.map((d) => d.valor) as [string, ...string[]], {
    error: 'Selecione a duração',
  }),
});

export type AgendamentoInput = z.input<typeof agendamentoSchema>;
export type AgendamentoValues = z.output<typeof agendamentoSchema>;
