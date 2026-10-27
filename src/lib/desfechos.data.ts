// Catálogo de desfechos. Espelha a tabela desfecho_tipo da API.
export const FORM_REGISTRAR_DESFECHO = 'registrar-desfecho-form';

export const catalogoDesfechos = [
  { codigo: 'parto_normal', rotulo: 'Parto normal', categoria: 'parto_normal', geraNascimento: true, sigla: 'PN' },
  { codigo: 'cesarea', rotulo: 'Cesárea', categoria: 'cesarea', geraNascimento: true, sigla: 'PC' },
  { codigo: 'aborto_espontaneo', rotulo: 'Aborto espontâneo', categoria: 'aborto', geraNascimento: false, sigla: 'A' },
  { codigo: 'aborto_provocado', rotulo: 'Aborto provocado', categoria: 'aborto', geraNascimento: false, sigla: 'A' },
  { codigo: 'gestacao_ectopica', rotulo: 'Gestação ectópica', categoria: 'aborto', geraNascimento: false, sigla: 'A' },
  { codigo: 'obito_fetal', rotulo: 'Óbito fetal', categoria: 'aborto', geraNascimento: true, sigla: 'A' },
  { codigo: 'outro', rotulo: 'Outro', categoria: 'outro', geraNascimento: false, sigla: 'contado à parte' },
] as const;

export const categoriasDesfecho = {
  parto_normal: 'Parto normal',
  cesarea: 'Cesárea',
  aborto: 'Aborto',
  outro: 'Outro',
} as const;

export const codigosCategoria = ['parto_normal', 'cesarea', 'aborto', 'outro'] as const;

// Lista de códigos aceita pelos schemas (zod exige um tuple de strings).
export const codigosDesfecho = catalogoDesfechos.map((d) => d.codigo) as unknown as [string, ...string[]];

export function geraNascimento(codigo: string): boolean {
  return catalogoDesfechos.find((d) => d.codigo === codigo)?.geraNascimento ?? false;
}
