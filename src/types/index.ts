// Tipos de Loteria suportados
export type TipoLoteria =
  | 'mega-sena'
  | 'quina'
  | 'lotofacil'
  | 'lotomania'
  | 'dupla-sena'
  | 'timemania';

// Configuração de cada loteria
export interface ConfigLoteria {
  id: TipoLoteria;
  nome: string;
  numeros: number; // quantidade de números a escolher
  min: number; // número mínimo
  max: number; // número máximo
  cor: string; // cor tema da loteria
  icone: string; // ícone MaterialCommunityIcons
  descricao: string;
}

// Configurações de todas as loterias
export const LOTERIAS: Record<TipoLoteria, ConfigLoteria> = {
  'mega-sena': {
    id: 'mega-sena',
    nome: 'Mega-Sena',
    numeros: 6,
    min: 1,
    max: 60,
    cor: '#209869',
    icone: 'clover',
    descricao: 'Escolha 6 números de 1 a 60',
  },
  quina: {
    id: 'quina',
    nome: 'Quina',
    numeros: 5,
    min: 1,
    max: 80,
    cor: '#260085',
    icone: 'star-outline',
    descricao: 'Escolha 5 números de 1 a 80',
  },
  lotofacil: {
    id: 'lotofacil',
    nome: 'Lotofácil',
    numeros: 15,
    min: 1,
    max: 25,
    cor: '#930089',
    icone: 'grid',
    descricao: 'Escolha 15 números de 1 a 25',
  },
  lotomania: {
    id: 'lotomania',
    nome: 'Lotomania',
    numeros: 50,
    min: 0,
    max: 99,
    cor: '#F78100',
    icone: 'numeric',
    descricao: 'Escolha 50 números de 0 a 99',
  },
  'dupla-sena': {
    id: 'dupla-sena',
    nome: 'Dupla Sena',
    numeros: 6,
    min: 1,
    max: 50,
    cor: '#A61324',
    icone: 'dice-multiple',
    descricao: 'Escolha 6 números de 1 a 50',
  },
  timemania: {
    id: 'timemania',
    nome: 'Timemania',
    numeros: 10,
    min: 1,
    max: 80,
    cor: '#00FF48',
    icone: 'soccer',
    descricao: 'Escolha 10 números de 1 a 80',
  },
};

// Jogo gerado/salvo
export interface Jogo {
  id: string;
  loteria: TipoLoteria;
  numeros: number[];
  dataCriacao: Date;
  observacoes?: string;
  favorito: boolean;
}

// Estatísticas de um número
export interface EstatisticaNumero {
  numero: number;
  frequencia: number;
  percentual: number;
}

// Estatísticas de uma loteria
export interface EstatisticasLoteria {
  loteria: TipoLoteria;
  totalSorteios: number;
  numerosMaisFrequentes: EstatisticaNumero[];
  numerosMenosFrequentes: EstatisticaNumero[];
  ultimaAtualizacao: Date;
}

