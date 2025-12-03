import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SucessoAgendamentoScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleVerAgendamentos = () => {
    navigation.navigate('MainTabs', { screen: 'MeusAgendamentos' });
  };

  const handleNovoAgendamento = () => {
    navigation.navigate('MainTabs', { screen: 'NovoAgendamento' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Ícone de sucesso com círculo */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <MaterialCommunityIcons name="check-circle" size={80} color={theme.colors.primary} />
        </View>

        {/* Mensagem de sucesso */}
        <Text
          testID="text-success-title"
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Agendamento Criado!
        </Text>

        <Text
          testID="text-success-message"
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Seu agendamento foi criado com sucesso e a notificação foi agendada.
        </Text>

        {/* Informação adicional */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons
            name="bell-check-outline"
            size={24}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <Text
            variant="bodyMedium"
            style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
          >
            Você receberá uma notificação antes do horário do agendamento
          </Text>
        </View>
      </Animated.View>

      {/* Botões de ação */}
      <View style={styles.buttonsContainer}>
        <Button
          testID="button-ver-agendamentos"
          mode="contained"
          onPress={handleVerAgendamentos}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="clipboard-list-outline"
        >
          Ver Agendamentos
        </Button>

        <Button
          testID="button-novo-agendamento"
          mode="outlined"
          onPress={handleNovoAgendamento}
          style={styles.secondaryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="calendar-plus"
        >
          Novo Agendamento
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    width: '100%',
    maxWidth: 400,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 12,
    paddingBottom: 16,
  },
  primaryButton: {
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
