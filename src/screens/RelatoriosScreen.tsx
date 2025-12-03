import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Text, Card, useTheme, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { PeriodoRelatorio } from '../types';

export default function RelatoriosScreen() {
  const theme = useTheme();
  const { obterResumoFinanceiro } = useApp();
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>('Mensal');

  const resumo = obterResumoFinanceiro(periodo);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calcularPorcentagem = (valor: number, total: number) => {
    if (total === 0) return 0;
    return (valor / total) * 100;
  };

  const tiposPagamento = Object.entries(resumo.vendasPorPagamento).sort(([, a], [, b]) => b - a);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Relatórios" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Resumo
        </Text>

        <View style={styles.periodSelector}>
          <SegmentedButtons
            value={periodo}
            onValueChange={(value) => setPeriodo(value as PeriodoRelatorio)}
            buttons={[
              { value: 'Semanal', label: 'Semanal', testID: 'tab-semanal' },
              { value: 'Mensal', label: 'Mensal', testID: 'tab-mensal' },
              { value: 'Anual', label: 'Anual', testID: 'tab-anual' },
            ]}
          />
        </View>

        <View style={styles.cardsGrid}>
          <Card testID="card-lucro-liquido" style={[styles.metricCard, styles.primaryCard]}>
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}
              >
                Lucro Total
              </Text>
              <Text variant="headlineMedium" style={styles.metricValue}>
                {formatarValor(resumo.lucroTotal)}
              </Text>
            </Card.Content>
          </Card>

          <Card testID="card-receita-total" style={[styles.metricCard, styles.primaryCard]}>
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}
              >
                Total Vendido
              </Text>
              <Text variant="headlineMedium" style={styles.metricValue}>
                {formatarValor(resumo.totalVendido)}
              </Text>
            </Card.Content>
          </Card>

          <Card
            testID="card-custo-total"
            style={[styles.metricCard, styles.primaryCard, styles.fullWidth]}
          >
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={[styles.metricLabel, { color: theme.colors.onSurfaceVariant }]}
              >
                Custo Total
              </Text>
              <Text variant="headlineMedium" style={styles.metricValue}>
                {formatarValor(resumo.custoTotal)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Vendas por Tipo de Pagamento
        </Text>

        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <View>
                <Text
                  variant="bodyMedium"
                  style={[styles.chartLabel, { color: theme.colors.onSurfaceVariant }]}
                >
                  Vendas por Pagamento
                </Text>
                <Text variant="headlineMedium" style={styles.chartValue}>
                  {formatarValor(resumo.totalVendido)}
                </Text>
              </View>
              <View style={styles.trendBadge}>
                <MaterialCommunityIcons name="trending-up" size={20} color="#4CAF50" />
                <Text style={styles.trendText}>+15%</Text>
              </View>
            </View>

            <View style={styles.chartBars}>
              {tiposPagamento.map(([tipo, valor]) => {
                const porcentagem = calcularPorcentagem(valor, resumo.totalVendido);
                return (
                  <View key={tipo} style={styles.barContainer}>
                    <View style={styles.barHeader}>
                      <Text
                        variant="bodyMedium"
                        style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}
                      >
                        {tipo}
                      </Text>
                      <Text
                        variant="bodyMedium"
                        style={[styles.barValue, { color: theme.colors.onSurfaceVariant }]}
                      >
                        {formatarValor(valor)}
                      </Text>
                    </View>
                    <View
                      style={[styles.barTrack, { backgroundColor: theme.colors.surfaceVariant }]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${porcentagem}%`,
                            backgroundColor: theme.colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodSelector: {
    marginBottom: 24,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    elevation: 2,
  },
  primaryCard: {},
  fullWidth: {
    minWidth: '100%',
  },
  metricLabel: {
    marginBottom: 4,
  },
  metricValue: {
    fontWeight: 'bold',
  },
  chartCard: {
    elevation: 2,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartLabel: {
    marginBottom: 4,
  },
  chartValue: {
    fontWeight: 'bold',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chartBars: {
    gap: 16,
  },
  barContainer: {
    gap: 8,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {},
  barValue: {},
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  bottomPadding: {
    height: 24,
  },
});
