describe('Detalhes do Agendamento', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();

    // Criar um agendamento para testar
    cy.fixture('agendamento').then(function (dados) {
      cy.criarAgendamento(dados.completo);
      cy.get('[data-testid="button-ver-agendamentos"]').click();
      cy.verDetalhesAgendamento(dados.completo.clienteNome);
    });
  });

  describe('Visualização', function () {
    it('deve exibir todas as seções de informação', function () {
      cy.verificarTexto('Informações do Cliente');
      cy.verificarTexto('Detalhes do Agendamento');
      cy.verificarTexto('Financeiro');
    });

    it('deve exibir informações do cliente', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.verificarTexto(dados.completo.clienteNome);
      });
    });

    it('deve exibir informações financeiras', function () {
      cy.verificarTexto('Lucro Total');
      cy.contains('R$').should('exist');
    });
  });

  describe('Botões de Ação', function () {
    it('deve exibir botões de editar e cancelar', function () {
      cy.verificarElemento('button-editar');
      cy.verificarElemento('button-cancelar');
    });
  });

  describe('Edição', function () {
    it('deve abrir modal de edição ao clicar em editar', function () {
      cy.get('[data-testid="button-editar"]').click();
      cy.verificarTexto('Editar Agendamento');
    });
  });
});
