// Dados de exemplo do perfil da clínica. Serão substituídos pela API/banco.
export const clinica = {
  nome: 'Instituto Aline Magalhães',
  descricao: 'Clínica de obstetrícia · Brasília, DF',
  contatos: [
    { rotulo: 'Consultório', valor: '(61) 3436-0207 · (61) 98242-0207' },
    { rotulo: 'WhatsApp', valor: '(61) 98422-4494 (dúvidas)' },
    { rotulo: 'Urgências', valor: '(61) 98422-4494 · ligação, 22h às 06h' },
  ],
};

export const responsavel = {
  nome: 'Dra. Aline Magalhães',
  cargo: 'Médica obstetra',
  registros: [
    { rotulo: 'CRM', valor: 'CRM-DF 17985' },
    { rotulo: 'RQE', valor: 'RQE 13693' },
    { rotulo: 'Status', valor: 'Ativa' },
  ],
};

export const acessoPacientes = [
  { rotulo: 'Login', valor: 'CPF e senha' },
  { rotulo: 'Recuperação', valor: 'Link enviado ao e-mail da paciente' },
  { rotulo: 'Primeiro acesso', valor: 'Presencial, no consultório' },
  { rotulo: 'Senha provisória', valor: 'Não utilizada' },
];

export const backup = {
  ultimo: 'Último backup manual: não registrado',
  instrucao: 'Gere um backup do banco e dos arquivos e copie o resultado para fora do servidor.',
};
