import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Appbar,
  Text,
  Searchbar,
  Card,
  IconButton,
  useTheme,
  SegmentedButtons,
  Menu,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { useApp } from '../contexts/AppContext';
import { useNotifications } from '../contexts/NotificationContext';
import { RootStackParamList, MainTabsParamList } from '../navigation/AppNavigator';
import { Agendamento } from '../types';

type NavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<MainTabsParamList, 'MeusAgendamentos'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function MeusAgendamentosScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { agendamentos, cancelarAgendamento, concluirAgendamento } = useApp();
  const { cancelarNotificacao } = useNotifications();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<'proximo' | 'passado'>('proximo');
  const [menuVisivel, setMenuVisivel] = useState<string | null>(null);

  const agendamentosFiltrados = agendamentos.filter((a) => {
    const matchBusca =
      a.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      a.procedimento.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = a.status === filtro;
    return matchBusca && matchFiltro;
  });

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleVerDetalhes = (agendamentoId: string) => {
    setMenuVisivel(null);
    navigation.navigate('DetalhesAgendamento', { agendamentoId });
  };

  const handleCancelar = async (agendamentoId: string) => {
    setMenuVisivel(null);
    try {
      await cancelarAgendamento(agendamentoId);
      await cancelarNotificacao(agendamentoId);
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    }
  };

  const handleConcluir = async (agendamentoId: string) => {
    setMenuVisivel(null);
    try {
      await concluirAgendamento(agendamentoId);
      await cancelarNotificacao(agendamentoId);
    } catch (error) {
      console.error('Erro ao concluir:', error);
    }
  };

  const renderAgendamento = (agendamento: Agendamento) => (
    <Card key={agendamento.id} testID={`agendamento-card-${agendamento.id}`} style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Image
          source={{
            uri: agendamento.avatarUrl || `https://i.pravatar.cc/150?img=${agendamento.id}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.nome}>
            {agendamento.clienteNome}
          </Text>
          <Text variant="bodySmall" style={[styles.data, { color: theme.colors.onSurfaceVariant }]}>
            {formatarData(agendamento.data)} · {agendamento.hora}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.procedimento, { color: theme.colors.onSurfaceVariant }]}
          >
            {agendamento.procedimento} · {formatarValor(agendamento.valor)}
          </Text>
        </View>
        <Menu
          visible={menuVisivel === agendamento.id}
          onDismiss={() => setMenuVisivel(null)}
          anchor={
            <IconButton
              testID={`menu-button-${agendamento.clienteNome}`}
              icon="dots-vertical"
              size={20}
              onPress={() => setMenuVisivel(agendamento.id)}
            />
          }
        >
          <Menu.Item
            testID="menu-option-ver-detalhes"
            onPress={() => handleVerDetalhes(agendamento.id)}
            title="Ver detalhes"
            leadingIcon="eye"
          />
          {agendamento.status === 'proximo' && (
            <Menu.Item
              testID="menu-option-concluir"
              onPress={() => handleConcluir(agendamento.id)}
              title="Concluir"
              leadingIcon="check-circle"
            />
          )}
          <Menu.Item
            testID="menu-option-cancelar"
            onPress={() => handleCancelar(agendamento.id)}
            title="Cancelar"
            leadingIcon="close-circle"
          />
        </Menu>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Meus Agendamentos" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={[styles.tabsContainer, { backgroundColor: theme.colors.background }]}>
        <SegmentedButtons
          value={filtro}
          onValueChange={(value) => setFiltro(value as 'proximo' | 'passado')}
          buttons={[
            { value: 'proximo', label: 'Próximos', testID: 'tab-proximos' },
            { value: 'passado', label: 'Passados', testID: 'tab-passados' },
          ]}
          style={styles.tabs}
        />
      </View>

      <View style={styles.content}>
        <Searchbar
          testID="searchbar-agendamentos"
          placeholder="Buscar agendamentos"
          onChangeText={setBusca}
          value={busca}
          style={styles.searchbar}
          elevation={1}
        />

        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {agendamentosFiltrados.length === 0 ? (
            <View
              testID={`empty-state-${filtro === 'proximo' ? 'proximos' : 'passados'}`}
              style={styles.emptyState}
            >
              <Text variant="titleMedium" style={styles.emptyText}>
                Nenhum agendamento encontrado
              </Text>
            </View>
          ) : (
            agendamentosFiltrados.map(renderAgendamento)
          )}
        </ScrollView>
      </View>

      <FAB
        testID="fab-novo"
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('NovoAgendamento')}
        label="Novo"
      />
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
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabs: {},
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  data: {
    marginBottom: 2,
  },
  procedimento: {},
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
