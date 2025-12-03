/// <reference types="cypress" />

// Custom Commands para Gerador de Jogos PDG
// Following Cypress best practices with data-testid selectors

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

// ============================================
// UTILITY COMMANDS
// ============================================

// Limpar dados do AsyncStorage e recarregar para aplicar
Cypress.Commands.add('limparDados', () => {
  cy.log('🧹 Limpando dados');

  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });

  // Limpar IndexedDB
  cy.window().then((win) => {
    if (win.indexedDB && win.indexedDB.databases) {
      return win.indexedDB.databases().then((databases) => {
        const deletePromises = databases.map((db) => {
          if (db.name) {
            return new Promise<void>((resolve) => {
              const req = win.indexedDB.deleteDatabase(db.name!);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
            });
          }
          return Promise.resolve();
        });
        return Promise.all(deletePromises);
      });
    }
    return Promise.resolve();
  });

  // Recarregar para garantir estado limpo
  cy.reload();
});

// Stub para capturar alerts
Cypress.Commands.add('stubAlert', () => {
  cy.window().then((win) => {
    cy.stub(win, 'alert').as('alertStub');
  });
});

// Verificar se alert foi chamado com mensagem específica
Cypress.Commands.add('verificarAlert', (mensagem: string) => {
  cy.get('@alertStub').should(
    'have.been.calledWithMatch',
    new RegExp(mensagem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  );
});

// ============================================
// SWITCH COMMANDS (React Native Paper)
// ============================================

// Clicar em Switch - simplesmente clicar no elemento
Cypress.Commands.add('clicarSwitch', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).should('be.visible').click();
});

// ============================================
// FORM FILLING COMMANDS
// ============================================

// Preencher formulário de agendamento
Cypress.Commands.add('preencherFormularioAgendamento', (dados: AgendamentoData) => {
  cy.log('📝 Preenchendo formulário de agendamento');

  // Campos obrigatórios
  cy.get('[data-testid="input-cliente-nome"]').should('be.visible').clear().type(dados.clienteNome);

  cy.get('[data-testid="input-procedimento"]')
    .should('be.visible')
    .clear()
    .type(dados.procedimento);

  cy.get('[data-testid="input-valor"]').should('be.visible').clear().type(dados.valor);

  // Campos opcionais
  if (dados.clienteTelefone) {
    cy.get('[data-testid="input-cliente-telefone"]')
      .should('be.visible')
      .clear()
      .type(dados.clienteTelefone);
  }

  if (dados.custo) {
    cy.get('[data-testid="input-custo"]').should('be.visible').clear().type(dados.custo);
  }

  // Tipo de pagamento
  if (dados.tipoPagamento) {
    const paymentMap: Record<string, string> = {
      PIX: 'payment-option-pix',
      'Cartão de Crédito': 'payment-option-credito',
      'Cartão de Débito': 'payment-option-debito',
      Dinheiro: 'payment-option-dinheiro',
    };
    const testId = paymentMap[dados.tipoPagamento];
    if (testId) {
      cy.get(`[data-testid="${testId}"]`).should('be.visible').click();
    }
  }

  // Observações
  if (dados.observacoes) {
    cy.get('[data-testid="input-observacoes"]')
      .should('be.visible')
      .clear()
      .type(dados.observacoes);
  }
});

// ============================================
// NAVIGATION COMMANDS
// ============================================

// Navegar para aba específica
Cypress.Commands.add(
  'navegarParaAba',
  (aba: 'NovoAgendamento' | 'MeusAgendamentos' | 'Relatorios' | 'Configuracoes') => {
    const abaMap = {
      NovoAgendamento: 'tab-novo-agendamento',
      MeusAgendamentos: 'tab-meus-agendamentos',
      Relatorios: 'tab-relatorios',
      Configuracoes: 'tab-configuracoes',
    };

    cy.get(`[data-testid="${abaMap[aba]}"]`).should('be.visible').click();
  }
);

// ============================================
// APPOINTMENT ACTIONS
// ============================================

// Criar agendamento completo (navegar + preencher + confirmar)
Cypress.Commands.add('criarAgendamento', (dados: AgendamentoData) => {
  cy.log('🎯 Criando agendamento');

  cy.navegarParaAba('NovoAgendamento');
  cy.preencherFormularioAgendamento(dados);

  cy.get('[data-testid="button-agendar"]').should('be.visible').click();
});

