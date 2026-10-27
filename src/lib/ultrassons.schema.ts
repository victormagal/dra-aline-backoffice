import { z } from 'zod';
import { apresentacoes, liquidos, placentas, tiposUltrassom } from './ultrassons.data';

const opcaoObrigatoria = (opcoes: readonly string[], mensagem: string) =>
  z.string().refine((v) => opcoes.includes(v), mensagem);

const bcf = z
  .string()
  .min(1, 'Informe o BCF')
  .regex(/^\d+$/, 'Informe apenas números')
  .refine((v) => Number(v) <= 300, 'BCF entre 0 e 300 bpm');

const laudo = z
  .string()
  .trim()
  .max(1000, 'Máximo de 1000 caracteres')
  .refine((v) => v === '' || v.length >= 10, 'Mínimo de 10 caracteres');

export const ultrassomSchema = z.object({
  paciente: z.string().min(1, 'Selecione a paciente'),
  agendamento: z.string().min(1, 'Selecione o agendamento vinculado'),
  tipo: opcaoObrigatoria(tiposUltrassom, 'Selecione o tipo de exame'),
  apresentacao: opcaoObrigatoria(apresentacoes, 'Selecione a apresentação'),
  placenta: opcaoObrigatoria(placentas, 'Selecione a placenta'),
  liquido: opcaoObrigatoria(liquidos, 'Selecione o líquido amniótico'),
  bcf,
  laudo,
});

export type UltrassomInput = z.input<typeof ultrassomSchema>;
export type UltrassomValues = z.output<typeof ultrassomSchema>;
