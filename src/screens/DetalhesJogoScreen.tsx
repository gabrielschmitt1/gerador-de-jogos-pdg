import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, Share } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  IconButton,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { LOTERIAS } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetalhesJogoRouteProp = RouteProp<RootStackParamList, 'DetalhesJogo'>;

export default function DetalhesJogoScreen() {
  const { theme } = useThemeContext();
  const { jogos, excluirJogo, toggleFavorito } = useApp();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetalhesJogoRouteProp>();

  const { jogoId } = route.params;

  const jogo = useMemo(
    () => jogos.find((j) => j.id === jogoId),
    [jogos, jogoId]
  );

  if (!jogo) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color={theme.colors.error}
        />
        <Text
          variant="titleLarge"
          style={[styles.errorTitulo, { color: theme.colors.error }]}
        >
          Jogo não encontrado
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  const config = LOTERIAS[jogo.loteria];

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir Jogo',
      `Deseja realmente excluir este jogo de ${config.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await excluirJogo(jogo.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleCompartilhar = async () => {
    const numerosFormatados = jogo.numeros
      .map((n) => n.toString().padStart(2, '0'))
      .join(' - ');

    const mensagem = `🍀 ${config.nome}\n\nMeus números da sorte:\n${numerosFormatados}\n\nGerado pelo app Gerador de Jogos PDG`;

    try {
      await Share.share({
        message: mensagem,
        title: `Jogo ${config.nome}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleToggleFavorito = () => {
    toggleFavorito(jogo.id);
  };

  const renderNumero = (numero: number, index: number) => (
    <Surface
      key={`${numero}-${index}`}
      style={[styles.numeroBola, { backgroundColor: config.cor }]}
      elevation={3}
    >
      <Text style={styles.numeroTexto}>
        {numero.toString().padStart(2, '0')}
      </Text>
    </Surface>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header com informações da loteria */}
      <Card style={[styles.headerCard, { backgroundColor: config.cor }]}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.loteriaIconWhite}>
                <MaterialCommunityIcons
                  name={config.icone as any}
                  size={40}
                  color={config.cor}
                />
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text variant="headlineSmall" style={styles.headerTitulo}>
                {config.nome}
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitulo}>
                {config.descricao}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Números do jogo */}
      <Card style={[styles.numerosCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.numerosHeader}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitulo, { color: theme.colors.onSurface }]}
            >
              Seus Números da Sorte
            </Text>
            <IconButton
              icon={jogo.favorito ? 'star' : 'star-outline'}
              iconColor={jogo.favorito ? '#FFD700' : theme.colors.onSurfaceVariant}
              size={24}
              onPress={handleToggleFavorito}
              testID="favorito-btn"
            />
          </View>

          <View style={styles.numerosContainer}>
            {jogo.numeros.map((num, idx) => renderNumero(num, idx))}
          </View>
        </Card.Content>
      </Card>

      {/* Informações do jogo */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitulo, { color: theme.colors.onSurface }]}
          >
            Informações
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.infoTexto}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Data de Criação
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface }}
                >
                  {formatarData(jogo.dataCriacao)}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="numeric"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.infoTexto}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Quantidade de Números
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface }}
                >
                  {jogo.numeros.length} números
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="sort-numeric-ascending"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.infoTexto}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Range
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurface }}
                >
                  {config.min} a {config.max}
                </Text>
              </View>
            </View>
          </View>

          {jogo.observacoes && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name="note-text"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <View style={styles.infoTexto}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Observações
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurface }}
                    >
                      {jogo.observacoes}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Botões de ação */}
      <View style={styles.botoesContainer}>
        <Button
          mode="contained"
          onPress={handleCompartilhar}
          icon="share-variant"
          style={[styles.botao, { backgroundColor: config.cor }]}
          labelStyle={styles.botaoLabel}
          testID="btn-compartilhar"
        >
          Compartilhar
        </Button>

        <Button
          mode="outlined"
          onPress={handleExcluir}
          icon="delete"
          style={styles.botaoExcluir}
          textColor={theme.colors.error}
          testID="btn-excluir"
        >
          Excluir Jogo
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorTitulo: {
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerLeft: {
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
  },
  loteriaIconWhite: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitulo: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitulo: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  numerosCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  numerosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitulo: {
    fontWeight: '600',
  },
  numerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  numeroBola: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoCard: {
    marginBottom: 24,
    borderRadius: 16,
  },
  infoRow: {
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoTexto: {
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  botoesContainer: {
    gap: 12,
  },
  botao: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  botaoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  botaoExcluir: {
    borderRadius: 12,
    borderColor: 'transparent',
  },
});

