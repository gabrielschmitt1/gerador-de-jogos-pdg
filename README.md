# 🍀 Gerador de Jogos PDG

Sistema de geração de jogos de loteria para as principais modalidades da Caixa Econômica Federal.

## 📱 Sobre o Projeto

O Gerador de Jogos PDG é um aplicativo mobile desenvolvido em React Native que permite gerar números aleatórios para jogos de loteria, salvar seus jogos favoritos e visualizar estatísticas de números mais sorteados.

## ✨ Funcionalidades

- 🎲 **Gerar Jogo**: Selecione a loteria e gere números aleatórios instantaneamente
- 🎫 **Meus Jogos**: Histórico completo de todos os jogos gerados e salvos
- 📊 **Estatísticas**: Visualize os números mais e menos sorteados de cada loteria
- ⭐ **Favoritos**: Marque seus jogos preferidos para acesso rápido
- 🔍 **Busca e Filtros**: Encontre jogos por número ou tipo de loteria
- 📤 **Compartilhar**: Compartilhe seus números da sorte com amigos
- 🌙 **Modo Escuro**: Interface adaptável com tema claro e escuro
- 📴 **Offline First**: Todos os dados salvos localmente, funciona sem internet

## 🎰 Loterias Suportadas

| Loteria | Números | Range |
|---------|---------|-------|
| **Mega-Sena** | 6 | 1 a 60 |
| **Quina** | 5 | 1 a 80 |
| **Lotofácil** | 15 | 1 a 25 |
| **Lotomania** | 50 | 0 a 99 |
| **Dupla Sena** | 6 | 1 a 50 |
| **Timemania** | 10 | 1 a 80 |

## 🎨 Design

O aplicativo segue as diretrizes do Material Design 3 (Material You) com:

- Interface moderna e intuitiva
- Cores temáticas para cada loteria
- Componentes do React Native Paper
- Navegação fluida com Material Bottom Tabs
- Suporte para modo claro e escuro

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática para JavaScript
- **React Native Paper** - Biblioteca de componentes Material Design 3
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Persistência local de dados (offline-first)
- **Context API** - Gerenciamento de estado global

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm (ou npm/yarn)
- Expo CLI

### Quick Start

```bash
# Instalar dependências
pnpm install

# Iniciar o projeto
pnpm start
```

### Executar no Android

```bash
pnpm android
```

### Executar na Web

```bash
pnpm web
```

## 📁 Estrutura do Projeto

```
gerador-de-jogos-pdg/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Context API para gerenciamento de estado
│   ├── navigation/       # Configuração de navegação
│   ├── screens/          # Telas do aplicativo
│   │   ├── GerarJogoScreen.tsx
│   │   ├── MeusJogosScreen.tsx
│   │   ├── EstatisticasScreen.tsx
│   │   ├── DetalhesJogoScreen.tsx
│   │   ├── SucessoJogoScreen.tsx
│   │   └── ConfiguracoesScreen.tsx
│   ├── theme/            # Configuração de tema Material Design 3
│   └── types/            # Definições de tipos TypeScript
├── assets/               # Imagens e recursos
├── android/              # Projeto Android nativo
├── App.tsx               # Componente raiz
└── package.json          # Dependências e scripts
```

## 🎯 Telas do Aplicativo

### 1. Gerar Jogo
- Seleção visual das 6 loterias disponíveis
- Geração instantânea de números aleatórios
- Visualização em "bolinhas" estilizadas com cor da loteria
- Opção de gerar novamente ou salvar

### 2. Meus Jogos
- Lista de todos os jogos salvos
- Filtros por tipo de loteria e favoritos
- Busca por números específicos
- Menu de opções (detalhes, excluir)

### 3. Estatísticas
- Seleção de loteria para visualizar
- Gráfico de barras com frequência de números
- Top 10 mais sorteados
- Top 10 menos sorteados

### 4. Detalhes do Jogo
- Visualização completa dos números
- Informações da data de criação
- Opções de compartilhar e excluir
- Toggle de favorito

### 5. Configurações
- Alternância entre tema claro/escuro
- Informações sobre as loterias
- Opções de dados (exportar, limpar)

## 🎨 Personalização

Para personalizar as cores do tema, edite o arquivo `src/theme/theme.ts`:

```typescript
const customColors = {
  primary: '#13a4ec', // Cor primária
  secondary: '#64B5F6', // Cor secundária
  // ... outras cores
};
```

## ⚠️ Aviso Legal

Este aplicativo é apenas para fins de entretenimento. Os números gerados são completamente aleatórios e não garantem prêmios em sorteios oficiais. Jogue com responsabilidade.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ por Gabriel Schmitt utilizando React Native, Expo e Material Design 3.

---

**Gerador de Jogos PDG** - Boa sorte! 🍀✨
