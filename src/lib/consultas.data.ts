// Dados de exemplo da agenda. Serão substituídos pela leitura do PostgreSQL.
export type StatusConsulta = 'agendado' | 'realizado' | 'faltou';

export type Consulta = {
  pacienteId: string;
  id: string;
  data: string;
  horario: string;
  paciente: string;
  tipo: string;
  ig: string;
  status: StatusConsulta;
  nota: string;
};

export const consultas: Consulta[] = [
  { id: '1', data: '27/10/2026', horario: '09:00', pacienteId: 'p1', paciente: 'Patrícia Regina B. Moura', tipo: 'Consulta pós-parto', ig: '—', status: 'agendado', nota: 'Ver nota' },
  { id: '2', data: '27/10/2026', horario: '09:40', pacienteId: 'p2', paciente: 'Paciente 2', tipo: 'Consulta pré-natal', ig: '34+2', status: 'agendado', nota: 'Ver nota' },
  { id: '3', data: '27/10/2026', horario: '10:20', pacienteId: 'p3', paciente: 'Paciente 3', tipo: 'Ultrassom obstétrico', ig: '28+4', status: 'realizado', nota: 'Laudo assinado' },
  { id: '4', data: '27/10/2026', horario: '11:00', pacienteId: 'p4', paciente: 'Paciente 4', tipo: 'Consulta pós-parto', ig: '—', status: 'faltou', nota: '—' },
  { id: '5', data: '28/10/2026', horario: '08:30', pacienteId: 'p2', paciente: 'Paciente 2', tipo: 'Consulta pré-natal', ig: '34+3', status: 'agendado', nota: 'Ver nota' },
  { id: '6', data: '29/10/2026', horario: '14:00', pacienteId: 'p1', paciente: 'Patrícia Regina B. Moura', tipo: 'Consulta pós-parto', ig: '—', status: 'agendado', nota: 'Ver nota' },
  { id: '7', data: '31/10/2026', horario: '10:00', pacienteId: 'p3', paciente: 'Paciente 3', tipo: 'Consulta pré-natal', ig: '28+11', status: 'agendado', nota: 'Ver nota' },
  { id: '8', data: '02/11/2026', horario: '16:30', pacienteId: 'p4', paciente: 'Paciente 4', tipo: 'Consulta pós-parto', ig: '—', status: 'agendado', nota: 'Ver nota' },
  { id: '9', data: '22/10/2026', horario: '09:20', pacienteId: 'p2', paciente: 'Paciente 2', tipo: 'Consulta pré-natal', ig: '33+5', status: 'realizado', nota: 'Ver nota' },
  { id: '10', data: '20/10/2026', horario: '15:10', pacienteId: 'p3', paciente: 'Paciente 3', tipo: 'Consulta pré-natal', ig: '27+6', status: 'faltou', nota: '—' },
];

export const statusRotulo: Record<StatusConsulta, string> = {
  agendado: 'Agendado',
  realizado: 'Realizado',
  faltou: 'Faltou',
};

const formatarData = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const chaveData = (br: string) => br.split('/').reverse().join('');

const somarDias = (d: Date, dias: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + dias);
  return r;
};

export const filtrosConsultas: {
  slug: string;
  rotulo: string;
  aplica: (c: Consulta, hoje: Date) => boolean;
}[] = [
  { slug: 'hoje', rotulo: 'Hoje', aplica: (c, hoje) => c.data === formatarData(hoje) },
  {
    slug: 'proximos-7-dias',
    rotulo: 'Próximos 7 dias',
    aplica: (c, hoje) => {
      const chave = chaveData(c.data);
      return chave > chaveData(formatarData(hoje)) && chave <= chaveData(formatarData(somarDias(hoje, 7)));
    },
  },
  { slug: 'realizadas', rotulo: 'Realizadas', aplica: (c) => c.status === 'realizado' },
  { slug: 'faltas', rotulo: 'Faltas', aplica: (c) => c.status === 'faltou' },
];
