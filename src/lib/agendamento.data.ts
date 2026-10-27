// Dados de exemplo para o formulário de agendamento. Serão substituídos pela API/banco.
export const pacientes = [
  { id: 'p1', nome: 'Patrícia Regina B. Moura', cpf: '123.456.789-00' },
  { id: 'p2', nome: 'Paciente 2', cpf: '987.654.321-00' },
  { id: 'p3', nome: 'Paciente 3', cpf: '456.789.123-00' },
];

export const tiposAtendimento = [
  'Consulta pré-natal',
  'Consulta pós-parto',
  'Ultrassom obstétrico',
  'Outro',
] as const;

export const profissionais = ['Dra. Aline Magalhães'] as const;

export const duracoes = [
  { valor: '15', rotulo: '15 min' },
  { valor: '30', rotulo: '30 min' },
  { valor: '45', rotulo: '45 min' },
  { valor: '60', rotulo: '60 min' },
] as const;

// Horários já ocupados (data ISO + horário + profissional)
export const horariosOcupados = [
  { data: '2026-10-27', horario: '09:00', profissional: 'Dra. Aline Magalhães' },
  { data: '2026-10-27', horario: '09:40', profissional: 'Dra. Aline Magalhães' },
];

// Id do formulário, compartilhado entre a página (botão do cabeçalho) e o formulário.
export const FORM_ID = 'agendamento-form';
