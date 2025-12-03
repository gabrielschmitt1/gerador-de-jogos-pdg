import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const customColors = {
  primary: '#13a4ec',
  secondary: '#64B5F6',
  tertiary: '#81C784',
  error: '#EF5350',
  background: '#f6f7f8',
  surface: '#ffffff',
  surfaceVariant: '#E3F2FD',
  onPrimary: '#ffffff',
  onSecondary: '#ffffff',
  onBackground: '#1a1a1a',
  onSurface: '#1a1a1a',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3b9cda',
    secondary: '#64B5F6',
    tertiary: '#81C784',
    error: '#EF5350',
    background: '#0d1b2a',
    surface: '#1b2838',
    surfaceVariant: '#253447',
    elevation: {
      level0: 'transparent',
      level1: '#1b2838',
      level2: '#253447',
      level3: '#2d3f54',
      level4: '#334861',
      level5: '#3a516d',
    },
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#e8eaed',
    onSurface: '#e8eaed',
    onSurfaceVariant: '#8b95a1',
    outline: '#3d4f63',
    outlineVariant: '#253447',
    surfaceDisabled: 'rgba(232, 234, 237, 0.12)',
    onSurfaceDisabled: 'rgba(232, 234, 237, 0.38)',
  },
  roundness: 12,
};

export const theme = lightTheme;

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
