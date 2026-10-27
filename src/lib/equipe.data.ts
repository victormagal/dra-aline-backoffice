// Dados de exemplo da equipe. Serão substituídos pela API/banco.
export const especialidades = ['Obstetrícia', 'Nutrição', 'Fisioterapia pélvica', 'Outra'] as const;
export const situacoes = ['Ativo', 'Em breve', 'Inativo'] as const;

export type CartaoProfissional = {
  id: string;
  nome: string | null; // null = ainda não contratado
  especialidade: string;
  registro: string | null;
  rqe: string | null;
  situacao: (typeof situacoes)[number];
  responsavel: boolean;
};

export const cartoesEquipe: CartaoProfissional[] = [
  { id: 'aline', nome: 'Dra. Aline Magalhães', especialidade: 'Obstetrícia', registro: 'CRM-DF 17985', rqe: 'RQE 13693', situacao: 'Ativo', responsavel: true },
  { id: 'nutri', nome: null, especialidade: 'Nutrição', registro: null, rqe: null, situacao: 'Em breve', responsavel: false },
  { id: 'fisio', nome: null, especialidade: 'Fisioterapia pélvica', registro: null, rqe: null, situacao: 'Em breve', responsavel: false },
];

export type MembroAcesso = { id: string; nome: string; papel: string; acesso: 'Ativo' | 'Inativo'; ultimoAcesso: string };

export const membrosAcesso: MembroAcesso[] = [
  { id: 'm1', nome: 'Dra. Aline Magalhães', papel: 'Médica', acesso: 'Ativo', ultimoAcesso: '—' },
  { id: 'm2', nome: 'Secretária da clínica', papel: 'Secretária', acesso: 'Ativo', ultimoAcesso: '—' },
];

export const FORM_NOVO_PROFISSIONAL = 'novo-profissional-form';
