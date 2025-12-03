describe('Configurações', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
    cy.navegarParaAba('Configuracoes');
  });

  describe('Interface e Seções', function () {
    it('deve exibir todas as seções da tela de configurações', function () {
      cy.verificarTexto('Configurações');
      cy.verificarTexto('Notificações');
      cy.verificarTexto('Aparência');
      cy.verificarTexto('Dados e Backup');
      cy.verificarTexto('Sobre');
    });

    it('deve exibir informações da versão', function () {
      cy.verificarTexto('Versão');
      cy.verificarTexto('1.0.0');
    });
  });

  describe('Notificações', function () {
    it('deve exibir opções de notificação com switches', function () {
      cy.verificarTexto('Ativar notificações');
      cy.verificarTexto('Lembrete automático');
      cy.verificarElemento('switch-notificacoes');
      cy.verificarElemento('switch-lembrete-automatico');
    });

    it('deve permitir clicar no switch de notificações', function () {
      cy.clicarSwitch('switch-notificacoes');
      // Switch foi clicado com sucesso
    });

    it('deve permitir interagir com lembrete após ativar notificações', function () {
      cy.clicarSwitch('switch-notificacoes');
      cy.clicarSwitch('switch-lembrete-automatico');
      // Ambos os switches foram clicados
    });
  });

  describe('Aparência', function () {
    it('deve exibir opção de modo escuro', function () {
      cy.verificarTexto('Modo escuro');
      cy.verificarElemento('switch-modo-escuro');
    });

    it('deve alternar modo escuro e atualizar descrição', function () {
      cy.verificarTexto('Tema claro ativo');
      cy.alternarModoEscuro();
      cy.verificarTexto('Tema escuro ativo');
    });

    it('deve persistir preferência de tema após navegar', function () {
      cy.alternarModoEscuro();
      cy.verificarTexto('Tema escuro ativo');

      cy.navegarParaAba('MeusAgendamentos');
      cy.navegarParaAba('Configuracoes');

      cy.verificarTexto('Tema escuro ativo');
    });
  });

  describe('Dados e Backup', function () {
    it('deve exibir opções de exportar e importar dados', function () {
      cy.verificarTexto('Exportar dados');
      cy.verificarTexto('Salvar seus agendamentos em arquivo');
      cy.verificarTexto('Importar dados');
      cy.verificarTexto('Restaurar agendamentos de backup');
    });

    it('deve permitir clicar nas opções de dados', function () {
      cy.get('[data-testid="button-exportar-dados"]').should('exist').click();
      cy.get('[data-testid="button-importar-dados"]').should('exist').click();
    });
  });

  describe('Persistência', function () {
    it('deve manter tema escuro após recarregar página', function () {
      cy.alternarModoEscuro();
      cy.verificarTexto('Tema escuro ativo');

      cy.visit('/');
      cy.navegarParaAba('Configuracoes');

      cy.verificarTexto('Tema escuro ativo');
    });
  });
});
