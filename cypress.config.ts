import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '8x71uo',
  e2e: {
    baseUrl: 'http://localhost:8081',
    testIsolation: true,
    viewportWidth: 430,
    viewportHeight: 932,
    experimentalPromptCommand: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
