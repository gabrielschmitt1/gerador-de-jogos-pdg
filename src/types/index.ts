export type Agendamento = {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  procedimento: string;
  data: Date;
  hora: string;
  valor: number;
  custo: number;
  tipoPagamento: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';
  observacoes?: string;
  status: 'proximo' | 'passado';
  avatarUrl?: string;
};

export type ResumoFinanceiro = {
  lucroTotal: number;
  totalVendido: number;
  custoTotal: number;
  vendasPorPagamento: {
    [key: string]: number;
  };
};

export type PeriodoRelatorio = 'Semanal' | 'Mensal' | 'Anual';
