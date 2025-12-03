import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Jogo,
  TipoLoteria,
  LOTERIAS,
  EstatisticaNumero,
  ESTATISTICAS_MOCK,
} from '../types';

type AppContextType = {
  jogos: Jogo[];
  isLoading: boolean;
  gerarNumeros: (loteria: TipoLoteria) => number[];
  salvarJogo: (jogo: Omit<Jogo, 'id' | 'dataCriacao'>) => Promise<Jogo>;
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

  // Gerar números aleatórios para uma loteria específica
  const gerarNumeros = (loteria: TipoLoteria): number[] => {
    const config = LOTERIAS[loteria];
    const numeros: Set<number> = new Set();

    while (numeros.size < config.numeros) {
      const numero = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      numeros.add(numero);
    }

    // Ordenar os números
    return Array.from(numeros).sort((a, b) => a - b);
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
        salvarJogo,
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
