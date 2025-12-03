import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Agendamento, ResumoFinanceiro, PeriodoRelatorio } from '../types';

type AppContextType = {
  agendamentos: Agendamento[];
  isLoading: boolean;
  adicionarAgendamento: (agendamento: Omit<Agendamento, 'id'>) => Promise<Agendamento>;
  atualizarAgendamento: (id: string, agendamento: Partial<Agendamento>) => Promise<void>;
  cancelarAgendamento: (id: string) => Promise<void>;
  concluirAgendamento: (id: string) => Promise<void>;
  obterResumoFinanceiro: (periodo: PeriodoRelatorio) => ResumoFinanceiro;
  limparDados: () => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Chave para o AsyncStorage
const STORAGE_KEY = '@geradordejogospdg:agendamentos';

const agendamentosIniciais: Agendamento[] = [
  // Agendamentos Futuros (próximos)
  {
    id: '1',
    clienteNome: 'Sofia Almeida',
    clienteTelefone: '(11) 98765-4321',
    procedimento: 'Corte de Cabelo',
    data: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 dias
    hora: '14:00',
    valor: 80,
    custo: 20,
    tipoPagamento: 'PIX',
    observacoes: 'Cliente prefere corte curto e moderno.',
    status: 'proximo',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    clienteNome: 'Beatriz Costa',
    clienteTelefone: '(11) 98765-1234',
    procedimento: 'Manicure e Pedicure',
    data: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 dias
    hora: '10:00',
    valor: 75,
    custo: 15,
    tipoPagamento: 'Cartão de Crédito',
    status: 'proximo',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },

  // Agendamentos Concluídos (passados) - Última semana
  {
    id: '3',
    clienteNome: 'Mariana Silva',
    clienteTelefone: '(11) 98765-5678',
    procedimento: 'Design de Sobrancelha',
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // -2 dias
    hora: '16:00',
    valor: 35,
    custo: 5,
    tipoPagamento: 'PIX',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '4',
    clienteNome: 'Ana Paula Santos',
    clienteTelefone: '(11) 98765-9999',
    procedimento: 'Corte e Escova',
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // -5 dias
    hora: '11:00',
    valor: 120,
    custo: 30,
    tipoPagamento: 'Dinheiro',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
  },

  // Agendamentos Concluídos - Último mês
  {
    id: '5',
    clienteNome: 'Julia Ferreira',
    clienteTelefone: '(11) 98765-7777',
    procedimento: 'Coloração',
    data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // -15 dias
    hora: '14:00',
    valor: 200,
    custo: 50,
    tipoPagamento: 'Cartão de Débito',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '6',
    clienteNome: 'Camila Rodrigues',
    clienteTelefone: '(11) 98765-6666',
    procedimento: 'Hidratação',
    data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // -20 dias
    hora: '15:30',
    valor: 90,
    custo: 25,
    tipoPagamento: 'PIX',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },

  // Agendamentos Concluídos - Meses anteriores
  {
    id: '7',
    clienteNome: 'Larissa Mendes',
    clienteTelefone: '(11) 98765-5555',
    procedimento: 'Manicure',
    data: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // -45 dias
    hora: '10:00',
    valor: 50,
    custo: 10,
    tipoPagamento: 'Cartão de Crédito',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: '8',
    clienteNome: 'Fernanda Lima',
    clienteTelefone: '(11) 98765-4444',
    procedimento: 'Pedicure',
    data: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // -60 dias
    hora: '13:00',
    valor: 45,
    custo: 8,
    tipoPagamento: 'Dinheiro',
    status: 'passado',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarAgendamentos();
  }, []);

  // Salvar dados sempre que houver mudança
  useEffect(() => {
    if (!isLoading) {
      salvarAgendamentos(agendamentos);
    }
  }, [agendamentos, isLoading]);

  const carregarAgendamentos = async () => {
    try {
      setIsLoading(true);
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);

      if (dadosSalvos) {
        const agendamentosParsed = JSON.parse(dadosSalvos);
        // Converter strings de data de volta para objetos Date
        const agendamentosComDatas = agendamentosParsed.map((a: any) => ({
          ...a,
          data: new Date(a.data),
        }));
        setAgendamentos(agendamentosComDatas);
        console.log('📦 Dados carregados do armazenamento local');
      } else {
        // Se não há dados salvos, usar dados iniciais
        setAgendamentos(agendamentosIniciais);
        console.log('🆕 Iniciando com dados de exemplo');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setAgendamentos(agendamentosIniciais);
    } finally {
      setIsLoading(false);
    }
  };

  const salvarAgendamentos = async (dados: Agendamento[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      console.log('💾 Dados salvos localmente');
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
    }
  };

  const adicionarAgendamento = async (
    agendamento: Omit<Agendamento, 'id'>
  ): Promise<Agendamento> => {
    const novoAgendamento: Agendamento = {
      ...agendamento,
      id: Date.now().toString(),
    };
    setAgendamentos([...agendamentos, novoAgendamento]);
    return novoAgendamento;
  };

  const atualizarAgendamento = async (id: string, agendamentoAtualizado: Partial<Agendamento>) => {
    setAgendamentos(
      agendamentos.map((a) => (a.id === id ? { ...a, ...agendamentoAtualizado } : a))
    );
  };

  const cancelarAgendamento = async (id: string) => {
    setAgendamentos(agendamentos.filter((a) => a.id !== id));
  };

  const concluirAgendamento = async (id: string) => {
    setAgendamentos(agendamentos.map((a) => (a.id === id ? { ...a, status: 'passado' } : a)));
  };

  const limparDados = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setAgendamentos([]);
      console.log('🗑️ Dados limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
    }
  };

  const obterResumoFinanceiro = (periodo: PeriodoRelatorio): ResumoFinanceiro => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Definir data inicial baseada no período
    let dataInicio = new Date();

    switch (periodo) {
      case 'Semanal':
        // Últimos 7 dias
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'Mensal':
        // Último mês (30 dias)
        dataInicio.setDate(hoje.getDate() - 30);
        break;
      case 'Anual':
        // Último ano (365 dias)
        dataInicio.setDate(hoje.getDate() - 365);
        break;
    }

    dataInicio.setHours(0, 0, 0, 0);

    // Filtrar apenas agendamentos concluídos (passados) dentro do período
    const agendamentosFiltrados = agendamentos.filter((a) => {
      if (a.status !== 'passado') return false;

      const dataAgendamento = new Date(a.data);
      dataAgendamento.setHours(0, 0, 0, 0);

      return dataAgendamento >= dataInicio && dataAgendamento <= hoje;
    });

    // Calcular totais
    const totalVendido = agendamentosFiltrados.reduce((acc, a) => acc + a.valor, 0);
    const custoTotal = agendamentosFiltrados.reduce((acc, a) => acc + a.custo, 0);
    const lucroTotal = totalVendido - custoTotal;

    // Calcular vendas por tipo de pagamento
    const vendasPorPagamento: { [key: string]: number } = {};
    agendamentosFiltrados.forEach((a) => {
      vendasPorPagamento[a.tipoPagamento] = (vendasPorPagamento[a.tipoPagamento] || 0) + a.valor;
    });

    console.log(`📊 Relatório ${periodo}: ${agendamentosFiltrados.length} agendamentos concluídos`);

    return {
      lucroTotal,
      totalVendido,
      custoTotal,
      vendasPorPagamento,
    };
  };

  return (
    <AppContext.Provider
      value={{
        agendamentos,
        isLoading,
        adicionarAgendamento,
        atualizarAgendamento,
        cancelarAgendamento,
        concluirAgendamento,
        obterResumoFinanceiro,
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
