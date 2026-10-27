// Dados de exemplo do calendário vacinal. Serão substituídos pela API/banco.
export type AlvoVacina = 'Gestante' | 'Bebê';
export type StatusVacina = 'Ativa' | 'Inativa';

export type VacinaCatalogo = {
  id: string;
  nome: string;
  alvo: AlvoVacina;
  janela: string;
  nota: string;
  status: StatusVacina;
};

export const catalogoVacinas: VacinaCatalogo[] = [
  { id: 'dtpa', nome: 'DTpa (difteria, tétano, coqueluche)', alvo: 'Gestante', janela: '28 a 36 semanas', nota: 'Gratuita na rede pública só para gestantes', status: 'Ativa' },
  { id: 'influenza', nome: 'Influenza', alvo: 'Gestante', janela: '—', nota: '—', status: 'Ativa' },
  { id: 'covid', nome: 'COVID-19', alvo: 'Gestante', janela: '—', nota: '—', status: 'Ativa' },
  { id: 'hepb', nome: 'Hepatite B', alvo: 'Gestante', janela: '—', nota: '—', status: 'Ativa' },
  { id: 'bronquiolite', nome: 'Bronquiolite', alvo: 'Bebê', janela: '—', nota: 'Registrada no bebê, não na gestante', status: 'Ativa' },
];

export const filtrosVacinas = [
  { slug: 'todas', rotulo: 'Todas' },
  { slug: 'gestante', rotulo: 'Gestante', alvo: 'Gestante' },
  { slug: 'bebe', rotulo: 'Bebê', alvo: 'Bebê' },
] as const;

// Bebês disponíveis para vincular (quando o alvo é bebê)
export const bebesDaPaciente = [
  { id: 'b1', pacienteId: 'p1', rotulo: 'Filha de Patrícia · nascida em 01/10/2026' },
];

export const pacientesVacina = [{ id: 'p1', nome: 'Patrícia Regina B. Moura' }];

export const statusAplicacao = ['Aplicada', 'Agendada', 'Recusada'] as const;

export const FORM_NOVA_VACINA = 'nova-vacina-form';
