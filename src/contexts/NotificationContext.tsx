import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Agendamento } from '../types';

// Configurar como as notificações devem aparecer quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type NotificationContextType = {
  notificacoesAtivadas: boolean;
  lembreteAutomatico: boolean;
  toggleNotificacoes: () => Promise<void>;
  toggleLembreteAutomatico: () => Promise<void>;
  agendarNotificacao: (agendamento: Agendamento) => Promise<void>;
  cancelarNotificacao: (agendamentoId: string) => Promise<void>;
  cancelarTodasNotificacoes: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICACOES_KEY = '@geradordejogospdg:notificacoes';
const LEMBRETE_KEY = '@geradordejogospdg:lembrete';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);
  const [lembreteAutomatico, setLembreteAutomatico] = useState(true);

  // Carregar preferências do AsyncStorage
  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const [notificacoes, lembrete] = await Promise.all([
          AsyncStorage.getItem(NOTIFICACOES_KEY),
          AsyncStorage.getItem(LEMBRETE_KEY),
        ]);

        if (notificacoes !== null) {
          setNotificacoesAtivadas(JSON.parse(notificacoes));
        }
        if (lembrete !== null) {
          setLembreteAutomatico(JSON.parse(lembrete));
        }
      } catch (error) {
        console.error('Erro ao carregar preferências de notificação:', error);
      }
    };

    carregarPreferencias();
  }, []);

  // Solicitar permissões de notificação
  useEffect(() => {
    const solicitarPermissoes = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('agendamentos', {
          name: 'Lembretes de Agendamentos',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3b9cda',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permissão de notificação negada');
        setNotificacoesAtivadas(false);
        await AsyncStorage.setItem(NOTIFICACOES_KEY, JSON.stringify(false));
      }
    };

    solicitarPermissoes();
  }, []);

  const toggleNotificacoes = async () => {
    try {
      const novoValor = !notificacoesAtivadas;
      setNotificacoesAtivadas(novoValor);
      await AsyncStorage.setItem(NOTIFICACOES_KEY, JSON.stringify(novoValor));

      if (!novoValor) {
        // Se desativou, cancelar todas as notificações
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      console.log(`✅ Notificações ${novoValor ? 'ativadas' : 'desativadas'}`);
    } catch (error) {
      console.error('Erro ao alternar notificações:', error);
    }
  };

  const toggleLembreteAutomatico = async () => {
    try {
      const novoValor = !lembreteAutomatico;
      setLembreteAutomatico(novoValor);
      await AsyncStorage.setItem(LEMBRETE_KEY, JSON.stringify(novoValor));

      if (!novoValor) {
        // Se desativou lembretes, cancelar todas as notificações agendadas
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      console.log(`✅ Lembrete automático ${novoValor ? 'ativado' : 'desativado'}`);
    } catch (error) {
      console.error('Erro ao alternar lembrete automático:', error);
    }
  };

  const agendarNotificacao = async (agendamento: Agendamento) => {
    try {
      // Só agendar se notificações e lembretes estiverem ativados
      if (!notificacoesAtivadas || !lembreteAutomatico) {
        console.log('⚠️ Notificações desativadas, pulando agendamento');
        return;
      }

      // Só agendar para agendamentos futuros (status 'proximo')
      if (agendamento.status !== 'proximo') {
        console.log('⚠️ Agendamento não é futuro, pulando notificação');
        return;
      }

      // Calcular data/hora do agendamento
      // A data pode vir como Date ou string, precisamos lidar com ambos
      let dataAgendamento: Date;

      // Garantir que temos um Date válido
      const [hora, minuto] = agendamento.hora.split(':').map(Number);
      if (agendamento.data instanceof Date) {
        // Se já é um Date, usar diretamente
        dataAgendamento = new Date(agendamento.data);
        dataAgendamento.setHours(hora, minuto, 0, 0);
      } else {
        // Se é string no formato DD/MM/YYYY (fallback para dados legados)
        const dataStr = String(agendamento.data);
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        dataAgendamento = new Date(ano, mes - 1, dia, hora, minuto);
      }

      // Calcular 1 hora antes
      const dataNotificacao = new Date(dataAgendamento.getTime() - 60 * 60 * 1000);

      // Só agendar se a notificação for no futuro
      const agora = new Date();
      if (dataNotificacao <= agora) {
        console.log('⚠️ Horário de notificação já passou, pulando');
        return;
      }

      // Cancelar notificação anterior deste agendamento (se existir)
      await cancelarNotificacao(agendamento.id);

      // Agendar nova notificação
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Lembrete de Agendamento',
          body: `${agendamento.clienteNome} - ${agendamento.procedimento} às ${agendamento.hora}`,
          data: { agendamentoId: agendamento.id },
          sound: true,
        },
        trigger: {
          date: dataNotificacao,
          channelId: 'agendamentos',
        },
      });

      console.log(
        `✅ Notificação agendada: ${notificationId} para ${dataNotificacao.toLocaleString('pt-BR')}`
      );

      // Salvar ID da notificação associado ao agendamento
      await AsyncStorage.setItem(`@geradordejogospdg:notification:${agendamento.id}`, notificationId);
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  };

  const cancelarNotificacao = async (agendamentoId: string) => {
    try {
      const notificationId = await AsyncStorage.getItem(
        `@geradordejogospdg:notification:${agendamentoId}`
      );

      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        await AsyncStorage.removeItem(`@geradordejogospdg:notification:${agendamentoId}`);
        console.log(`✅ Notificação cancelada: ${notificationId}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  };

  const cancelarTodasNotificacoes = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ Todas as notificações canceladas');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificacoesAtivadas,
        lembreteAutomatico,
        toggleNotificacoes,
        toggleLembreteAutomatico,
        agendarNotificacao,
        cancelarNotificacao,
        cancelarTodasNotificacoes,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
