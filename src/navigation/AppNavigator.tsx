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
import GerarJogoScreen from '../screens/GerarJogoScreen';
import MeusJogosScreen from '../screens/MeusJogosScreen';
import DetalhesJogoScreen from '../screens/DetalhesJogoScreen';
import EstatisticasScreen from '../screens/EstatisticasScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import SucessoJogoScreen from '../screens/SucessoJogoScreen';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabsParamList };
  DetalhesJogo: { jogoId: string };
  SucessoJogo: undefined;
};

export type MainTabsParamList = {
  GerarJogo: undefined;
  MeusJogos: undefined;
  Estatisticas: undefined;
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

  return (
    <Tab.Navigator
      initialRouteName="GerarJogo"
      barStyle={{ backgroundColor: theme.colors.surface }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    >
      <Tab.Screen
        name="GerarJogo"
        component={GerarJogoScreen}
        options={{
          tabBarLabel: 'Gerar',
          tabBarTestID: 'tab-gerar-jogo',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clover" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MeusJogos"
        component={MeusJogosScreen}
        options={{
          tabBarLabel: 'Meus Jogos',
          tabBarTestID: 'tab-meus-jogos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ticket-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Estatisticas"
        component={EstatisticasScreen}
        options={{
          tabBarLabel: 'Estatísticas',
          tabBarTestID: 'tab-estatisticas',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={ConfiguracoesScreen}
        options={{
          tabBarLabel: 'Config',
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
          name="DetalhesJogo"
          component={DetalhesJogoScreen}
          options={{
            headerShown: true,
            title: 'Detalhes do Jogo',
            headerTintColor: theme.colors.primary,
          }}
        />
        <Stack.Screen
          name="SucessoJogo"
          component={SucessoJogoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
