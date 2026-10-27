import { z } from 'zod';
import { codigosDesfecho, geraNascimento } from './desfechos.data';

const dataIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data');

// Campo numérico opcional: vazio ou dentro do intervalo.
const opcionalNumero = (min: number, max: number, msg: string) =>
  z.string().refine((v) => v === '' || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max), msg);

const bebe = z.object({
  nome: z.string().trim(),
  sexo: z.union([z.literal(''), z.enum(['feminino', 'masculino', 'indeterminado'])]),
  vivo: z.boolean(),
  pesoG: opcionalNumero(100, 10000, 'Peso entre 100 e 10000 g'),
  comprimentoCm: opcionalNumero(10, 80, 'Comprimento entre 10 e 80 cm'),
  apgar1: opcionalNumero(0, 10, 'Apgar de 0 a 10'),
  apgar5: opcionalNumero(0, 10, 'Apgar de 0 a 10'),
});

export const desfechoSchema = z
  .object({
    desfecho: z.enum(codigosDesfecho, { error: 'Selecione o desfecho' }),
    data: dataIso,
    igDias: z.string(),
    numBebes: z.coerce.number().int().min(1).max(5),
    bebes: z.array(bebe),
    observacoes: z.string().trim(),
  })
  .superRefine((v, ctx) => {
    // Aborto e outros desfechos sem nascimento não têm IG no parto nem bebês.
    if (!geraNascimento(v.desfecho)) return;
    const ig = Number(v.igDias);
    if (!v.igDias || !Number.isInteger(ig) || ig < 140 || ig > 350) {
      ctx.addIssue({ code: 'custom', path: ['igDias'], message: 'Informe a IG no parto (140 a 350 dias)' });
    }
    if (v.bebes.length !== v.numBebes) {
      ctx.addIssue({ code: 'custom', path: ['numBebes'], message: 'Número de bebês não confere com os campos abaixo' });
    }
    v.bebes.forEach((b, i) => {
      if (!b.sexo) ctx.addIssue({ code: 'custom', path: ['bebes', i, 'sexo'], message: 'Selecione o sexo' });
      if (v.desfecho === 'obito_fetal' && b.vivo) {
        ctx.addIssue({ code: 'custom', path: ['bebes', i, 'vivo'], message: 'Óbito fetal: o bebê não nasce vivo' });
      }
    });
  });

export type DesfechoInput = z.input<typeof desfechoSchema>;
export type DesfechoValues = z.output<typeof desfechoSchema>;
