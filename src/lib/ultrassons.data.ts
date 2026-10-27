// Dados de exemplo dos ultrassons. Serão substituídos pela API/banco.
export const tiposUltrassom = ['Obstétrico', 'Morfológico', 'Ecocardiografia', 'Doppler'] as const;
export const apresentacoes = ['Cefálica', 'Pélvica', 'Transversa'] as const;
export const placentas = ['Anterior', 'Posterior', 'Fúndica', 'Prévia'] as const;
export const liquidos = ['Normal', 'Aumentado', 'Diminuído'] as const;

export type UltrassomRegistro = {
  pacienteId: string;
  id: string;
  data: string; // dd/mm/aaaa
  paciente: string;
  ig: string;
  tipo: (typeof tiposUltrassom)[number];
  apresentacao: string;
  bcf: string;
};

export const ultrassons: UltrassomRegistro[] = [
  { id: 'u1', data: '20/02/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '7+1', tipo: 'Obstétrico', apresentacao: '—', bcf: '126 bpm' },
  { id: 'u2', data: '31/03/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '12+4', tipo: 'Morfológico', apresentacao: '—', bcf: '—' },
  { id: 'u3', data: '28/04/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '17 sem', tipo: 'Obstétrico', apresentacao: 'Pélvica', bcf: '152 bpm' },
  { id: 'u4', data: '27/07/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '30+1', tipo: 'Ecocardiografia', apresentacao: 'Cefálica', bcf: '163 bpm' },
  { id: 'u5', data: '27/08/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '34+2', tipo: 'Doppler', apresentacao: 'Cefálica', bcf: '143 bpm' },
  { id: 'u6', data: '10/09/2026', pacienteId: 'p1', paciente: 'Patrícia R. B. Moura', ig: '36 sem', tipo: 'Obstétrico', apresentacao: 'Cefálica', bcf: '138 bpm' },
];

export const filtrosUltrassom = [
  { slug: 'todos', rotulo: 'Todos' },
  { slug: 'obstetrico', rotulo: 'Obstétrico', tipo: 'Obstétrico' },
  { slug: 'morfologico', rotulo: 'Morfológico', tipo: 'Morfológico' },
  { slug: 'ecocardiografia', rotulo: 'Ecocardiografia', tipo: 'Ecocardiografia' },
  { slug: 'doppler', rotulo: 'Doppler', tipo: 'Doppler' },
] as const;

// Agendamentos disponíveis para vincular ao ultrassom
export const agendamentosVinculo = [
  { id: 'a1', pacienteId: 'p1', rotulo: 'Consulta · 27/10/2026 às 09:00' },
];

export const pacientesUltrassom = [{ id: 'p1', nome: 'Patrícia Regina B. Moura' }];

export const FORM_REGISTRAR_ULTRASSOM = 'registrar-ultrassom-form';
