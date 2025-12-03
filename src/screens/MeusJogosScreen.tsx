import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Chip,
  IconButton,
  Menu,
  Divider,
  Surface,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { Jogo, TipoLoteria, LOTERIAS } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FILTROS: (TipoLoteria | 'todos' | 'favoritos')[] = [
  'todos',
  'favoritos',
  'mega-sena',
  'quina',
  'lotofacil',
  'lotomania',
  'dupla-sena',
  'timemania',
];

export default function MeusJogosScreen() {
  const { theme } = useThemeContext();
  const { jogos, excluirJogo, toggleFavorito } = useApp();
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<TipoLoteria | 'todos' | 'favoritos'>('todos');
  const [menuVisivel, setMenuVisivel] = useState<string | null>(null);

  // Filtrar jogos
  const jogosFiltrados = useMemo(() => {
    let resultado = [...jogos];

    // Filtro por tipo de loteria ou favoritos
    if (filtroAtivo === 'favoritos') {
      resultado = resultado.filter((j) => j.favorito);
    } else if (filtroAtivo !== 'todos') {
      resultado = resultado.filter((j) => j.loteria === filtroAtivo);
    }

    // Filtro por busca (números)
    if (searchQuery) {
      resultado = resultado.filter((j) =>
        j.numeros.some((n) => n.toString().includes(searchQuery))
      );
    }

    // Ordenar por data (mais recente primeiro)
    resultado.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());

    return resultado;
  }, [jogos, filtroAtivo, searchQuery]);

  const handleVerDetalhes = (jogo: Jogo) => {
    setMenuVisivel(null);
    navigation.navigate('DetalhesJogo', { jogoId: jogo.id });
  };

  const handleExcluir = (jogo: Jogo) => {
    setMenuVisivel(null);
    Alert.alert(
      'Excluir Jogo',
      `Deseja realmente excluir este jogo de ${LOTERIAS[jogo.loteria].nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirJogo(jogo.id),
        },
      ]
    );
  };

  const handleToggleFavorito = (jogo: Jogo) => {
    toggleFavorito(jogo.id);
  };

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNomeFiltro = (filtro: TipoLoteria | 'todos' | 'favoritos') => {
    if (filtro === 'todos') return 'Todos';
    if (filtro === 'favoritos') return '⭐ Favoritos';
    return LOTERIAS[filtro].nome;
  };

  const renderNumeros = (numeros: number[], cor: string) => {
    // Mostrar no máximo 8 números na lista, com indicador de "mais"
    const numerosVisiveis = numeros.slice(0, 8);
    const temMais = numeros.length > 8;

    return (
      <View style={styles.numerosRow}>
        {numerosVisiveis.map((num, idx) => (
          <Surface
            key={`${num}-${idx}`}
            style={[styles.numeroBolaPequena, { backgroundColor: cor }]}
            elevation={1}
          >
            <Text style={styles.numeroTextoPequeno}>
              {num.toString().padStart(2, '0')}
            </Text>
          </Surface>
        ))}
        {temMais && (
          <Text style={[styles.maisNumeros, { color: theme.colors.onSurfaceVariant }]}>
            +{numeros.length - 8}
          </Text>
        )}
      </View>
    );
  };

  const renderJogoCard = ({ item: jogo }: { item: Jogo }) => {
    const config = LOTERIAS[jogo.loteria];

    return (
      <Card
        style={[styles.jogoCard, { backgroundColor: theme.colors.surface }]}
        onPress={() => handleVerDetalhes(jogo)}
        testID={`jogo-card-${jogo.id}`}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.loteriaInfo}>
              <View style={[styles.loteriaIconSmall, { backgroundColor: config.cor + '20' }]}>
                <MaterialCommunityIcons
                  name={config.icone as any}
                  size={20}
                  color={config.cor}
                />
              </View>
              <View>
                <Text
                  variant="titleMedium"
                  style={[styles.loteriaNome, { color: theme.colors.onSurface }]}
                >
                  {config.nome}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {formatarData(jogo.dataCriacao)}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <IconButton
                icon={jogo.favorito ? 'star' : 'star-outline'}
                iconColor={jogo.favorito ? '#FFD700' : theme.colors.onSurfaceVariant}
                size={20}
                onPress={() => handleToggleFavorito(jogo)}
                testID={`favorito-${jogo.id}`}
              />
              <Menu
                visible={menuVisivel === jogo.id}
                onDismiss={() => setMenuVisivel(null)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    iconColor={theme.colors.onSurfaceVariant}
                    size={20}
                    onPress={() => setMenuVisivel(jogo.id)}
                    testID={`menu-${jogo.id}`}
                  />
                }
              >
                <Menu.Item
                  onPress={() => handleVerDetalhes(jogo)}
                  title="Ver detalhes"
                  leadingIcon="eye"
                />
                <Divider />
                <Menu.Item
                  onPress={() => handleExcluir(jogo)}
                  title="Excluir"
                  leadingIcon="delete"
                  titleStyle={{ color: theme.colors.error }}
                />
              </Menu>
            </View>
          </View>

          {renderNumeros(jogo.numeros, config.cor)}
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="ticket-outline"
        size={80}
        color={theme.colors.onSurfaceVariant}
      />
      <Text
        variant="titleLarge"
        style={[styles.emptyTitulo, { color: theme.colors.onSurface }]}
      >
        Nenhum jogo encontrado
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptySubtitulo, { color: theme.colors.onSurfaceVariant }]}
      >
        {filtroAtivo === 'todos'
          ? 'Gere seu primeiro jogo para começar!'
          : 'Nenhum jogo com esse filtro'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text
          variant="headlineMedium"
          style={[styles.titulo, { color: theme.colors.onBackground }]}
        >
          Meus Jogos
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {jogos.length} jogo{jogos.length !== 1 ? 's' : ''} salvo{jogos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <Searchbar
        placeholder="Buscar por número..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchbar, { backgroundColor: theme.colors.surface }]}
        inputStyle={{ color: theme.colors.onSurface }}
        iconColor={theme.colors.onSurfaceVariant}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        testID="searchbar-jogos"
      />

      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          data={FILTROS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosList}
          renderItem={({ item }) => (
            <Chip
              selected={filtroAtivo === item}
              onPress={() => setFiltroAtivo(item)}
              style={[
                styles.filtroChip,
                filtroAtivo === item && { backgroundColor: theme.colors.primaryContainer },
              ]}
              textStyle={{
                color:
                  filtroAtivo === item
                    ? theme.colors.onPrimaryContainer
                    : theme.colors.onSurfaceVariant,
              }}
              testID={`filtro-${item}`}
            >
              {getNomeFiltro(item)}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={jogosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderJogoCard}
        contentContainerStyle={styles.listaContent}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontWeight: 'bold',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  filtrosContainer: {
    marginBottom: 8,
  },
  filtrosList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroChip: {
    marginRight: 8,
  },
  listaContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  jogoCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  loteriaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loteriaIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loteriaNome: {
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numerosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  numeroBolaPequena: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroTextoPequeno: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  maisNumeros: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitulo: {
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitulo: {
    marginTop: 8,
    textAlign: 'center',
  },
});

