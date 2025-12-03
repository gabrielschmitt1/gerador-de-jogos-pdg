describe('Fluxos E2E Completos', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
  });

  describe('Ciclo Completo de Agendamento', function () {
    it('deve criar, visualizar e concluir agendamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        // 1. Criar agendamento
        cy.criarAgendamento(dados.completo);
        cy.verificarTexto('Agendamento Criado!');

        // 2. Ver na lista
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto(dados.completo.clienteNome);

        // 3. Concluir
        cy.concluirAgendamento(dados.completo.clienteNome);

        // 4. Verificar em passados
        cy.filtrarAgendamentos('passado');
        cy.verificarTexto(dados.completo.clienteNome);

        // 5. Ver no relatório
        cy.navegarParaAba('Relatorios');
        cy.verificarTexto('Lucro Total');
      });
    });
  });

  describe('Múltiplos Agendamentos', function () {
    it('deve criar e gerenciar vários agendamentos', function () {
      cy.fixture('agendamentos-multiplos').then(function (agendamentos) {
        // Criar 2 agendamentos
        cy.criarAgendamento(agendamentos[0]);
        cy.get('[data-testid="button-novo-agendamento"]').click();
        cy.preencherFormularioAgendamento(agendamentos[1]);
        cy.get('[data-testid="button-agendar"]').click();

        // Verificar na lista
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto(agendamentos[0].clienteNome);
        cy.verificarTexto(agendamentos[1].clienteNome);

        // Concluir um
        cy.concluirAgendamento(agendamentos[0].clienteNome);

        // Verificar divisão
        cy.filtrarAgendamentos('passado');
        cy.verificarTexto(agendamentos[0].clienteNome);
      });
    });
  });

  describe('Configurações', function () {
    it('deve configurar tema e criar agendamento', function () {
      // Configurar tema escuro
      cy.navegarParaAba('Configuracoes');
      cy.alternarModoEscuro();
      cy.verificarTexto('Tema escuro ativo');

      // Criar agendamento
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.verificarTexto('Agendamento Criado!');
      });
    });
  });

  describe('Persistência', function () {
    it('deve manter agendamentos após recarregar', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.criarAgendamento(dados.completo);
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto(dados.completo.clienteNome);

        // Recarregar
        cy.reload();
        cy.navegarParaAba('MeusAgendamentos');

        cy.verificarTexto(dados.completo.clienteNome);
      });
    });
  });

  describe('Navegação', function () {
    it('deve navegar por todas as telas do app', function () {
      cy.fixture('agendamento').then(function (dados) {
        // Criar agendamento
        cy.criarAgendamento(dados.completo);
        cy.verificarTexto('Agendamento Criado!');

        // Meus Agendamentos
        cy.get('[data-testid="button-ver-agendamentos"]').click();
        cy.verificarTexto('Meus Agendamentos');

        // Relatórios
        cy.navegarParaAba('Relatorios');
        cy.verificarTexto('Relatórios');

        // Configurações
        cy.navegarParaAba('Configuracoes');
        cy.verificarTexto('Configurações');
      });
    });
  });
});
