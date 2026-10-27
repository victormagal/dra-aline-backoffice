import { z } from 'zod';
import { apresentacoes, liquidos, placentas, tiposUltrassom } from './ultrassons.data';

const bcf = z
  .string()
  .refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) >= 100 && Number(v) <= 220), 'BCF entre 100 e 220 bpm');

export const ultrassomSchema = z.object({
  paciente: z.string().min(1, 'Selecione a paciente'),
  agendamento: z.string(),
  tipo: z.enum(tiposUltrassom, { error: 'Selecione o tipo de exame' }),
  apresentacao: z.enum(apresentacoes, { error: 'Selecione a apresentação' }),
  placenta: z.enum(placentas, { error: 'Selecione a placenta' }),
  liquido: z.enum(liquidos, { error: 'Selecione o líquido amniótico' }),
  bcf,
  laudo: z.string().trim().min(10, 'Descreva os achados do exame (mín. 10 caracteres)'),
});

export type UltrassomInput = z.input<typeof ultrassomSchema>;
export type UltrassomValues = z.output<typeof ultrassomSchema>;
