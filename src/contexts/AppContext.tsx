import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Jogo,
  TipoLoteria,
  LOTERIAS,
  EstatisticaNumero,
  ESTATISTICAS_MOCK,
  ResultadoValidacao,
  QUADRANTES_MEGA_SENA,
} from '../types';

type AppContextType = {
  jogos: Jogo[];
  isLoading: boolean;
  gerarNumeros: (loteria: TipoLoteria, qtdNumeros?: number) => number[];
  gerarMultiplosJogos: (loteria: TipoLoteria, qtdJogos: number, qtdNumeros?: number) => number[][];
  validarJogoMegaSena: (numeros: number[]) => ResultadoValidacao;
  salvarJogo: (jogo: Omit<Jogo, 'id' | 'dataCriacao'>) => Promise<Jogo>;
  salvarMultiplosJogos: (jogos: Omit<Jogo, 'id' | 'dataCriacao'>[]) => Promise<Jogo[]>;
  excluirJogo: (id: string) => Promise<void>;
  toggleFavorito: (id: string) => Promise<void>;
  obterEstatisticas: (loteria: TipoLoteria) => {
    maisFrequentes: EstatisticaNumero[];
    menosFrequentes: EstatisticaNumero[];
  };
  limparDados: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Chave para o AsyncStorage
const STORAGE_KEY = '@geradordejogospdg:jogos';

// Jogos iniciais de exemplo
const jogosIniciais: Jogo[] = [
  {
    id: '1',
    loteria: 'mega-sena',
    numeros: [7, 14, 23, 35, 42, 58],
    qtdNumeros: 6,
    dataCriacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    favorito: true,
  },
  {
    id: '2',
    loteria: 'quina',
    numeros: [12, 28, 45, 67, 73],
    dataCriacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    favorito: false,
  },
  {
    id: '3',
    loteria: 'lotofacil',
    numeros: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24, 25, 2],
    dataCriacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    favorito: false,
  },
];

// ============================================
// FUNÇÕES DE VALIDAÇÃO MEGA-SENA
// ============================================

/**
 * Verifica equilíbrio par/ímpar
 * Para 6 números: aceita 3/3, 4/2 ou 2/4
 * Para 7 números: aceita 4/3, 3/4, 5/2 ou 2/5
 */
const verificarParImpar = (numeros: number[]): boolean => {
  const pares = numeros.filter((n) => n % 2 === 0).length;
  const impares = numeros.length - pares;

  if (numeros.length === 6) {
    // Aceitar 3/3, 4/2 ou 2/4
    return (
      (pares === 3 && impares === 3) ||
      (pares === 4 && impares === 2) ||
      (pares === 2 && impares === 4)
    );
  } else if (numeros.length === 7) {
    // Aceitar 4/3, 3/4, 5/2 ou 2/5
    return (
      (pares === 4 && impares === 3) ||
      (pares === 3 && impares === 4) ||
      (pares === 5 && impares === 2) ||
      (pares === 2 && impares === 5)
    );
  }

  return true;
};

/**
 * Verifica se há números altos suficientes (> 31)
 * Para 6 números: mínimo 2 números > 31
 * Para 7 números: mínimo 2-3 números > 31
 */
const verificarNumerosAltos = (numeros: number[]): boolean => {
  const numerosAltos = numeros.filter((n) => n > 31).length;

  if (numeros.length === 6) {
    return numerosAltos >= 2;
  } else if (numeros.length === 7) {
    return numerosAltos >= 2;
  }

  return true;
};

/**
 * Verifica distribuição por quadrantes
 * Deve ter pelo menos 1 número em cada quadrante (idealmente)
 * Para 6 números: pelo menos 3 quadrantes preenchidos
 * Para 7 números: pelo menos 3-4 quadrantes preenchidos
 */
