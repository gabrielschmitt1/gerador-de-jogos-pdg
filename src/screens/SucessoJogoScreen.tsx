import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeContext } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SucessoJogoScreen() {
  const { theme } = useThemeContext();
  const navigation = useNavigation<NavigationProp>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleVerJogos = () => {
    navigation.navigate('MainTabs', { screen: 'MeusJogos' });
  };

  const handleGerarOutro = () => {
    navigation.navigate('MainTabs', { screen: 'GerarJogo' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '20' }]}>
          <MaterialCommunityIcons
            name="check-circle"
            size={100}
            color={theme.colors.primary}
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text
          variant="headlineMedium"
          style={[styles.titulo, { color: theme.colors.onBackground }]}
        >
          Jogo Salvo!
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitulo, { color: theme.colors.onSurfaceVariant }]}
        >
          Seu jogo foi salvo com sucesso. Boa sorte! 🍀
        </Text>
      </Animated.View>

      <Animated.View style={[styles.botoesContainer, { opacity: fadeAnim }]}>
        <Button
          mode="contained"
          onPress={handleVerJogos}
          icon="ticket-outline"
          style={styles.botaoPrimario}
          labelStyle={styles.botaoLabel}
          testID="btn-ver-jogos"
        >
          Ver Meus Jogos
        </Button>

        <Button
          mode="outlined"
          onPress={handleGerarOutro}
          icon="refresh"
          style={styles.botaoSecundario}
          labelStyle={styles.botaoLabelSecundario}
          testID="btn-gerar-outro"
        >
          Gerar Outro Jogo
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitulo: {
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  botoesContainer: {
    width: '100%',
    gap: 16,
  },
  botaoPrimario: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  botaoSecundario: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  botaoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  botaoLabelSecundario: {
    fontSize: 16,
  },
});

