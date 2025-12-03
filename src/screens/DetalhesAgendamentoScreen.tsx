import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Portal,
  Modal,
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../contexts/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Agendamento } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DetailRouteProp = RouteProp<RootStackParamList, 'DetalhesAgendamento'>;

export default function DetalhesAgendamentoScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailRouteProp>();
  const { agendamentos, atualizarAgendamento, cancelarAgendamento } = useApp();

  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [valor, setValor] = useState('');
  const [custo, setCusto] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState<Agendamento['tipoPagamento']>('PIX');
  const [observacoes, setObservacoes] = useState('');

  const agendamento = agendamentos.find((a) => a.id === route.params.agendamentoId);

  if (!agendamento) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.emptyState}>
          <Text>Agendamento não encontrado</Text>
        </View>
      </View>
    );
  }

  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const lucroTotal = agendamento.valor - agendamento.custo;

  const handleEditar = () => {
    setClienteNome(agendamento.clienteNome);
    setClienteTelefone(agendamento.clienteTelefone);
    setProcedimento(agendamento.procedimento);
    setValor(agendamento.valor.toString());
    setCusto(agendamento.custo.toString());
    setTipoPagamento(agendamento.tipoPagamento);
    setObservacoes(agendamento.observacoes || '');
    setModalEditarVisivel(true);
  };

  const handleSalvarEdicao = async () => {
    try {
      await atualizarAgendamento(agendamento.id, {
        clienteNome,
        clienteTelefone,
        procedimento,
        valor: parseFloat(valor),
        custo: parseFloat(custo),
        tipoPagamento,
        observacoes,
      });
      setModalEditarVisivel(false);
      Alert.alert('✅ Sucesso', 'Agendamento atualizado e salvo localmente!');
    } catch (error) {
      Alert.alert('❌ Erro', 'Não foi possível atualizar o agendamento.');
      console.error(error);
    }
  };

  const handleCancelar = () => {
    Alert.alert('Cancelar Agendamento', 'Tem certeza que deseja cancelar este agendamento?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          try {
            await cancelarAgendamento(agendamento.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('❌ Erro', 'Não foi possível cancelar o agendamento.');
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                👤 Informações do Cliente
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Nome
              </Text>
              <Text testID="text-cliente-nome" variant="bodyMedium" style={styles.value}>
                {agendamento.clienteNome}
              </Text>
            </View>
            {agendamento.clienteTelefone && (
              <View style={styles.row}>
                <Text
                  variant="bodyMedium"
                  style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
                >
                  Telefone
                </Text>
                <Text testID="text-cliente-telefone" variant="bodyMedium" style={styles.value}>
                  {agendamento.clienteTelefone}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                📅 Detalhes do Agendamento
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Data
              </Text>
              <Text testID="text-data" variant="bodyMedium" style={styles.value}>
                {formatarData(agendamento.data)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Horário
              </Text>
              <Text testID="text-hora" variant="bodyMedium" style={styles.value}>
                {agendamento.hora}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Procedimento
              </Text>
              <Text testID="text-procedimento" variant="bodyMedium" style={styles.value}>
                {agendamento.procedimento}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Valor Recebido
              </Text>
              <Text
                testID="text-valor"
                variant="bodyMedium"
                style={[styles.value, styles.primaryColor, { color: theme.colors.primary }]}
              >
                {formatarValor(agendamento.valor)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                💰 Financeiro
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Custo
              </Text>
              <Text testID="text-custo" variant="bodyMedium" style={styles.value}>
                {formatarValor(agendamento.custo)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                variant="bodyMedium"
                style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
              >
                Tipo de Pagamento
              </Text>
              <Text testID="text-tipo-pagamento" variant="bodyMedium" style={styles.value}>
                {agendamento.tipoPagamento}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text variant="bodyMedium" style={[styles.label, styles.bold]}>
                Lucro Total
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.value, styles.bold, styles.successColor, { color: '#4CAF50' }]}
              >
                {formatarValor(lucroTotal)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {agendamento.observacoes && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  📝 Observações
                </Text>
              </View>
              <Text
                variant="bodyMedium"
                style={[styles.observacoes, { color: theme.colors.onSurfaceVariant }]}
              >
                {agendamento.observacoes}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <Button
          testID="button-editar"
          mode="contained-tonal"
          onPress={handleEditar}
          style={[styles.button, styles.editButton]}
          icon="pencil"
        >
          Editar
        </Button>
        <Button
          testID="button-cancelar"
          mode="contained"
          onPress={handleCancelar}
          style={[styles.button, styles.cancelButton]}
          buttonColor="#EF5350"
          icon="close-circle"
        >
          Cancelar
        </Button>
      </View>

      <Portal>
        <Modal
          visible={modalEditarVisivel}
          onDismiss={() => setModalEditarVisivel(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text variant="titleLarge" style={styles.modalTitle}>
              Editar Agendamento
            </Text>

            <TextInput
              label="Nome do Cliente"
              value={clienteNome}
              onChangeText={setClienteNome}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Telefone"
              value={clienteTelefone}
              onChangeText={setClienteTelefone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Procedimento"
              value={procedimento}
              onChangeText={setProcedimento}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.rowModal}>
              <TextInput
                label="Valor"
                value={valor}
                onChangeText={setValor}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
                keyboardType="numeric"
                left={<TextInput.Affix text="R$" />}
              />

              <TextInput
                label="Custo"
                value={custo}
                onChangeText={setCusto}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
                keyboardType="numeric"
                left={<TextInput.Affix text="R$" />}
              />
            </View>

            <Text variant="labelLarge" style={styles.modalLabel}>
              Tipo de Pagamento
            </Text>
            <SegmentedButtons
              value={tipoPagamento}
              onValueChange={(value) => setTipoPagamento(value as Agendamento['tipoPagamento'])}
              buttons={[
                { value: 'PIX', label: 'PIX' },
                { value: 'Cartão de Crédito', label: 'Crédito' },
                { value: 'Cartão de Débito', label: 'Débito' },
                { value: 'Dinheiro', label: 'Dinheiro' },
              ]}
              style={styles.segmented}
            />

            <TextInput
              label="Observações"
              value={observacoes}
              onChangeText={setObservacoes}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={() => setModalEditarVisivel(false)}>
                Cancelar
              </Button>
              <Button testID="button-salvar" mode="contained" onPress={handleSalvarEdicao}>
                Salvar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  primaryColor: {
    fontWeight: 'bold',
  },
  successColor: {},
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  observacoes: {
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  cancelButton: {},
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  rowModal: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  modalLabel: {
    marginBottom: 8,
    marginTop: 4,
  },
  segmented: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
});
