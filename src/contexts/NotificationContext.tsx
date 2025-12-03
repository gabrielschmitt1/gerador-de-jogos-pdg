import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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
  toggleNotificacoes: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICACOES_KEY = '@geradordejogospdg:notificacoes';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);

  // Carregar preferências do AsyncStorage
  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const notificacoes = await AsyncStorage.getItem(NOTIFICACOES_KEY);
        if (notificacoes !== null) {
          setNotificacoesAtivadas(JSON.parse(notificacoes));
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
        await Notifications.setNotificationChannelAsync('jogos', {
          name: 'Notificações de Jogos',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#13a4ec',
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
      console.log(`✅ Notificações ${novoValor ? 'ativadas' : 'desativadas'}`);
    } catch (error) {
      console.error('Erro ao alternar notificações:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificacoesAtivadas,
        toggleNotificacoes,
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
