// Dados de exemplo da agenda. Serão substituídos pela leitura do PostgreSQL.
export type StatusConsulta = 'agendado' | 'realizado' | 'faltou';

export type Consulta = {
  id: string;
  horario: string;
  paciente: string;
  tipo: string;
  ig: string;
  status: StatusConsulta;
  nota: string;
};

export const consultasDoDia: Consulta[] = [
  { id: '1', horario: '09:00', paciente: 'Patrícia Regina B. Moura', tipo: 'Consulta pós-parto', ig: '—', status: 'agendado', nota: 'Ver nota' },
  { id: '2', horario: '09:40', paciente: 'Paciente 2', tipo: 'Consulta pré-natal', ig: '34+2', status: 'agendado', nota: 'Ver nota' },
  { id: '3', horario: '10:20', paciente: 'Paciente 3', tipo: 'Ultrassom obstétrico', ig: '28+4', status: 'realizado', nota: 'Laudo assinado' },
  { id: '4', horario: '11:00', paciente: 'Paciente 4', tipo: 'Consulta pós-parto', ig: '—', status: 'faltou', nota: '—' },
];

export const statusRotulo: Record<StatusConsulta, string> = {
  agendado: 'Agendado',
  realizado: 'Realizado',
  faltou: 'Faltou',
};
