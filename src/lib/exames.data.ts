// Dados de exemplo dos exames por paciente. Serão substituídos pela API/banco.
export const FORM_NOVO_EXAME = 'novo-exame-form';

export const trimestres = ['1º tri', '2º tri', '3º tri'] as const;
export const situacoesExame = ['Pendente', 'Disponível'] as const;

// Resultados de exames por paciente (exame_resultado). Serão substituídos pela API/banco.
export type ExameResultado = {
  id: string;
  pacienteId: string;
  exame: string;
  trimestre: '1º tri' | '2º tri' | '3º tri';
  data: string;
  situacao: 'Pendente' | 'Disponível';
  valor: string;
  unidade: string;
  referencia: string;
};

export const examesPaciente: ExameResultado[] = [
  { id: 'e1', pacienteId: 'p1', exame: 'Hemograma completo', trimestre: '1º tri', data: '20/02/2026', situacao: 'Disponível', valor: '12,4', unidade: 'g/dL', referencia: '11,0 a 16,0' },
  { id: 'e2', pacienteId: 'p1', exame: 'TOTG · teste oral de glicose', trimestre: '2º tri', data: '15/06/2026', situacao: 'Disponível', valor: '88', unidade: 'mg/dL', referencia: 'Jejum: até 92' },
  { id: 'e3', pacienteId: 'p1', exame: 'Sorologia (HIV, sífilis)', trimestre: '3º tri', data: '27/08/2026', situacao: 'Pendente', valor: '—', unidade: '—', referencia: '—' },
];
