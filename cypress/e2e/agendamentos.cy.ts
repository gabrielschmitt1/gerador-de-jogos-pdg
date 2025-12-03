describe('Agendamentos - Fluxo Básico', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
  });

  it('deve criar um novo agendamento com sucesso', function () {
    cy.fixture('agendamento').then(function (dados) {
      cy.criarAgendamento(dados.completo);

      cy.verificarTexto('Agendamento Criado!');
      cy.verificarTexto('Seu agendamento foi criado com sucesso');
    });
  });

  it('deve visualizar agendamento criado na lista', function () {
    cy.fixture('agendamento').then(function (dados) {
      cy.criarAgendamento(dados.completo);
      cy.get('[data-testid="button-ver-agendamentos"]').click();

      cy.verificarTexto(dados.completo.clienteNome);
      cy.verificarTexto(dados.completo.procedimento);
    });
  });

  it('deve concluir agendamento e verificar em passados', function () {
    cy.fixture('agendamento').then(function (dados) {
      cy.criarAgendamento(dados.completo);
      cy.get('[data-testid="button-ver-agendamentos"]').click();

      cy.concluirAgendamento(dados.completo.clienteNome);

      cy.filtrarAgendamentos('passado');
      cy.verificarTexto(dados.completo.clienteNome);
    });
  });
});