// Buscar agendamento na lista
Cypress.Commands.add('buscarAgendamento', (termo: string) => {
  cy.get('[data-testid="searchbar-agendamentos"]').should('be.visible').clear().type(termo);

  cy.wait(300); // Aguardar filtro
});

// Filtrar agendamentos
Cypress.Commands.add('filtrarAgendamentos', (filtro: 'proximo' | 'passado') => {
  const testId = filtro === 'proximo' ? 'tab-proximos' : 'tab-passados';

  cy.get(`[data-testid="${testId}"]`).should('be.visible').click();
});

// Abrir menu de opções de um agendamento
Cypress.Commands.add('abrirMenuAgendamento', (nomeCliente: string) => {
  cy.get(`[data-testid="menu-button-${nomeCliente}"]`).should('be.visible').click();
});

// Concluir agendamento
Cypress.Commands.add('concluirAgendamento', (nomeCliente: string) => {
  cy.abrirMenuAgendamento(nomeCliente);

  cy.get('[data-testid="menu-option-concluir"]').should('be.visible').click();
});

// Cancelar agendamento via menu
Cypress.Commands.add('cancelarAgendamentoViaMenu', (nomeCliente: string) => {
  cy.abrirMenuAgendamento(nomeCliente);

  cy.get('[data-testid="menu-option-cancelar"]').should('be.visible').click();
});

// Ver detalhes do agendamento
Cypress.Commands.add('verDetalhesAgendamento', (nomeCliente: string) => {
  cy.abrirMenuAgendamento(nomeCliente);

  cy.get('[data-testid="menu-option-ver-detalhes"]').should('be.visible').click();
});

// ============================================
// SETTINGS COMMANDS
// ============================================

// Alternar modo escuro
Cypress.Commands.add('alternarModoEscuro', () => {
  cy.clicarSwitch('switch-modo-escuro');
});

// Alternar período no relatório
Cypress.Commands.add('alternarPeriodoRelatorio', (periodo: 'Semanal' | 'Mensal' | 'Anual') => {
  const periodoMap = {
    Semanal: 'tab-semanal',
    Mensal: 'tab-mensal',
    Anual: 'tab-anual',
  };

  cy.get(`[data-testid="${periodoMap[periodo]}"]`).should('be.visible').click();
});

// ============================================
// ASSERTION COMMANDS
// ============================================

// Verificar se texto está visível (com fallback para textos que podem estar em scroll)
Cypress.Commands.add('verificarTexto', (texto: string) => {
  cy.contains(texto).should('exist');
});

// Verificar se elemento com testId existe
Cypress.Commands.add('verificarElemento', (testId: string) => {
  cy.get(`[data-testid="${testId}"]`).should('exist');
});

// ============================================
// TYPE DECLARATIONS
// ============================================

declare global {
  namespace Cypress {
    interface Chainable {
      limparDados(): Chainable<void>;
      stubAlert(): Chainable<void>;
      verificarAlert(mensagem: string): Chainable<void>;
      clicarSwitch(testId: string): Chainable<void>;
      preencherFormularioAgendamento(dados: AgendamentoData): Chainable<void>;
      criarAgendamento(dados: AgendamentoData): Chainable<void>;
      buscarAgendamento(termo: string): Chainable<void>;
      navegarParaAba(
        aba: 'NovoAgendamento' | 'MeusAgendamentos' | 'Relatorios' | 'Configuracoes'
      ): Chainable<void>;
      filtrarAgendamentos(filtro: 'proximo' | 'passado'): Chainable<void>;
      abrirMenuAgendamento(nomeCliente: string): Chainable<void>;
      concluirAgendamento(nomeCliente: string): Chainable<void>;
      cancelarAgendamentoViaMenu(nomeCliente: string): Chainable<void>;
      verDetalhesAgendamento(nomeCliente: string): Chainable<void>;
      alternarModoEscuro(): Chainable<void>;
      alternarPeriodoRelatorio(periodo: 'Semanal' | 'Mensal' | 'Anual'): Chainable<void>;
      verificarTexto(texto: string): Chainable<void>;
      verificarElemento(testId: string): Chainable<void>;
    }
  }
}
