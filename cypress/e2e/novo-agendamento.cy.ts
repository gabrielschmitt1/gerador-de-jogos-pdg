describe('Novo Agendamento', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.limparDados();
    cy.navegarParaAba('NovoAgendamento');
    cy.stubAlert();
  });

  describe('Interface', function () {
    it('deve exibir formulário completo de agendamento', function () {
      cy.verificarTexto('Novo Agendamento');
      cy.verificarElemento('input-cliente-nome');
      cy.verificarElemento('input-cliente-telefone');
      cy.verificarElemento('input-procedimento');
      cy.verificarElemento('input-valor');
      cy.verificarElemento('input-custo');
      cy.verificarElemento('button-agendar');
    });

    it('deve exibir opções de pagamento', function () {
      cy.verificarElemento('payment-option-pix');
      cy.verificarElemento('payment-option-credito');
      cy.verificarElemento('payment-option-debito');
      cy.verificarElemento('payment-option-dinheiro');
    });
  });

  describe('Criação de Agendamento', function () {
    it('deve criar agendamento com campos obrigatórios', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.preencherFormularioAgendamento(dados.minimo);
        cy.get('[data-testid="button-agendar"]').click();

        // Verificar tela de sucesso
        cy.verificarTexto('Agendamento Criado!');
      });
    });

    it('deve criar agendamento completo', function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.preencherFormularioAgendamento(dados.completo);
        cy.get('[data-testid="button-agendar"]').click();

        cy.verificarTexto('Agendamento Criado!');
        cy.verificarTexto('Seu agendamento foi criado com sucesso');
      });
    });

    it('deve criar agendamentos com diferentes tipos de pagamento', function () {
      cy.fixture('agendamento').then(function (dados) {
        const pagamentos = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'] as const;

        pagamentos.forEach(function (pagamento, index) {
          if (index > 0) {
            cy.navegarParaAba('NovoAgendamento');
          }

          const agendamento = {
            ...dados.minimo,
            clienteNome: `Cliente ${pagamento}`,
            tipoPagamento: pagamento,
          };

          cy.preencherFormularioAgendamento(agendamento);
          cy.get('[data-testid="button-agendar"]').click();
          cy.verificarTexto('Agendamento Criado!');

          if (index < pagamentos.length - 1) {
            cy.get('[data-testid="button-novo-agendamento"]').click();
          }
        });
      });
    });
  });

  describe('Validações', function () {
    it('não deve permitir criar sem nome do cliente', function () {
      cy.get('[data-testid="input-procedimento"]').type('Corte de Cabelo');
      cy.get('[data-testid="input-valor"]').type('80');
      cy.get('[data-testid="button-agendar"]').click();

      cy.verificarAlert('Por favor, preencha todos os campos obrigatórios');
    });

    it('não deve permitir criar sem procedimento', function () {
      cy.get('[data-testid="input-cliente-nome"]').type('João Silva');
      cy.get('[data-testid="input-valor"]').type('80');
      cy.get('[data-testid="button-agendar"]').click();

      cy.verificarAlert('Por favor, preencha todos os campos obrigatórios');
    });

    it('não deve permitir criar sem valor', function () {
      cy.get('[data-testid="input-cliente-nome"]').type('João Silva');
      cy.get('[data-testid="input-procedimento"]').type('Corte de Cabelo');
      cy.get('[data-testid="button-agendar"]').click();

      cy.verificarAlert('Por favor, preencha todos os campos obrigatórios');
    });

    it('não deve permitir criar sem nenhum campo', function () {
      cy.get('[data-testid="button-agendar"]').click();

      cy.verificarAlert('Por favor, preencha todos os campos obrigatórios');
    });
  });

  describe('Tela de Sucesso', function () {
    beforeEach(function () {
      cy.fixture('agendamento').then(function (dados) {
        cy.preencherFormularioAgendamento(dados.minimo);
        cy.get('[data-testid="button-agendar"]').click();
      });
    });

    it('deve exibir mensagem de sucesso e botões de ação', function () {
      cy.verificarTexto('Agendamento Criado!');
      cy.verificarTexto('Seu agendamento foi criado com sucesso');
      cy.verificarElemento('button-ver-agendamentos');
      cy.verificarElemento('button-novo-agendamento');
    });

    it('deve navegar para lista de agendamentos', function () {
      cy.get('[data-testid="button-ver-agendamentos"]').click();
      cy.verificarTexto('Meus Agendamentos');
    });

    it('deve permitir criar novo agendamento', function () {
      cy.get('[data-testid="button-novo-agendamento"]').click();
      cy.verificarTexto('Novo Agendamento');
    });
  });

  describe('Seleção de Data e Hora', function () {
    it('deve abrir calendário ao clicar no ícone', function () {
      cy.get('[data-testid="button-calendar"]').click();
      cy.verificarElemento('calendar-modal');
    });

    it('deve abrir seletor de hora ao clicar no ícone', function () {
      cy.get('[data-testid="button-time"]').click();
      cy.verificarElemento('time-picker-modal');
    });
  });
});
