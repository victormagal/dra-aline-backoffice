// Dados de exemplo das configurações. Serão substituídos pela API/banco.
export const FORM_CONFIGURACOES = 'configuracoes-form';

export const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] as const;
export const situacoesProfissional = ['Ativa', 'Inativa'] as const;
export const loginOpcoes = ['CPF e senha', 'E-mail e senha'] as const;
export const recuperacaoOpcoes = ['Link por e-mail', 'Contato no consultório'] as const;
export const primeiroAcessoOpcoes = ['Presencial, no consultório', 'Link por e-mail'] as const;
export const categoriasDesfecho = ['Nascimento', 'Perda gestacional', 'Outro'] as const;

export const desfechosIniciais = [
  { codigo: 'parto_normal', rotulo: 'Parto normal · PN', categoria: 'Nascimento', geraNascimento: true },
  { codigo: 'cesarea', rotulo: 'Cesárea · PC', categoria: 'Nascimento', geraNascimento: true },
  { codigo: 'aborto_espontaneo', rotulo: 'Aborto espontâneo · A', categoria: 'Perda gestacional', geraNascimento: false },
  { codigo: 'aborto_provocado', rotulo: 'Aborto provocado · A', categoria: 'Perda gestacional', geraNascimento: false },
  { codigo: 'gestacao_ectopica', rotulo: 'Gestação ectópica · A', categoria: 'Perda gestacional', geraNascimento: false },
  { codigo: 'obito_fetal', rotulo: 'Óbito fetal · A', categoria: 'Perda gestacional', geraNascimento: false },
  { codigo: 'outro', rotulo: 'Outro · contado à parte', categoria: 'Outro', geraNascimento: false },
];

export const configuracoesIniciais = {
  clinica: {
    nome: 'Instituto Aline Magalhães',
    subtitulo: 'Clínica de obstetrícia',
    cidade: 'Brasília',
    uf: 'DF',
    telefoneConsultorio: '(61) 3436-0207',
    whatsapp: '(61) 98422-4494',
    telefoneUrgencia: '(61) 98422-4494',
    horarioUrgencia: '22h às 06h',
  },
  profissional: {
    nome: 'Dra. Aline Magalhães',
    especialidade: 'Obstetrícia',
    crm: 'CRM-DF 17985',
    rqe: 'RQE 13693',
    situacao: 'Ativa',
  },
  acesso: {
    login: 'CPF e senha',
    recuperacao: 'Link por e-mail',
    primeiroAcesso: 'Presencial, no consultório',
    validadeSenhaProvisoria: 7,
  },
  desfechos: desfechosIniciais,
  novoDesfecho: { codigo: '', rotulo: '', categoria: '', geraNascimento: false },
} as const;

export const filtrosExames = [
  { slug: 'todos', rotulo: 'Todos', grupo: null },
  { slug: 'nutricao', rotulo: 'Nutrição', grupo: 'Nutrição' },
  { slug: 'hormonios', rotulo: 'Hormônios', grupo: 'Hormônios' },
  { slug: 'sorologia', rotulo: 'Sorologia', grupo: 'Sorologia' },
  { slug: 'rastreamento', rotulo: 'Rastreamento', grupo: 'Rastreamento' },
] as const;

export const catalogoExames = [
  { id: 'sexagem', exame: 'Sexagem fetal (sangue materno)', grupo: 'Outro', janela: 'A partir de 8 semanas', obrigatorio: false, preparo: '—', status: 'Ativo' },
  { id: 'papp', exame: 'Perfil bioquímico (PAPP-A, βhCG)', grupo: 'Rastreamento', janela: '11 semanas', obrigatorio: false, preparo: '—', status: 'Ativo' },
  { id: 'totg', exame: 'TOTG · teste oral de glicose', grupo: 'Hormônios', janela: '24 a 26 semanas', obrigatorio: true, preparo: 'Jejum 8 a 12 h · 300 ml', status: 'Ativo' },
  { id: 'gbs', exame: 'Cotonete · Streptococcus agalactiae', grupo: 'Outro', janela: '35 a 37 semanas', obrigatorio: true, preparo: '—', status: 'Ativo' },
] as const;
