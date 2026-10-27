import type { EdicaoFichaInput } from './pacientes.schema';

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
  { id: 'p4', nome: 'Paciente 4', situacao: 'Puerpério', igOuPosParto: '3 dias', proximaConsulta: '22/10/2026 · pós-parto', acesso: 'Primeiro acesso', arquivada: true },
];

export const filtrosPacientes: { slug: string; rotulo: string; aplica: (p: PacienteResumo) => boolean }[] = [
  { slug: 'ativas', rotulo: 'Ativas', aplica: (p) => !p.arquivada },
  { slug: 'pre-natal', rotulo: 'Pré-natal', aplica: (p) => !p.arquivada && p.situacao === 'Pré-natal' },
  { slug: 'puerperio', rotulo: 'Puerpério', aplica: (p) => !p.arquivada && p.situacao === 'Puerpério' },
  { slug: 'arquivadas', rotulo: 'Arquivadas', aplica: (p) => p.arquivada },
];

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
    { rotulo: 'Gestação gemelar', valor: 'G4 · tipo não informado' },
    { rotulo: 'Cesáreas', valor: 'G1 e G2' },
    { rotulo: 'Partos normais', valor: 'G3, G4 e G5' },
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

// Ficha para o id informado. Pacientes sem ficha detalhada aparecem com os dados da lista.
export function montarFicha(id: string): FichaPaciente | null {
  if (id === fichaPatricia.id) return fichaPatricia;
  const resumo = pacientes.find((p) => p.id === id);
  if (!resumo) return null;
  return {
    id,
    nome: resumo.nome,
    situacao: `${resumo.situacao} · ${resumo.igOuPosParto}`,
    acesso: resumo.acesso,
    idade: '—', tipoSanguineo: '—', parceiro: '—',
    historico: { g: 0, pn: 0, pc: 0, a: 0, outros: 0 },
    condicoes: [],
    linhaDoTempo: [],
    proximaConsulta: { titulo: resumo.proximaConsulta, data: '—', acao: 'Agendar' },
    pendenciasVacinas: [],
    login: '—', email: '—', ultimoAcesso: '—',
  };
}

// Valores iniciais da edição da ficha. Só a Patrícia tem dados no mock; as demais começam em branco.
export function cadastroInicial(id: string): EdicaoFichaInput {
  const vazio = {
    nome: '', nascimento: '', telefone: '', email: '', profissao: '', estadoCivil: '', religiao: '',
    tipoSanguineo: '', fatorRh: '',
    parceiro: { nome: '', nascimento: '', tipoSanguineo: '', fatorRh: '', religiao: '' },
    contatos: [{ nome: '', parentesco: '', telefone: '' }],
  };
  const gestacaoVazia = { referencia: 'dum', dum: '', usgData: '', usgIdadeDias: '', gestacoesAnteriores: [] };
  if (id === fichaPatricia.id) {
    return {
      ...vazio,
      ...gestacaoVazia,
      nome: fichaPatricia.nome,
      tipoSanguineo: 'A',
      fatorRh: '+',
      parceiro: { ...vazio.parceiro, nome: 'Victor Magalhães', tipoSanguineo: 'A', fatorRh: '+' },
      // DUM da gestação da filha (DPP 01/10/2026, data do nascimento)
      dum: '25/12/2025',
      // G1 a G4 (G5 é a gestação atual, que gerou a filha)
      gestacoesAnteriores: [
        { desfecho: 'cesarea', bebes: '1', tipoGemelar: '', ano: '2015', semanas: '39', intercorrencias: '', observacoes: '' },
        { desfecho: 'cesarea', bebes: '1', tipoGemelar: '', ano: '2018', semanas: '38', intercorrencias: '', observacoes: '' },
        { desfecho: 'parto_normal', bebes: '1', tipoGemelar: '', ano: '2021', semanas: '40', intercorrencias: '', observacoes: '' },
        { desfecho: 'parto_normal', bebes: '2', tipoGemelar: 'desconhecida', ano: '2023', semanas: '36', intercorrencias: '', observacoes: '' },
      ],
    } as EdicaoFichaInput;
  }
  const resumo = pacientes.find((p) => p.id === id);
  return { ...vazio, ...gestacaoVazia, nome: resumo?.nome ?? '' } as EdicaoFichaInput;
}

export const FORM_NOVA_PACIENTE = 'nova-paciente-form';
export const FORM_EDITAR_FICHA = 'editar-ficha-form';
