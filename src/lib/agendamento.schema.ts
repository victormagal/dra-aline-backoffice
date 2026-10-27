import { z } from 'zod';
import { profissionais, tiposAtendimento, duracoes } from './agendamento.data';
import { dataBr } from './pacientes.schema';

const horario = z
  .string()
  .min(1, 'Informe o horário')
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Informe um horário válido (HH:mm)');

export function mascaraHorario(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
}

export const agendamentoSchema = z.object({
  paciente: z.string().min(1, 'Selecione a paciente'),
  tipo: z
    .string()
    .refine((v) => (tiposAtendimento as readonly string[]).includes(v), 'Selecione o tipo de atendimento'),
  profissional: z.enum(profissionais, { error: 'Selecione o profissional' }),
  data: dataBr('Informe a data'),
  horario,
  duracao: z.enum(duracoes.map((d) => d.valor) as [string, ...string[]], {
    error: 'Selecione a duração',
  }),
});

export type AgendamentoInput = z.input<typeof agendamentoSchema>;
export type AgendamentoValues = z.output<typeof agendamentoSchema>;
