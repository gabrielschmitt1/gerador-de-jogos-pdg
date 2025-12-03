import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  TouchableRipple,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { TipoLoteria, LOTERIAS, ConfigLoteria } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function GerarJogoScreen() {
  const { theme } = useThemeContext();
  const { gerarNumeros, salvarJogo } = useApp();
  const navigation = useNavigation<NavigationProp>();

  const [loteriaSelecionada, setLoteriaSelecionada] = useState<TipoLoteria | null>(null);
  const [numerosGerados, setNumerosGerados] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const loterias = Object.values(LOTERIAS);

  const handleSelecionarLoteria = (loteria: TipoLoteria) => {
    setLoteriaSelecionada(loteria);
    setNumerosGerados([]);
  };

  const handleGerarNumeros = () => {
    if (!loteriaSelecionada) return;

    setIsGenerating(true);

    // Simular animação de geração
    setTimeout(() => {
      const numeros = gerarNumeros(loteriaSelecionada);
      setNumerosGerados(numeros);
      setIsGenerating(false);
    }, 500);
  };

  const handleSalvarJogo = async () => {
    if (!loteriaSelecionada || numerosGerados.length === 0) return;

    await salvarJogo({
      loteria: loteriaSelecionada,
      numeros: numerosGerados,
      favorito: false,
    });

    navigation.navigate('SucessoJogo');
  };

  const handleVoltar = () => {
    setLoteriaSelecionada(null);
    setNumerosGerados([]);
  };

  const renderLoteriaCard = (config: ConfigLoteria) => (
    <TouchableRipple
      key={config.id}
      onPress={() => handleSelecionarLoteria(config.id)}
      style={styles.cardWrapper}
      testID={`loteria-card-${config.id}`}
    >
      <Surface style={[styles.loteriaCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <View style={[styles.loteriaIconContainer, { backgroundColor: config.cor + '20' }]}>
          <MaterialCommunityIcons
            name={config.icone as any}
            size={32}
            color={config.cor}
          />
        </View>
        <Text
          variant="titleMedium"
          style={[styles.loteriaNome, { color: theme.colors.onSurface }]}
        >
          {config.nome}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.loteriaDescricao, { color: theme.colors.onSurfaceVariant }]}
        >
          {config.descricao}
        </Text>
      </Surface>
    </TouchableRipple>
  );

  const renderNumero = (numero: number, index: number) => {
    const config = loteriaSelecionada ? LOTERIAS[loteriaSelecionada] : null;
    const cor = config?.cor || theme.colors.primary;

    return (
      <Surface
        key={`${numero}-${index}`}
        style={[styles.numeroBola, { backgroundColor: cor }]}
        elevation={3}
      >
        <Text style={styles.numeroTexto}>
          {numero.toString().padStart(2, '0')}
        </Text>
      </Surface>
    );
  };

  // Tela de seleção de loteria
  if (!loteriaSelecionada) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="clover"
            size={48}
            color={theme.colors.primary}
          />
          <Text
            variant="headlineMedium"
            style={[styles.titulo, { color: theme.colors.onBackground }]}
          >
            Gerar Jogo
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitulo, { color: theme.colors.onSurfaceVariant }]}
          >
            Escolha a loteria para gerar seus números da sorte
          </Text>
        </View>

        <View style={styles.loteriasGrid}>
          {loterias.map(renderLoteriaCard)}
        </View>
      </ScrollView>
    );
  }

  // Tela de geração de números
  const configSelecionada = LOTERIAS[loteriaSelecionada];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View style={[styles.loteriaIconContainer, { backgroundColor: configSelecionada.cor + '20' }]}>
          <MaterialCommunityIcons
            name={configSelecionada.icone as any}
            size={48}
            color={configSelecionada.cor}
          />
        </View>
        <Text
          variant="headlineMedium"
          style={[styles.titulo, { color: theme.colors.onBackground }]}
        >
          {configSelecionada.nome}
        </Text>
        <Chip
          style={[styles.chip, { backgroundColor: configSelecionada.cor + '30' }]}
          textStyle={{ color: configSelecionada.cor }}
        >
          {configSelecionada.numeros} números de {configSelecionada.min} a {configSelecionada.max}
        </Chip>
      </View>

      <Card style={[styles.resultadoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.resultadoTitulo, { color: theme.colors.onSurface }]}
          >
            {numerosGerados.length > 0 ? 'Seus números da sorte:' : 'Clique para gerar'}
          </Text>

          <View style={styles.numerosContainer}>
            {numerosGerados.length > 0 ? (
              numerosGerados.map((num, idx) => renderNumero(num, idx))
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="dice-multiple-outline"
                  size={64}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  Aguardando geração...
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.botoesContainer}>
        <Button
          mode="contained"
          onPress={handleGerarNumeros}
          loading={isGenerating}
          icon="refresh"
          style={[styles.botaoGerar, { backgroundColor: configSelecionada.cor }]}
          labelStyle={styles.botaoLabel}
          testID="button-gerar"
        >
          {numerosGerados.length > 0 ? 'Gerar Novamente' : 'Gerar Números'}
        </Button>

        {numerosGerados.length > 0 && (
          <Button
            mode="contained-tonal"
            onPress={handleSalvarJogo}
            icon="content-save"
            style={styles.botaoSalvar}
            labelStyle={styles.botaoLabel}
            testID="button-salvar"
          >
            Salvar Jogo
          </Button>
        )}

        <Button
          mode="text"
          onPress={handleVoltar}
          icon="arrow-left"
          style={styles.botaoVoltar}
          testID="button-voltar"
        >
          Escolher outra loteria
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  titulo: {
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitulo: {
    textAlign: 'center',
    marginTop: 8,
  },
  loteriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 16,
  },
  loteriaCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  loteriaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loteriaNome: {
    fontWeight: '600',
    textAlign: 'center',
  },
  loteriaDescricao: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 11,
  },
  chip: {
    marginTop: 8,
  },
  resultadoCard: {
    marginBottom: 24,
    borderRadius: 16,
  },
  resultadoTitulo: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  numerosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
    gap: 10,
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
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  botoesContainer: {
    gap: 12,
  },
  botaoGerar: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  botaoSalvar: {
    paddingVertical: 8,
    borderRadius: 12,
  },
  botaoVoltar: {
    marginTop: 8,
  },
  botaoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

