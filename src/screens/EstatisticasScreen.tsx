import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  Text,
  Card,
  SegmentedButtons,
  Surface,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { TipoLoteria, LOTERIAS, EstatisticaNumero } from '../types';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = width - 140;

export default function EstatisticasScreen() {
  const { theme } = useThemeContext();
  const { obterEstatisticas, jogos } = useApp();

  const [loteriaSelecionada, setLoteriaSelecionada] = useState<TipoLoteria>('mega-sena');
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'mais' | 'menos'>('mais');

  const config = LOTERIAS[loteriaSelecionada];
  const estatisticas = useMemo(
    () => obterEstatisticas(loteriaSelecionada),
    [loteriaSelecionada, obterEstatisticas]
  );

  // Contar jogos por loteria
  const jogosContagem = useMemo(() => {
    const contagem: Record<TipoLoteria, number> = {
      'mega-sena': 0,
      quina: 0,
      lotofacil: 0,
      lotomania: 0,
      'dupla-sena': 0,
      timemania: 0,
    };

    jogos.forEach((j) => {
      contagem[j.loteria]++;
    });

    return contagem;
  }, [jogos]);

  const dadosExibicao =
    tipoVisualizacao === 'mais'
      ? estatisticas.maisFrequentes
      : estatisticas.menosFrequentes;

  const maxFrequencia = Math.max(...dadosExibicao.map((e) => e.frequencia));

  const renderBarraEstatistica = (item: EstatisticaNumero, index: number) => {
    const largura = (item.frequencia / maxFrequencia) * BAR_MAX_WIDTH;

    return (
      <View key={item.numero} style={styles.barraContainer}>
        <Surface
          style={[styles.numeroBola, { backgroundColor: config.cor }]}
          elevation={2}
        >
          <Text style={styles.numeroTexto}>
            {item.numero.toString().padStart(2, '0')}
          </Text>
        </Surface>

        <View style={styles.barraWrapper}>
          <View
            style={[
              styles.barra,
              {
                width: largura,
                backgroundColor: config.cor + (tipoVisualizacao === 'mais' ? 'CC' : '80'),
              },
            ]}
          />
          <Text style={[styles.barraTexto, { color: theme.colors.onSurface }]}>
            {item.frequencia}x ({item.percentual.toFixed(1)}%)
          </Text>
        </View>
      </View>
    );
  };

  const renderLoteriaSelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.seletorContainer}
    >
      {Object.values(LOTERIAS).map((lot) => (
        <Chip
          key={lot.id}
          selected={loteriaSelecionada === lot.id}
          onPress={() => setLoteriaSelecionada(lot.id)}
          style={[
            styles.loteriaChip,
            loteriaSelecionada === lot.id && { backgroundColor: lot.cor + '30' },
          ]}
          textStyle={{
            color: loteriaSelecionada === lot.id ? lot.cor : theme.colors.onSurfaceVariant,
            fontWeight: loteriaSelecionada === lot.id ? '600' : '400',
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={lot.icone as any}
              size={18}
              color={loteriaSelecionada === lot.id ? lot.cor : theme.colors.onSurfaceVariant}
            />
          )}
          testID={`loteria-chip-${lot.id}`}
        >
          {lot.nome}
        </Chip>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <Text
          variant="headlineMedium"
          style={[styles.titulo, { color: theme.colors.onBackground }]}
        >
          Estatísticas
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Números mais e menos sorteados
        </Text>
      </View>

      {renderLoteriaSelector()}

      {/* Card com info da loteria selecionada */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <View style={[styles.loteriaIcon, { backgroundColor: config.cor + '20' }]}>
              <MaterialCommunityIcons
                name={config.icone as any}
                size={32}
                color={config.cor}
              />
            </View>
            <View style={styles.infoTexto}>
              <Text
                variant="titleLarge"
                style={[styles.loteriaNome, { color: theme.colors.onSurface }]}
              >
                {config.nome}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {config.descricao}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text
                variant="headlineSmall"
                style={[styles.statValor, { color: config.cor }]}
              >
                {jogosContagem[loteriaSelecionada]}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Jogos Gerados
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text
                variant="headlineSmall"
                style={[styles.statValor, { color: config.cor }]}
              >
                {config.numeros}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Números por Jogo
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text
                variant="headlineSmall"
                style={[styles.statValor, { color: config.cor }]}
              >
                {config.min}-{config.max}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Range
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Toggle Mais/Menos frequentes */}
      <SegmentedButtons
        value={tipoVisualizacao}
        onValueChange={(value) => setTipoVisualizacao(value as 'mais' | 'menos')}
        buttons={[
          {
            value: 'mais',
            label: '🔥 Mais Sorteados',
            testID: 'btn-mais-sorteados',
          },
          {
            value: 'menos',
            label: '❄️ Menos Sorteados',
            testID: 'btn-menos-sorteados',
          },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Lista de estatísticas */}
      <Card style={[styles.estatisticasCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[styles.cardTitulo, { color: theme.colors.onSurface }]}
          >
            {tipoVisualizacao === 'mais'
              ? 'Top 10 - Mais Sorteados'
              : 'Top 10 - Menos Sorteados'}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.cardSubtitulo, { color: theme.colors.onSurfaceVariant }]}
          >
            Baseado em dados históricos de sorteios
          </Text>

          <View style={styles.estatisticasLista}>
            {dadosExibicao.map((item, index) => renderBarraEstatistica(item, index))}
          </View>
        </Card.Content>
      </Card>

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          variant="bodySmall"
          style={[styles.disclaimerTexto, { color: theme.colors.onSurfaceVariant }]}
        >
          Estatísticas baseadas em dados históricos. Resultados passados não garantem
          sorteios futuros. Jogue com responsabilidade.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titulo: {
    fontWeight: 'bold',
  },
  seletorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  loteriaChip: {
    marginRight: 8,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loteriaIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTexto: {
    marginLeft: 16,
    flex: 1,
  },
  loteriaNome: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValor: {
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  estatisticasCard: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  cardTitulo: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitulo: {
    marginBottom: 16,
  },
  estatisticasLista: {
    gap: 12,
  },
  barraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numeroBola: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  barraWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barra: {
    height: 24,
    borderRadius: 12,
  },
  barraTexto: {
    fontSize: 12,
    fontWeight: '500',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 8,
  },
  disclaimerTexto: {
    flex: 1,
    lineHeight: 18,
  },
});

