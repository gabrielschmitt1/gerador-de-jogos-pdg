import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adaptNavigationTheme } from 'react-native-paper';
import { useThemeContext } from '../contexts/ThemeContext';

// Telas
import NovoAgendamentoScreen from '../screens/NovoAgendamentoScreen';
import MeusAgendamentosScreen from '../screens/MeusAgendamentosScreen';
import DetalhesAgendamentoScreen from '../screens/DetalhesAgendamentoScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import SucessoAgendamentoScreen from '../screens/SucessoAgendamentoScreen';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabsParamList };
  DetalhesAgendamento: { agendamentoId: string };
  SucessoAgendamento: undefined;
};

export type MainTabsParamList = {
  NovoAgendamento: undefined;
  MeusAgendamentos: undefined;
  Relatorios: undefined;
  Configuracoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createMaterialBottomTabNavigator<MainTabsParamList>();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

function MainTabs() {
  const { theme, isDarkMode } = useThemeContext();

  const navigationTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <Tab.Navigator
      initialRouteName="MeusAgendamentos"
      barStyle={{ backgroundColor: theme.colors.surface }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    >
      <Tab.Screen
        name="NovoAgendamento"
        component={NovoAgendamentoScreen}
        options={{
          tabBarLabel: 'Agendar',
          tabBarTestID: 'tab-novo-agendamento',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MeusAgendamentos"
        component={MeusAgendamentosScreen}
        options={{
          tabBarLabel: 'Meus Agendamentos',
          tabBarTestID: 'tab-meus-agendamentos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatorios"
        component={RelatoriosScreen}
        options={{
          tabBarLabel: 'Relatórios',
          tabBarTestID: 'tab-relatorios',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarTestID: 'tab-configuracoes',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { theme, isDarkMode } = useThemeContext();

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : LightTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : LightTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="DetalhesAgendamento"
          component={DetalhesAgendamentoScreen}
          options={{ headerShown: true, title: 'Detalhes do Agendamento' }}
        />
        <Stack.Screen
          name="SucessoAgendamento"
          component={SucessoAgendamentoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