// Dados mockados de estatísticas (simulando dados reais)
export const ESTATISTICAS_MOCK: Record<TipoLoteria, EstatisticaNumero[]> = {
  'mega-sena': [
    { numero: 10, frequencia: 287, percentual: 11.2 },
    { numero: 53, frequencia: 282, percentual: 11.0 },
    { numero: 5, frequencia: 280, percentual: 10.9 },
    { numero: 23, frequencia: 278, percentual: 10.8 },
    { numero: 33, frequencia: 276, percentual: 10.7 },
    { numero: 4, frequencia: 274, percentual: 10.6 },
    { numero: 42, frequencia: 272, percentual: 10.6 },
    { numero: 37, frequencia: 270, percentual: 10.5 },
    { numero: 24, frequencia: 268, percentual: 10.4 },
    { numero: 51, frequencia: 266, percentual: 10.3 },
    { numero: 26, frequencia: 210, percentual: 8.2 },
    { numero: 55, frequencia: 208, percentual: 8.1 },
    { numero: 9, frequencia: 206, percentual: 8.0 },
    { numero: 21, frequencia: 204, percentual: 7.9 },
    { numero: 39, frequencia: 202, percentual: 7.8 },
  ],
  quina: [
    { numero: 4, frequencia: 452, percentual: 9.8 },
    { numero: 52, frequencia: 448, percentual: 9.7 },
    { numero: 16, frequencia: 445, percentual: 9.6 },
    { numero: 39, frequencia: 442, percentual: 9.5 },
    { numero: 70, frequencia: 440, percentual: 9.5 },
    { numero: 25, frequencia: 438, percentual: 9.4 },
    { numero: 61, frequencia: 435, percentual: 9.4 },
    { numero: 11, frequencia: 432, percentual: 9.3 },
    { numero: 74, frequencia: 430, percentual: 9.3 },
    { numero: 3, frequencia: 428, percentual: 9.2 },
    { numero: 77, frequencia: 380, percentual: 8.2 },
    { numero: 19, frequencia: 378, percentual: 8.1 },
    { numero: 45, frequencia: 375, percentual: 8.1 },
    { numero: 66, frequencia: 372, percentual: 8.0 },
    { numero: 80, frequencia: 370, percentual: 8.0 },
  ],
  lotofacil: [
    { numero: 20, frequencia: 1892, percentual: 64.2 },
    { numero: 10, frequencia: 1885, percentual: 64.0 },
    { numero: 25, frequencia: 1880, percentual: 63.8 },
    { numero: 11, frequencia: 1875, percentual: 63.6 },
    { numero: 14, frequencia: 1870, percentual: 63.5 },
    { numero: 3, frequencia: 1865, percentual: 63.3 },
    { numero: 5, frequencia: 1860, percentual: 63.1 },
    { numero: 13, frequencia: 1855, percentual: 62.9 },
    { numero: 24, frequencia: 1850, percentual: 62.8 },
    { numero: 4, frequencia: 1845, percentual: 62.6 },
    { numero: 16, frequencia: 1720, percentual: 58.4 },
    { numero: 22, frequencia: 1715, percentual: 58.2 },
    { numero: 8, frequencia: 1710, percentual: 58.0 },
    { numero: 1, frequencia: 1705, percentual: 57.9 },
    { numero: 19, frequencia: 1700, percentual: 57.7 },
  ],
  lotomania: [
    { numero: 47, frequencia: 520, percentual: 26.0 },
    { numero: 33, frequencia: 518, percentual: 25.9 },
    { numero: 16, frequencia: 515, percentual: 25.7 },
    { numero: 90, frequencia: 512, percentual: 25.6 },
    { numero: 5, frequencia: 510, percentual: 25.5 },
    { numero: 70, frequencia: 508, percentual: 25.4 },
    { numero: 24, frequencia: 505, percentual: 25.2 },
    { numero: 81, frequencia: 502, percentual: 25.1 },
    { numero: 62, frequencia: 500, percentual: 25.0 },
    { numero: 4, frequencia: 498, percentual: 24.9 },
    { numero: 99, frequencia: 420, percentual: 21.0 },
    { numero: 0, frequencia: 418, percentual: 20.9 },
    { numero: 55, frequencia: 415, percentual: 20.7 },
    { numero: 78, frequencia: 412, percentual: 20.6 },
    { numero: 31, frequencia: 410, percentual: 20.5 },
  ],
  'dupla-sena': [
    { numero: 10, frequencia: 320, percentual: 12.8 },
    { numero: 50, frequencia: 318, percentual: 12.7 },
    { numero: 5, frequencia: 315, percentual: 12.6 },
    { numero: 41, frequencia: 312, percentual: 12.5 },
    { numero: 25, frequencia: 310, percentual: 12.4 },
    { numero: 3, frequencia: 308, percentual: 12.3 },
    { numero: 38, frequencia: 305, percentual: 12.2 },
    { numero: 17, frequencia: 302, percentual: 12.1 },
    { numero: 46, frequencia: 300, percentual: 12.0 },
    { numero: 22, frequencia: 298, percentual: 11.9 },
    { numero: 48, frequencia: 250, percentual: 10.0 },
    { numero: 30, frequencia: 248, percentual: 9.9 },
    { numero: 15, frequencia: 245, percentual: 9.8 },
    { numero: 7, frequencia: 242, percentual: 9.7 },
    { numero: 44, frequencia: 240, percentual: 9.6 },
  ],
  timemania: [
    { numero: 7, frequencia: 245, percentual: 15.3 },
    { numero: 27, frequencia: 242, percentual: 15.1 },
    { numero: 80, frequencia: 240, percentual: 15.0 },
    { numero: 13, frequencia: 238, percentual: 14.9 },
    { numero: 52, frequencia: 235, percentual: 14.7 },
    { numero: 36, frequencia: 232, percentual: 14.5 },
    { numero: 61, frequencia: 230, percentual: 14.4 },
    { numero: 4, frequencia: 228, percentual: 14.2 },
    { numero: 74, frequencia: 225, percentual: 14.1 },
    { numero: 19, frequencia: 222, percentual: 13.9 },
    { numero: 78, frequencia: 180, percentual: 11.2 },
    { numero: 45, frequencia: 178, percentual: 11.1 },
    { numero: 66, frequencia: 175, percentual: 10.9 },
    { numero: 33, frequencia: 172, percentual: 10.7 },
    { numero: 9, frequencia: 170, percentual: 10.6 },
  ],
};
