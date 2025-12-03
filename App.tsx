import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ThemeProvider, useThemeContext } from './src/contexts/ThemeContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import LoadingScreen from './src/components/LoadingScreen';

function AppContent() {
  const { theme, isDarkMode } = useThemeContext();
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <LoadingScreen />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </PaperProvider>
  );
}

function AppWithData() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppWithData />
        </NotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
