// Dados de exemplo das pacientes. Serão substituídos pela API/banco.
export type Acesso = 'Ativo' | 'Primeiro acesso';

export type PacienteResumo = {
  id: string;
  nome: string;
  situacao: 'Puerpério' | 'Pré-natal';
  igOuPosParto: string;
  proximaConsulta: string;
  acesso: Acesso;
  arquivada: boolean;
};

export const pacientes: PacienteResumo[] = [
  { id: 'p1', nome: 'Patrícia Regina B. Moura', situacao: 'Puerpério', igOuPosParto: '12 dias', proximaConsulta: '19/10/2026 · pós-parto', acesso: 'Ativo', arquivada: false },
  { id: 'p2', nome: 'Paciente 2', situacao: 'Pré-natal', igOuPosParto: '34 semanas', proximaConsulta: 'A agendar', acesso: 'Ativo', arquivada: false },
  { id: 'p3', nome: 'Paciente 3', situacao: 'Pré-natal', igOuPosParto: '28 semanas', proximaConsulta: 'A agendar', acesso: 'Primeiro acesso', arquivada: false },
  { id: 'p4', nome: 'Paciente 4', situacao: 'Puerpério', igOuPosParto: '3 dias', proximaConsulta: '22/10/2026 · pós-parto', acesso: 'Primeiro acesso', arquivada: false },
];

export const filtrosPacientes: { slug: string; rotulo: string; aplica: (p: PacienteResumo) => boolean }[] = [
  { slug: 'ativas', rotulo: 'Ativas', aplica: (p) => !p.arquivada },
  { slug: 'pre-natal', rotulo: 'Pré-natal', aplica: (p) => !p.arquivada && p.situacao === 'Pré-natal' },
  { slug: 'puerperio', rotulo: 'Puerpério', aplica: (p) => !p.arquivada && p.situacao === 'Puerpério' },
  { slug: 'arquivadas', rotulo: 'Arquivadas', aplica: (p) => p.arquivada },
];

export const desfechos = [
  { valor: 'pn', rotulo: 'Parto normal' },
  { valor: 'pc', rotulo: 'Cesárea' },
  { valor: 'a', rotulo: 'Aborto' },
  { valor: 'outro', rotulo: 'Outro' },
] as const;

// Ficha completa (por enquanto só a Patrícia tem o desenho detalhado)
export type FichaPaciente = {
  id: string;
  nome: string;
  situacao: string;
  acesso: Acesso;
  idade: string;
  tipoSanguineo: string;
  parceiro: string;
  historico: { g: number; pn: number; pc: number; a: number; outros: number };
  condicoes: { rotulo: string; valor: string }[];
  linhaDoTempo: { data: string; texto: string }[];
  proximaConsulta: { titulo: string; data: string; acao: string };
  pendenciasVacinas: { vacina: string; status: 'Pendente' | 'Recusada' }[];
  login: string;
  email: string;
  ultimoAcesso: string;
};

export const fichaPatricia: FichaPaciente = {
  id: 'p1',
  nome: 'Patrícia Regina B. Moura',
  situacao: 'Puerpério · 12 dias',
  acesso: 'Ativo',
  idade: '36 anos',
  tipoSanguineo: 'A+',
  parceiro: 'Victor Magalhães · 38 anos · A+',
  historico: { g: 5, pn: 4, pc: 2, a: 0, outros: 0 },
  condicoes: [
    { rotulo: 'Gestação gemelar', valor: 'G4 (mono/di)' },
    { rotulo: 'Cesáreas', valor: 'G1 e G2' },
    { rotulo: 'Partos normais', valor: 'G3 e G4' },
    { rotulo: 'Outras condições', valor: 'Hipotireoidismo' },
  ],
  linhaDoTempo: [
    { data: '01/10/2026', texto: 'Nascimento da filha' },
    { data: '27/08/2026', texto: 'Consulta pré-natal · 34 semanas' },
    { data: '24/08/2026', texto: 'DTPa aplicada' },
    { data: '19/10/2026', texto: 'Consulta pós-parto (agendada pela clínica)' },
  ],
  proximaConsulta: { titulo: 'Consulta pós-parto', data: 'Segunda-feira, 19/10/2026', acao: 'Remarcar' },
  pendenciasVacinas: [
    { vacina: 'Hepatite B', status: 'Pendente' },
    { vacina: 'Influenza', status: 'Recusada' },
    { vacina: 'COVID-19', status: 'Recusada' },
  ],
  login: 'CPF e senha',
  email: 'Cadastrado pela clínica',
  ultimoAcesso: '—',
};

export const FORM_NOVA_PACIENTE = 'nova-paciente-form';
