/// <reference types="cypress" />

// Custom Commands para Gerador de Jogos PDG
// Following Cypress best practices with data-testid selectors

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

// ============================================
// NAVIGATION COMMANDS
// ============================================

// Navegar para aba específica
Cypress.Commands.add(
  'navegarParaAba',
  (aba: 'GerarJogo' | 'MeusJogos' | 'Estatisticas' | 'Configuracoes') => {
    const abaMap = {
      GerarJogo: 'tab-gerar-jogo',
      MeusJogos: 'tab-meus-jogos',
      Estatisticas: 'tab-estatisticas',
      Configuracoes: 'tab-configuracoes',
    };

    cy.get(`[data-testid="${abaMap[aba]}"]`).should('be.visible').click();
  }
);

// ============================================
// ASSERTION COMMANDS
// ============================================

// Verificar se texto está visível
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
      navegarParaAba(
        aba: 'GerarJogo' | 'MeusJogos' | 'Estatisticas' | 'Configuracoes'
      ): Chainable<void>;
      verificarTexto(texto: string): Chainable<void>;
      verificarElemento(testId: string): Chainable<void>;
    }
  }
}
