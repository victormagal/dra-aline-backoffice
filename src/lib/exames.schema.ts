import { z } from 'zod';
import { situacoesExame, trimestres } from './exames.data';

const data = z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Use o formato dd/mm/aaaa');

// Converte dd/mm/aaaa para número yyyymmdd, para comparar datas como texto.
function ordem(d: string) {
  const [dia, mes, ano] = d.split('/');
  return Number(`${ano}${mes}${dia}`);
}

export const exameSchema = z
  .object({
    pacienteId: z.string().min(1, 'Selecione a paciente'),
    exame: z.string().min(1, 'Selecione o exame do catálogo'),
    trimestre: z.enum(trimestres, { error: 'Selecione o trimestre' }),
    dataColeta: data,
    dataResultado: z.union([z.literal(''), data]),
    valor: z.string().trim(),
    unidade: z.string().trim(),
    situacao: z.enum(situacoesExame, { error: 'Selecione a situação' }),
    observacao: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    if (v.situacao === 'Disponível') {
      if (!v.valor) ctx.addIssue({ code: 'custom', path: ['valor'], message: 'Informe o valor para resultado disponível' });
      if (!v.dataResultado) ctx.addIssue({ code: 'custom', path: ['dataResultado'], message: 'Informe a data do resultado' });
    }
    if (v.dataResultado && data.safeParse(v.dataColeta).success && ordem(v.dataResultado) < ordem(v.dataColeta)) {
      ctx.addIssue({ code: 'custom', path: ['dataResultado'], message: 'O resultado não pode ser anterior à coleta' });
    }
  });

export type ExameInput = z.input<typeof exameSchema>;
export type ExameValues = z.output<typeof exameSchema>;