const verificarQuadrantes = (numeros: number[]): boolean => {
  const quadrantesPreenchidos = new Set<string>();

  numeros.forEach((n) => {
    if (n >= QUADRANTES_MEGA_SENA.Q1.min && n <= QUADRANTES_MEGA_SENA.Q1.max) {
      quadrantesPreenchidos.add('Q1');
    } else if (n >= QUADRANTES_MEGA_SENA.Q2.min && n <= QUADRANTES_MEGA_SENA.Q2.max) {
      quadrantesPreenchidos.add('Q2');
    } else if (n >= QUADRANTES_MEGA_SENA.Q3.min && n <= QUADRANTES_MEGA_SENA.Q3.max) {
      quadrantesPreenchidos.add('Q3');
    } else if (n >= QUADRANTES_MEGA_SENA.Q4.min && n <= QUADRANTES_MEGA_SENA.Q4.max) {
      quadrantesPreenchidos.add('Q4');
    }
  });

  // Deve ter pelo menos 3 quadrantes preenchidos
  return quadrantesPreenchidos.size >= 3;
};

/**
 * Verifica se não há sequências longas (3+ números consecutivos)
 * Pares consecutivos são OK (ex: 10, 11)
 */
const verificarSequencias = (numeros: number[]): boolean => {
  const ordenados = [...numeros].sort((a, b) => a - b);

  let sequenciaAtual = 1;

  for (let i = 1; i < ordenados.length; i++) {
    if (ordenados[i] === ordenados[i - 1] + 1) {
      sequenciaAtual++;
      if (sequenciaAtual >= 3) {
        return false; // Sequência de 3+ encontrada
      }
    } else {
      sequenciaAtual = 1;
    }
  }

  return true;
};

/**
 * Valida um jogo completo da Mega-Sena
 */
const validarJogoMegaSena = (numeros: number[]): ResultadoValidacao => {
  const regras = {
    parImpar: verificarParImpar(numeros),
    numerosAltos: verificarNumerosAltos(numeros),
    quadrantes: verificarQuadrantes(numeros),
    sequencias: verificarSequencias(numeros),
  };

  return {
    valido: regras.parImpar && regras.numerosAltos && regras.quadrantes && regras.sequencias,
    regras,
  };
};

