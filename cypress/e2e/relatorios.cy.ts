describe('Relatórios', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
  });

  describe('Interface', function () {
    it('deve exibir estrutura básica da tela', function () {
      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('Relatórios');
      cy.verificarTexto('Resumo');
      cy.verificarElemento('tab-semanal');
      cy.verificarElemento('tab-mensal');
      cy.verificarElemento('tab-anual');
    });

    it('deve exibir cards de métricas', function () {
      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('Lucro Total');
      cy.verificarTexto('Total Vendido');
      cy.verificarTexto('Custo Total');
    });

    it('deve exibir seção de vendas por tipo de pagamento', function () {
      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('Vendas por Tipo de Pagamento');
    });
  });

  describe('Cálculos com Agendamentos', function () {
    it('deve exibir valores após concluir agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.concluirAgendamento(dados.completo.clienteNome);
      });

      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('Lucro Total');
      cy.contains('R$').should('exist');
    });

    it('deve exibir tipo de pagamento no gráfico', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.concluirAgendamento(dados.completo.clienteNome);
      });

      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('PIX');
    });
  });

  describe('Filtros de Período', function () {
    it('deve alternar entre períodos', function () {
      cy.navegarParaAba('Relatorios');

      cy.alternarPeriodoRelatorio('Semanal');
      cy.verificarTexto('Total Vendido');

      cy.alternarPeriodoRelatorio('Mensal');
      cy.verificarTexto('Total Vendido');

      cy.alternarPeriodoRelatorio('Anual');
      cy.verificarTexto('Total Vendido');
    });
  });

  describe('Badge de Tendência', function () {
    it('deve exibir indicador de crescimento', function () {
      cy.navegarParaAba('Relatorios');
      cy.verificarTexto('+15%');
    });
  });
});
