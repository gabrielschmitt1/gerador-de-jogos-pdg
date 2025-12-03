# Gerador de Jogos PDG

Sistema de geração de jogos para PDG

## 📱 Sobre o Projeto

O Gerador de Jogos PDG é um aplicativo mobile desenvolvido em React Native.

## ✨ Funcionalidades

- 📅 **Novo Agendamento**: Crie agendamentos com informações do cliente, procedimento, data, hora, valor e forma de pagamento
- 📋 **Meus Agendamentos**: Visualize todos os seus agendamentos (próximos e passados) com busca e filtros
- ✅ **Concluir Agendamentos**: Marque agendamentos como concluídos e mova para o histórico
- 🔍 **Detalhes**: Veja informações completas do agendamento, incluindo cálculo de lucro
- ✏️ **Edição**: Edite ou cancele agendamentos existentes
- 📊 **Relatórios**: Acompanhe métricas financeiras com períodos (semanal, mensal, anual)
- 💰 **Análise Financeira**: Visualize vendas por tipo de pagamento, lucro total e custos
- 🔔 **Notificações**: Receba lembretes automáticos 1 hora antes dos agendamentos
- 🌙 **Modo Escuro**: Interface adaptável com tema claro e escuro
- 📴 **Offline First**: Todos os dados salvos localmente, funciona sem internet

## 🎨 Design

O aplicativo segue as diretrizes do Material Design 3 (Material You) com:

- Interface moderna e intuitiva
- Tema customizável com cores primárias em azul (#13a4ec)
- Componentes do React Native Paper
- Navegação fluida com Material Bottom Tabs
- Suporte para modo claro e escuro

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática para JavaScript
- **React Native Paper** - Biblioteca de componentes Material Design 3
- **React Navigation** - Navegação entre telas
- **React Native Calendars** - Componente de calendário
- **AsyncStorage** - Persistência local de dados (offline-first)
- **Expo Notifications** - Sistema de notificações locais
- **Context API** - Gerenciamento de estado global

## 📦 Instalação

### Quick Start

```bash
npm install
npm start
```

## 📁 Estrutura do Projeto

```
gerador-de-jogos-pdg/
├── src/
│   ├── contexts/         # Context API para gerenciamento de estado
│   ├── navigation/       # Configuração de navegação
│   ├── screens/          # Telas do aplicativo
│   ├── theme/            # Configuração de tema Material Design 3
│   └── types/            # Definições de tipos TypeScript
├── scripts/              # Scripts shell utilitários
├── android/              # Projeto Android nativo
├── assets/               # Imagens e recursos
├── App.tsx               # Componente raiz
├── package.json          # Dependências e scripts
└── README.md             # Este arquivo
```

## 🎯 Telas do Aplicativo

### 1. Novo Agendamento

- Formulário completo para criar novos agendamentos
- Seleção de data com calendário visual
- Seleção de horário
- Campos para valor, custo e tipo de pagamento
- Campo de observações

### 2. Meus Agendamentos

- Lista de agendamentos com filtros (Próximos/Passados)
- Busca por nome do cliente ou procedimento
- Cards com informações resumidas
- Menu de opções (Ver detalhes, Cancelar)

### 3. Detalhes do Agendamento

- Visualização completa das informações
- Cálculo automático do lucro
- Opções para editar ou cancelar
- Seções organizadas (Cliente, Agendamento, Financeiro, Observações)

### 4. Relatórios

- Resumo financeiro com métricas principais
- Filtros por período (Semanal, Mensal, Anual)
- Gráficos de vendas por tipo de pagamento
- Cards com lucro total, vendas e custos

### 5. Configurações

- Gerenciamento de notificações
- Alternância entre tema claro/escuro
- Opções de backup e exportação de dados
- Informações sobre o aplicativo

## 🎨 Personalização

Para personalizar as cores do tema, edite o arquivo `src/theme/theme.ts`:

```typescript
const customColors = {
  primary: '#13a4ec', // Cor primária
  secondary: '#64B5F6', // Cor secundária
  tertiary: '#81C784', // Cor terciária
  // ... outras cores
};
```

## 🔄 Gerenciamento de Estado

O aplicativo utiliza:

- **Context API** para estado global
- **AsyncStorage** para persistência local
- **Offline-first**: Todos os dados são salvos localmente primeiro

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ utilizando React Native, Expo e Material Design 3.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Gerador de Jogos PDG** - Simplifique seus jogos! 🎮✨
