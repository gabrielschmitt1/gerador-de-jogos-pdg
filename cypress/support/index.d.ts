/// <reference types="cypress" />

declare namespace Cypress {
  interface AgendamentoData {
    clienteNome: string;
    clienteTelefone?: string;
    procedimento: string;
    valor: string;
    custo?: string;
    data?: string;
    hora?: string;
    tipoPagamento?: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';
    observacoes?: string;
  }

  interface Chainable {
    limparDados(): Chainable<void>;
    preencherFormularioAgendamento(dados: AgendamentoData): Chainable<void>;
    criarAgendamento(dados: AgendamentoData): Chainable<void>;
    selecionarData(dia: string): Chainable<void>;
    selecionarHora(hora: string): Chainable<void>;
    buscarAgendamento(termo: string): Chainable<void>;
    navegarParaAba(
      aba: 'NovoAgendamento' | 'MeusAgendamentos' | 'Relatorios' | 'Configuracoes'
    ): Chainable<void>;
    filtrarAgendamentos(filtro: 'proximo' | 'passado'): Chainable<void>;
    abrirMenuAgendamento(nomeCliente: string): Chainable<void>;
    concluirAgendamento(nomeCliente: string): Chainable<void>;
    cancelarAgendamento(nomeCliente: string): Chainable<void>;
    verDetalhesAgendamento(nomeCliente: string): Chainable<void>;
    editarAgendamento(dadosAtualizados: Partial<AgendamentoData>): Chainable<void>;
    alternarModoEscuro(): Chainable<void>;
    alternarPeriodoRelatorio(periodo: 'Semanal' | 'Mensal' | 'Anual'): Chainable<void>;
    verificarTexto(texto: string): Chainable<void>;
    verificarBotao(texto: string): Chainable<void>;
  }
}
