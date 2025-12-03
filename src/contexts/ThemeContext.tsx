import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

type ThemeContextType = {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  theme: typeof lightTheme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@geradordejogospdg:theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferência salva
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  // Determinar se deve usar tema escuro
  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  // Selecionar tema apropriado
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return null; // Ou um componente de loading
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        themeMode,
        theme,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