// ============================================
// PROVIDER
// ============================================

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarJogos();
  }, []);

  // Salvar dados sempre que houver mudança
  useEffect(() => {
    if (!isLoading) {
      salvarJogosStorage(jogos);
    }
  }, [jogos, isLoading]);

  const carregarJogos = async () => {
    try {
      setIsLoading(true);
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);

      if (dadosSalvos) {
        const jogosParsed = JSON.parse(dadosSalvos);
        // Converter strings de data de volta para objetos Date
        const jogosComDatas = jogosParsed.map((j: Jogo) => ({
          ...j,
          dataCriacao: new Date(j.dataCriacao),
        }));
        setJogos(jogosComDatas);
        console.log('📦 Jogos carregados do armazenamento local');
      } else {
        // Se não há dados salvos, usar dados iniciais
        setJogos(jogosIniciais);
        console.log('🆕 Iniciando com jogos de exemplo');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar jogos:', error);
      setJogos(jogosIniciais);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarJogosStorage = async (dados: Jogo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      console.log('💾 Jogos salvos localmente');
    } catch (error) {
      console.error('❌ Erro ao salvar jogos:', error);
    }
  };

  /**
   * Gera números aleatórios para uma loteria
   * Para Mega-Sena, aplica validação especial
   */
  const gerarNumeros = (loteria: TipoLoteria, qtdNumeros?: number): number[] => {
    const config = LOTERIAS[loteria];
    const quantidade = qtdNumeros || config.numeros;
    const maxTentativas = 1000;

    // Para Mega-Sena, aplicar regras especiais
    if (loteria === 'mega-sena' && config.temRegrasEspeciais) {
      for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
        const numeros = gerarNumerosAleatorios(config.min, config.max, quantidade);
        const validacao = validarJogoMegaSena(numeros);

        if (validacao.valido) {
          console.log(`✅ Jogo válido gerado após ${tentativa + 1} tentativa(s)`);
          return numeros;
        }
      }

      // Se não conseguiu após muitas tentativas, retorna o último gerado
      console.warn('⚠️ Não foi possível gerar jogo ideal, retornando melhor tentativa');
      return gerarNumerosAleatorios(config.min, config.max, quantidade);
    }

    // Para outras loterias, gerar normalmente
    return gerarNumerosAleatorios(config.min, config.max, quantidade);
  };

  /**
   * Gera números aleatórios sem validação
   */
  const gerarNumerosAleatorios = (min: number, max: number, quantidade: number): number[] => {
    const numeros: Set<number> = new Set();

    while (numeros.size < quantidade) {
      const numero = Math.floor(Math.random() * (max - min + 1)) + min;
      numeros.add(numero);
    }

    return Array.from(numeros).sort((a, b) => a - b);
  };

  /**
   * Gera múltiplos jogos de uma vez
   */
  const gerarMultiplosJogos = (
    loteria: TipoLoteria,
    qtdJogos: number,
    qtdNumeros?: number
  ): number[][] => {
    const jogosGerados: number[][] = [];
    const jogosUnicos = new Set<string>();

    // Limitar a 10 jogos
    const quantidade = Math.min(qtdJogos, 10);

    while (jogosGerados.length < quantidade) {
      const numeros = gerarNumeros(loteria, qtdNumeros);
      const chave = numeros.join(',');

      // Evitar jogos duplicados
      if (!jogosUnicos.has(chave)) {
        jogosUnicos.add(chave);
        jogosGerados.push(numeros);
      }
    }

    console.log(`🎲 ${jogosGerados.length} jogos gerados para ${LOTERIAS[loteria].nome}`);
    return jogosGerados;
  };

  // Salvar um novo jogo
  const salvarJogo = async (jogoData: Omit<Jogo, 'id' | 'dataCriacao'>): Promise<Jogo> => {
    const novoJogo: Jogo = {
      ...jogoData,
      id: Date.now().toString(),
      dataCriacao: new Date(),
    };

    setJogos((prev) => [novoJogo, ...prev]);
    console.log('✅ Jogo salvo:', novoJogo.id);
    return novoJogo;
  };

  // Salvar múltiplos jogos de uma vez
  const salvarMultiplosJogos = async (
    jogosData: Omit<Jogo, 'id' | 'dataCriacao'>[]
  ): Promise<Jogo[]> => {
    const novosJogos: Jogo[] = jogosData.map((jogoData, index) => ({
      ...jogoData,
      id: (Date.now() + index).toString(),
      dataCriacao: new Date(),
    }));

    setJogos((prev) => [...novosJogos, ...prev]);
    console.log(`✅ ${novosJogos.length} jogos salvos`);
    return novosJogos;
  };

  // Excluir um jogo
  const excluirJogo = async (id: string) => {
    setJogos((prev) => prev.filter((j) => j.id !== id));
    console.log('🗑️ Jogo excluído:', id);
  };

  // Alternar favorito
  const toggleFavorito = async (id: string) => {
    setJogos((prev) =>
      prev.map((j) => (j.id === id ? { ...j, favorito: !j.favorito } : j))
    );
  };

  // Obter estatísticas de uma loteria
  const obterEstatisticas = (loteria: TipoLoteria) => {
    const estatisticas = ESTATISTICAS_MOCK[loteria];

    // Ordenar por frequência (maior para menor)
    const ordenadas = [...estatisticas].sort((a, b) => b.frequencia - a.frequencia);

    return {
      maisFrequentes: ordenadas.slice(0, 10),
      menosFrequentes: ordenadas.slice(-10).reverse(),
    };
  };

  // Limpar todos os dados
  const limparDados = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setJogos([]);
      console.log('🗑️ Dados limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        jogos,
        isLoading,
        gerarNumeros,
        gerarMultiplosJogos,
        validarJogoMegaSena,
        salvarJogo,
        salvarMultiplosJogos,
        excluirJogo,
        toggleFavorito,
        obterEstatisticas,
        limparDados,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
