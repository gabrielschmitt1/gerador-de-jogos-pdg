import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Button,
  Surface,
  TouchableRipple,
  Chip,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { TipoLoteria, LOTERIAS, ConfigLoteria } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function GerarJogoScreen() {
  const { theme } = useThemeContext();
  const { gerarNumeros, gerarMultiplosJogos, salvarJogo, salvarMultiplosJogos, validarJogoMegaSena } = useApp();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const [loteriaSelecionada, setLoteriaSelecionada] = useState<TipoLoteria | null>(null);
  const [qtdNumeros, setQtdNumeros] = useState<number>(6);
  const [qtdJogos, setQtdJogos] = useState<number>(1);
  const [jogosGerados, setJogosGerados] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const loterias = Object.values(LOTERIAS);

  // Calcular número de colunas baseado na largura da tela
  const getNumColumns = () => {
    if (width < 400) return 1;
    if (width < 600) return 2;
    if (width < 900) return 3;
    return 4;
  };

  const numColumns = getNumColumns();
  const padding = 16;
  const gap = 12;
  const cardWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  const handleSelecionarLoteria = (loteria: TipoLoteria) => {
    setLoteriaSelecionada(loteria);
    setJogosGerados([]);
    // Resetar quantidade de números para o padrão da loteria
    const config = LOTERIAS[loteria];
    setQtdNumeros(config.numeros);
  };

  const handleGerarNumeros = () => {
    if (!loteriaSelecionada) return;

    setIsGenerating(true);

    // Simular animação de geração
    setTimeout(() => {
      if (qtdJogos === 1) {
        const numeros = gerarNumeros(loteriaSelecionada, qtdNumeros);
        setJogosGerados([numeros]);
      } else {
        const jogos = gerarMultiplosJogos(loteriaSelecionada, qtdJogos, qtdNumeros);
        setJogosGerados(jogos);
      }
      setIsGenerating(false);
    }, 500);
  };

  const handleSalvarJogos = async () => {
    if (!loteriaSelecionada || jogosGerados.length === 0) return;

    if (jogosGerados.length === 1) {
      await salvarJogo({
        loteria: loteriaSelecionada,
        numeros: jogosGerados[0],
        qtdNumeros: qtdNumeros,
        favorito: false,
      });
    } else {
      const jogosParaSalvar = jogosGerados.map((numeros) => ({
        loteria: loteriaSelecionada,
        numeros,
        qtdNumeros: qtdNumeros,
        favorito: false,
      }));
      await salvarMultiplosJogos(jogosParaSalvar);
    }

    navigation.navigate('SucessoJogo');
  };

  const handleVoltar = () => {
    setLoteriaSelecionada(null);
    setJogosGerados([]);
    setQtdJogos(1);
  };

  const renderLoteriaCard = (config: ConfigLoteria, index: number) => {
    return (
      <TouchableRipple
        key={config.id}
        onPress={() => handleSelecionarLoteria(config.id)}
        style={[
          styles.cardWrapper,
          { 
            width: cardWidth,
            maxWidth: 200,
            marginBottom: gap,
          },
        ]}
        testID={`loteria-card-${config.id}`}
      >
        <Surface style={[styles.loteriaCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={[styles.loteriaIconContainer, { backgroundColor: config.cor + '20' }]}>
            <MaterialCommunityIcons
              name={config.icone as any}
              size={width < 400 ? 28 : 32}
              color={config.cor}
            />
          </View>
          <Text
            variant="titleMedium"
            style={[styles.loteriaNome, { color: theme.colors.onSurface }]}
            numberOfLines={1}
          >
            {config.nome}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.loteriaDescricao, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={2}
          >
            {config.descricao}
          </Text>
          {config.temRegrasEspeciais && (
            <Chip
              style={[styles.chipRegras, { backgroundColor: config.cor + '20' }]}
              textStyle={{ color: config.cor, fontSize: 10 }}
              compact
            >
              Regras inteligentes
            </Chip>
          )}
        </Surface>
      </TouchableRipple>
    );
  };

  const renderNumero = (numero: number, index: number, cor: string) => {
    const bolaSize = width < 400 ? 36 : 44;

    return (
      <Surface
        key={`${numero}-${index}`}
        style={[
          styles.numeroBola,
          { 
            backgroundColor: cor,
            width: bolaSize,
            height: bolaSize,
            borderRadius: bolaSize / 2,
          },
        ]}
        elevation={3}
      >
        <Text style={[styles.numeroTexto, { fontSize: width < 400 ? 12 : 14 }]}>
          {numero.toString().padStart(2, '0')}
        </Text>
      </Surface>
    );
  };

  const renderJogoCard = (numeros: number[], jogoIndex: number) => {
    const config = loteriaSelecionada ? LOTERIAS[loteriaSelecionada] : null;
    const cor = config?.cor || theme.colors.primary;
    const validacao = loteriaSelecionada === 'mega-sena' ? validarJogoMegaSena(numeros) : null;

    return (
      <Card 
        key={jogoIndex} 
        style={[styles.jogoCard, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content>
          <View style={styles.jogoHeader}>
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
              Jogo {jogoIndex + 1}
            </Text>
            {validacao && (
              <Chip
                style={[
                  styles.validacaoChip,
                  { backgroundColor: validacao.valido ? '#4CAF50' + '20' : '#FF9800' + '20' },
                ]}
                textStyle={{ 
                  color: validacao.valido ? '#4CAF50' : '#FF9800',
                  fontSize: 10,
                }}
                compact
              >
                {validacao.valido ? '✓ Validado' : '⚠ Parcial'}
              </Chip>
            )}
          </View>
          <View style={styles.numerosRow}>
            {numeros.map((num, idx) => renderNumero(num, idx, cor))}
          </View>
        </Card.Content>
      </Card>
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
            size={width < 400 ? 40 : 48}
            color={theme.colors.primary}
          />
          <Text
            variant={width < 400 ? 'titleLarge' : 'headlineMedium'}
            style={[styles.titulo, { color: theme.colors.onBackground }]}
          >
            Gerar Jogo
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitulo, { color: theme.colors.onSurfaceVariant }]}
          >
            Escolha a loteria para gerar seus números da sorte
          </Text>
        </View>

        <View style={[styles.loteriasGrid, { gap: gap }]}>
          {loterias.map((lot, index) => renderLoteriaCard(lot, index))}
        </View>
      </ScrollView>
    );
  }

  // Tela de geração de números
  const configSelecionada = LOTERIAS[loteriaSelecionada];
  const temOpcoesNumeros = configSelecionada.numerosOpcoes && configSelecionada.numerosOpcoes.length > 1;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.header}>
        <View style={[
          styles.loteriaIconContainer,
          { 
            backgroundColor: configSelecionada.cor + '20',
            width: width < 400 ? 56 : 64,
            height: width < 400 ? 56 : 64,
            borderRadius: width < 400 ? 28 : 32,
          },
        ]}>
          <MaterialCommunityIcons
            name={configSelecionada.icone as any}
            size={width < 400 ? 36 : 48}
            color={configSelecionada.cor}
          />
        </View>
        <Text
          variant={width < 400 ? 'titleLarge' : 'headlineMedium'}
          style={[styles.titulo, { color: theme.colors.onBackground }]}
        >
          {configSelecionada.nome}
        </Text>
        {configSelecionada.temRegrasEspeciais && (
          <Chip
            style={[styles.chip, { backgroundColor: configSelecionada.cor + '30' }]}
            textStyle={{ color: configSelecionada.cor, fontSize: width < 400 ? 11 : 12 }}
          >
            🎯 Regras inteligentes ativas
          </Chip>
        )}
      </View>

      {/* Seletor de quantidade de números (apenas para loterias com opções) */}
      {temOpcoesNumeros && (
        <Card style={[styles.configuracaoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleSmall" style={[styles.seletorTitulo, { color: theme.colors.onSurface }]}>
              Quantidade de números:
            </Text>
            <SegmentedButtons
              value={qtdNumeros.toString()}
              onValueChange={(value) => setQtdNumeros(parseInt(value))}
              buttons={configSelecionada.numerosOpcoes!.map((num) => ({
                value: num.toString(),
                label: `${num} números`,
                style: { 
                  backgroundColor: qtdNumeros === num 
                    ? configSelecionada.cor + '30' 
                    : 'transparent' 
                },
              }))}
              style={styles.segmentedButtons}
            />
            <Text 
              variant="bodySmall" 
              style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
            >
              {qtdNumeros === 6 
                ? 'Jogo tradicional com 6 números' 
                : 'Jogo ampliado com 7 números (mais chances)'}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Seletor de quantidade de jogos */}
      <Card style={[styles.configuracaoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleSmall" style={[styles.seletorTitulo, { color: theme.colors.onSurface }]}>
            Quantidade de jogos: <Text style={{ color: configSelecionada.cor, fontWeight: 'bold' }}>{qtdJogos}</Text>
          </Text>
          <View style={styles.qtdJogosContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableRipple
                key={num}
                onPress={() => setQtdJogos(num)}
                style={[
                  styles.qtdJogoButton,
                  {
                    backgroundColor: qtdJogos === num 
                      ? configSelecionada.cor 
                      : theme.colors.surfaceVariant,
                    borderColor: configSelecionada.cor,
                  },
                ]}
              >
                <Text style={[
                  styles.qtdJogoText,
                  { color: qtdJogos === num ? '#FFFFFF' : theme.colors.onSurfaceVariant },
                ]}>
                  {num}
                </Text>
              </TouchableRipple>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Regras aplicadas (apenas para Mega-Sena) */}
      {configSelecionada.temRegrasEspeciais && (
        <Card style={[styles.regrasCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleSmall" style={[styles.regrasTitulo, { color: theme.colors.onSurface }]}>
              📋 Regras aplicadas:
            </Text>
            <View style={styles.regrasLista}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                • Equilíbrio par/ímpar ({qtdNumeros === 6 ? '3/3, 4/2 ou 2/4' : '4/3, 3/4, 5/2 ou 2/5'})
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                • Mínimo 2 números {'>'} 31
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                • Distribuição em pelo menos 3 quadrantes
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                • Sem sequências de 3+ números consecutivos
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      <Divider style={styles.divider} />

      {/* Botão de gerar */}
      <Button
        mode="contained"
        onPress={handleGerarNumeros}
        loading={isGenerating}
        icon="dice-multiple"
        style={[styles.botaoGerar, { backgroundColor: configSelecionada.cor }]}
        labelStyle={styles.botaoLabel}
        testID="button-gerar"
      >
        {jogosGerados.length > 0 
          ? `Gerar ${qtdJogos} Novo${qtdJogos > 1 ? 's' : ''} Jogo${qtdJogos > 1 ? 's' : ''}`
          : `Gerar ${qtdJogos} Jogo${qtdJogos > 1 ? 's' : ''}`}
      </Button>

      {/* Resultados */}
      {jogosGerados.length > 0 && (
        <>
          <Text 
            variant="titleMedium" 
            style={[styles.resultadoTitulo, { color: theme.colors.onBackground }]}
          >
            🎲 {jogosGerados.length} jogo{jogosGerados.length > 1 ? 's' : ''} gerado{jogosGerados.length > 1 ? 's' : ''}:
          </Text>
          
          {jogosGerados.map((numeros, index) => renderJogoCard(numeros, index))}

          <Button
            mode="contained-tonal"
            onPress={handleSalvarJogos}
            icon="content-save-all"
            style={styles.botaoSalvar}
            labelStyle={styles.botaoLabel}
            testID="button-salvar"
          >
            {jogosGerados.length === 1 ? 'Salvar Jogo' : `Salvar Todos (${jogosGerados.length})`}
          </Button>
        </>
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
    paddingHorizontal: 16,
  },
  loteriasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    borderRadius: 16,
    marginHorizontal: 6,
  },
  loteriaCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
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
  chipRegras: {
    marginTop: 8,
  },
  chip: {
    marginTop: 8,
  },
  configuracaoCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  seletorTitulo: {
    marginBottom: 12,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 4,
  },
  qtdJogosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  qtdJogoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  qtdJogoText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  regrasCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  regrasTitulo: {
    fontWeight: '600',
    marginBottom: 8,
  },
  regrasLista: {
    gap: 4,
  },
  divider: {
    marginVertical: 16,
  },
  resultadoTitulo: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  jogoCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  jogoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  validacaoChip: {
    height: 24,
  },
  numerosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  numeroBola: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    marginTop: 16,
  },
  botaoVoltar: {
    marginTop: 16,
  },
  botaoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
