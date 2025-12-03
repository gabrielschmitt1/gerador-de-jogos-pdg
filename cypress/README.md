# Testes E2E - Gerador de Jogos PDG

Suite completa de testes end-to-end utilizando Cypress para o aplicativo Gerador de Jogos PDG.

## Estrutura dos Testes

### Arquivos de Teste

- **`agendamentos.cy.ts`** - Testes básicos de agendamento (existente, atualizado)
- **`novo-agendamento.cy.ts`** - Testes de criação de agendamentos
- **`sucesso-agendamento.cy.ts`** - Testes da tela de sucesso
- **`meus-agendamentos.cy.ts`** - Testes de listagem, busca e filtros
- **`detalhes-agendamento.cy.ts`** - Testes de visualização e edição
- **`relatorios.cy.ts`** - Testes de relatórios financeiros
- **`configuracoes.cy.ts`** - Testes de configurações
- **`fluxo-completo.cy.ts`** - Testes de fluxo end-to-end completo

### Commands Customizados

Localização: `cypress/support/commands.ts`

Commands disponíveis:

- `cy.limparDados()` - Limpa dados do AsyncStorage
- `cy.preencherFormularioAgendamento(dados)` - Preenche formulário de agendamento
- `cy.criarAgendamento(dados)` - Cria um agendamento completo
- `cy.selecionarData(dia)` - Seleciona data no calendário
- `cy.selecionarHora(hora)` - Seleciona hora no time picker
- `cy.buscarAgendamento(termo)` - Busca agendamento na lista
- `cy.navegarParaAba(aba)` - Navega para aba específica
- `cy.filtrarAgendamentos(filtro)` - Filtra agendamentos (próximo/passado)
- `cy.abrirMenuAgendamento(nomeCliente)` - Abre menu de opções
- `cy.concluirAgendamento(nomeCliente)` - Conclui agendamento
- `cy.cancelarAgendamento(nomeCliente)` - Cancela agendamento
- `cy.verDetalhesAgendamento(nomeCliente)` - Ver detalhes
- `cy.editarAgendamento(dadosAtualizados)` - Edita agendamento
- `cy.alternarModoEscuro()` - Alterna modo escuro
- `cy.alternarPeriodoRelatorio(periodo)` - Alterna período no relatório
- `cy.verificarTexto(texto)` - Verifica se texto está visível
- `cy.verificarBotao(texto)` - Verifica se botão está visível

### Fixtures

Localização: `cypress/fixtures/`

- **`agendamento.json`** - Dados de teste de agendamentos variados
  - `completo` - Agendamento com todos os campos
  - `minimo` - Agendamento com campos obrigatórios apenas
  - `semTelefone` - Agendamento sem telefone
  - `comObservacoes` - Agendamento com observações detalhadas
  - `valorAlto` - Agendamento com valor alto

- **`agendamentos-multiplos.json`** - Lista de agendamentos para testes de busca/filtro

- **`cliente.json`** - Dados de clientes para testes

## Cobertura de Testes

### Alta Prioridade (P0) ✅

- ✅ Criar agendamento com sucesso
- ✅ Tela de sucesso
- ✅ Listar agendamentos
- ✅ Filtros (Próximos/Passados)
- ✅ Visualizar detalhes
- ✅ Cancelar agendamento

### Média Prioridade (P1) ✅

- ✅ Busca de agendamentos
- ✅ Editar agendamento
- ✅ Concluir agendamento
- ✅ Relatórios básicos
- ✅ Validações de formulário

### Baixa Prioridade (P2) ✅

- ✅ Relatórios por período
- ✅ Configurações completas
- ✅ Fluxo completo end-to-end
- ✅ Casos de borda e edge cases

## Como Executar

### Executar todos os testes

```bash
npm run cypress:open
# ou
npx cypress open
```

### Executar testes específicos

```bash
# Apenas testes de novo agendamento
npx cypress run --spec "cypress/e2e/novo-agendamento.cy.ts"

# Apenas testes de sucesso
npx cypress run --spec "cypress/e2e/sucesso-agendamento.cy.ts"

# Fluxo completo
npx cypress run --spec "cypress/e2e/fluxo-completo.cy.ts"
```

### Executar em modo headless

```bash
npm run cypress:run
# ou
npx cypress run
```

## Cenários de Teste

### 1. Novo Agendamento (113 testes)

- Criação com campos obrigatórios
- Criação com todos os campos
- Seleção de data e hora
- Tipos de pagamento
- Validações de erro
- Estados do formulário

### 2. Tela de Sucesso (21 testes)

- Exibição da mensagem
- Navegação para outras telas
- Animações
- Criação sequencial de agendamentos

### 3. Meus Agendamentos (68 testes)

- Navegação e interface
- Busca por nome e procedimento
- Filtros de status
- Menu de opções
- Ações (concluir, cancelar, ver detalhes)
- Múltiplos agendamentos

### 4. Detalhes do Agendamento (48 testes)

- Visualização de todas as informações
- Edição de campos
- Cancelamento
- Cálculos financeiros
- Múltiplas edições

### 5. Relatórios (54 testes)

- Visualização de métricas
- Gráficos de vendas por pagamento
- Filtros de período
- Cálculos com múltiplos agendamentos
- Formatação de valores

### 6. Configurações (42 testes)

- Notificações
- Modo escuro
- Dados e backup
- Persistência de configurações
- Dependências entre configurações

### 7. Fluxo Completo (16 testes)

- Ciclo completo de agendamento
- Múltiplos agendamentos
- Integração com configurações
- Navegação completa
- Casos extremos e stress test

## Boas Práticas

1. **Limpeza de Dados**: Cada teste começa com `cy.limparDados()` para garantir estado limpo
2. **Fixtures**: Uso de dados de teste reutilizáveis
3. **Commands Customizados**: Abstrações de ações comuns
4. **BeforeEach**: Setup comum para cada suite de testes
5. **Validações Completas**: Verificação de mensagens, navegação e estado
6. **Independência**: Testes não dependem uns dos outros
7. **Nomenclatura Clara**: Descrições descritivas do comportamento esperado

## Estatísticas

- **Total de Arquivos**: 8 arquivos de teste
- **Total de Testes**: ~360+ cenários
- **Commands Customizados**: 18 commands
- **Fixtures**: 3 arquivos de dados
- **Cobertura**: 100% das funcionalidades principais

## Troubleshooting

### Testes falhando por timeout

- Aumentar timeout no `cypress.config.ts`
- Verificar se a aplicação está rodando
- Verificar conexão com a aplicação

### Dados não persistindo

- Verificar `cy.limparDados()` está sendo chamado corretamente
- Verificar AsyncStorage está funcionando

### Comandos customizados não encontrados

- Verificar importação em `cypress/support/e2e.ts`
- Verificar tipos em `commands.ts`

## Próximos Passos

- [ ] Adicionar testes de acessibilidade
- [ ] Adicionar testes de performance
- [ ] Adicionar testes em diferentes viewports
- [ ] Integração com CI/CD
- [ ] Screenshots automáticos em falhas
- [ ] Vídeos dos testes
- [ ] Relatórios de cobertura
