describe('Tela de Sucesso', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
  });

  describe('Exibição', function () {
    it('deve exibir mensagem de sucesso após criar agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.minimo);

        cy.verificarTexto('Agendamento Criado!');
        cy.verificarTexto('Seu agendamento foi criado com sucesso');
        cy.verificarTexto('Você receberá uma notificação antes do horário do agendamento');
      });
    });

    it('deve exibir elementos de sucesso', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.minimo);

        cy.verificarElemento('text-success-title');
        cy.verificarElemento('text-success-message');
      });
    });
  });

  describe('Navegação', function () {
    it('deve exibir e usar botões de navegação', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.minimo);

        cy.verificarElemento('button-ver-agendamentos');
        cy.verificarElemento('button-novo-agendamento');
      });
    });

    it('deve navegar para lista de agendamentos', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.minimo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto('Meus Agendamentos');
      });
    });

    it('deve navegar para novo agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.minimo);
        cy.get('[data-testid="button-novo-agendamento"]').click();
        cy.verificarTexto('Novo Agendamento');
      });
    });
  });

  describe('Fluxo Sequencial', function () {
    it('deve criar múltiplos agendamentos em sequência', function () {
      cy.fixture('agendamento').then(function (dados) {
        // Primeiro
        cy.criarAgendamento(dados.minimo);
        cy.verificarTexto('Agendamento Criado!');

        // Criar outro
        cy.get('[data-testid="button-novo-agendamento"]').click();
        cy.preencherFormularioAgendamento(dados.semTelefone);
        cy.get('[data-testid="button-agendar"]').click();
        cy.verificarTexto('Agendamento Criado!');

        // Verificar ambos na lista
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto(dados.minimo.clienteNome);
        cy.verificarTexto(dados.semTelefone.clienteNome);
      });
    });
  });
});
