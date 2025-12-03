describe('Meus Agendamentos', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
  });

  describe('Interface', function () {
    it('deve exibir elementos principais da tela', function () {
      cy.navegarParaAba('MeusAgendamentos');
      cy.verificarTexto('Meus Agendamentos');
      cy.verificarElemento('searchbar-agendamentos');
      cy.verificarElemento('tab-proximos');
      cy.verificarElemento('tab-passados');
      cy.verificarElemento('fab-novo');
    });

    it('deve navegar para novo agendamento pelo FAB', function () {
      cy.navegarParaAba('MeusAgendamentos');
      cy.get('[data-testid="fab-novo"]').click();
      cy.verificarTexto('Novo Agendamento');
    });
  });

  describe('Lista de Agendamentos', function () {
    it('deve exibir agendamento criado', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto(dados.completo.clienteNome);
      });
    });

    it('deve exibir menu de opções do agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.abrirMenuAgendamento(dados.completo.clienteNome);

        cy.verificarTexto('Ver detalhes');
        cy.verificarTexto('Concluir');
        cy.verificarTexto('Cancelar');
      });
    });
  });

  describe('Busca', function () {
    it('deve filtrar agendamentos por nome', function () {
      cy.fixture('agendamentos-multiplos').then(function (agendamentos) {
        // Criar 2 agendamentos
        cy.criarAgendamento(agendamentos[0]);
        cy.get('[data-testid="button-novo-agendamento"]').click();
        cy.preencherFormularioAgendamento(agendamentos[1]);
        cy.get('[data-testid="button-agendar"]').click();
        cy.get('[data-testid="button-ver-agendamentos"]').click();

        // Buscar primeiro
        cy.buscarAgendamento(agendamentos[0].clienteNome);
        cy.verificarTexto(agendamentos[0].clienteNome);
      });
    });
  });

  describe('Ações', function () {
    it('deve concluir agendamento e mover para passados', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();

        cy.concluirAgendamento(dados.completo.clienteNome);

        cy.filtrarAgendamentos('passado');
        cy.verificarTexto(dados.completo.clienteNome);
      });
    });

    it('deve navegar para detalhes do agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();

        cy.verDetalhesAgendamento(dados.completo.clienteNome);
        cy.verificarTexto('Informações do Cliente');
      });
    });
  });

  describe('Múltiplos Agendamentos', function () {
    it('deve exibir todos os agendamentos criados', function () {
      cy.fixture('agendamentos-multiplos').then(function (agendamentos) {
        cy.criarAgendamento(agendamentos[0]);
        cy.get('[data-testid="button-novo-agendamento"]').click();
        cy.preencherFormularioAgendamento(agendamentos[1]);
        cy.get('[data-testid="button-agendar"]').click();
        cy.get('[data-testid="button-ver-agendamentos"]').click();

        cy.verificarTexto(agendamentos[0].clienteNome);
        cy.verificarTexto(agendamentos[1].clienteNome);
      });
    });
  });
});
