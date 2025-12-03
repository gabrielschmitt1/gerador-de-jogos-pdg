import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform, TextInput as RNTextInput } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  useTheme,
  SegmentedButtons,
  Portal,
  Modal,
  Text,
} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../contexts/AppContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Agendamento } from '../types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NovoAgendamentoScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { adicionarAgendamento } = useApp();
  const { agendarNotificacao } = useNotifications();

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [valor, setValor] = useState('');
  const [custo, setCusto] = useState('');
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [tipoPagamento, setTipoPagamento] = useState<Agendamento['tipoPagamento']>('PIX');
  const [observacoes, setObservacoes] = useState('');
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarHorario, setMostrarHorario] = useState(false);

  const handleAgendar = async () => {
    if (!clienteNome || !procedimento || !valor) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novoAgendamento: Omit<Agendamento, 'id'> = {
      clienteNome,
      clienteTelefone,
      procedimento,
      data,
      hora: hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      valor: parseFloat(valor),
      custo: parseFloat(custo || '0'),
      tipoPagamento,
      observacoes,
      status: 'proximo',
    };

    try {
      // Adicionar agendamento e receber o objeto com ID
      const agendamentoCriado = await adicionarAgendamento(novoAgendamento);

      // Agendar notificação com o agendamento que tem ID
      await agendarNotificacao(agendamentoCriado);

      // Limpar formulário
      setClienteNome('');
      setClienteTelefone('');
      setProcedimento('');
      setValor('');
      setCusto('');
      setObservacoes('');
      setData(new Date());
      setHora(new Date());

      // Navegar para a tela de sucesso
      navigation.navigate('SucessoAgendamento');
    } catch (error) {
      alert('❌ Erro ao criar agendamento. Tente novamente.');
      console.error(error);
    }
  };

  const formatarData = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const formatarHora = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Novo Agendamento" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          testID="input-cliente-nome"
          label="Nome do Cliente *"
          value={clienteNome}
          onChangeText={setClienteNome}
          mode="outlined"
          style={styles.input}
          placeholder="Digite o nome do cliente"
        />

        <TextInput
          testID="input-cliente-telefone"
          label="Telefone"
          value={clienteTelefone}
          onChangeText={setClienteTelefone}
          mode="outlined"
          style={styles.input}
          placeholder="(11) 98765-4321"
          keyboardType="phone-pad"
        />

        <TextInput
          testID="input-procedimento"
          label="Tipo de Procedimento *"
          value={procedimento}
          onChangeText={setProcedimento}
          mode="outlined"
          style={styles.input}
          placeholder="Ex: Corte de Cabelo"
        />

        <View style={styles.row}>
          <TextInput
            testID="input-valor"
            label="Valor *"
            value={valor}
            onChangeText={setValor}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            placeholder="R$ 0,00"
            keyboardType="numeric"
            left={<TextInput.Affix text="R$" />}
          />

          <TextInput
            testID="input-custo"
            label="Custo"
            value={custo}
            onChangeText={setCusto}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            placeholder="R$ 0,00"
            keyboardType="numeric"
            left={<TextInput.Affix text="R$" />}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            testID="input-data"
            label="Data"
            value={formatarData(data)}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            editable={false}
            right={
              <TextInput.Icon
                testID="button-calendar"
                icon="calendar"
                onPress={() => setMostrarCalendario(true)}
              />
            }
          />

          <TextInput
            testID="input-hora"
            label="Hora"
            value={formatarHora(hora)}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            editable={false}
            right={
              <TextInput.Icon
                testID="button-time"
                icon="clock-outline"
                onPress={() => setMostrarHorario(true)}
              />
            }
          />
        </View>

        {mostrarCalendario && (
          <View
            testID="calendar-modal"
            style={[styles.calendarContainer, { backgroundColor: theme.colors.surface }]}
          >
            <Calendar
              onDayPress={(day) => {
                setData(new Date(day.timestamp));
                setMostrarCalendario(false);
              }}
              markedDates={{
                [data.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: theme.colors.primary,
                },
              }}
              theme={{
                todayTextColor: theme.colors.primary,
                selectedDayBackgroundColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
              }}
            />
          </View>
        )}

        {mostrarHorario && Platform.OS !== 'web' && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedTime) => {
              setMostrarHorario(Platform.OS === 'ios');
              if (selectedTime) {
                setHora(selectedTime);
              }
            }}
          />
        )}

        {/* Modal de seleção de horário para Web */}
        <Portal>
          <Modal
            testID="time-picker-modal"
            visible={mostrarHorario && Platform.OS === 'web'}
            onDismiss={() => setMostrarHorario(false)}
            contentContainerStyle={[styles.modalHorario, { backgroundColor: theme.colors.surface }]}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              Selecione o Horário
            </Text>

            <View style={styles.timePickerContainer}>
              <View style={styles.timeInputGroup}>
                <Text variant="labelLarge" style={styles.timeLabel}>
                  Hora:
                </Text>
                <TextInput
                  value={hora.getHours().toString().padStart(2, '0')}
                  onChangeText={(text) => {
                    const hours = parseInt(text) || 0;
                    if (hours >= 0 && hours <= 23) {
                      const newDate = new Date(hora);
                      newDate.setHours(hours);
                      setHora(newDate);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  style={styles.timeInput}
                  mode="outlined"
                />
              </View>

              <Text variant="headlineMedium" style={styles.timeSeparator}>
                :
              </Text>

              <View style={styles.timeInputGroup}>
                <Text variant="labelLarge" style={styles.timeLabel}>
                  Minuto:
                </Text>
                <TextInput
                  value={hora.getMinutes().toString().padStart(2, '0')}
                  onChangeText={(text) => {
                    const minutes = parseInt(text) || 0;
                    if (minutes >= 0 && minutes <= 59) {
                      const newDate = new Date(hora);
                      newDate.setMinutes(minutes);
                      setHora(newDate);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  style={styles.timeInput}
                  mode="outlined"
                />
              </View>
            </View>

            {/* Atalhos de horário */}
            <View style={styles.timeShortcuts}>
              <Text
                variant="labelMedium"
                style={[styles.shortcutsLabel, { color: theme.colors.onSurfaceVariant }]}
              >
                Horários Comuns:
              </Text>
              <View style={styles.shortcutsButtons}>
                {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map(
                  (time) => (
                    <Button
                      key={time}
                      mode="outlined"
                      onPress={() => {
                        const [hours, minutes] = time.split(':').map(Number);
                        const newDate = new Date(hora);
                        newDate.setHours(hours, minutes);
                        setHora(newDate);
                      }}
                      style={styles.shortcutButton}
                      compact
                    >
                      {time}
                    </Button>
                  )
                )}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={() => setMostrarHorario(false)}>
                Cancelar
              </Button>
              <Button
                testID="button-confirm-time"
                mode="contained"
                onPress={() => setMostrarHorario(false)}
              >
                Confirmar
              </Button>
            </View>
          </Modal>
        </Portal>

        <View style={styles.section}>
          <TextInput
            testID="select-tipo-pagamento"
            label="Tipo de Pagamento"
            value={tipoPagamento}
            mode="outlined"
            style={styles.input}
            editable={false}
          />
          <SegmentedButtons
            value={tipoPagamento}
            onValueChange={(value) => setTipoPagamento(value as Agendamento['tipoPagamento'])}
            buttons={[
              { value: 'PIX', label: 'PIX', testID: 'payment-option-pix' },
              { value: 'Cartão de Crédito', label: 'Crédito', testID: 'payment-option-credito' },
              { value: 'Cartão de Débito', label: 'Débito', testID: 'payment-option-debito' },
              { value: 'Dinheiro', label: 'Dinheiro', testID: 'payment-option-dinheiro' },
            ]}
            style={styles.segmented}
          />
        </View>

        <TextInput
          testID="input-observacoes"
          label="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
          mode="outlined"
          style={styles.input}
          placeholder="Adicione observações sobre o atendimento"
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <Button
          testID="button-agendar"
          mode="contained"
          onPress={handleAgendar}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Agendar
        </Button>
      </View>
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
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  segmented: {
    marginTop: 8,
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  footer: {
    padding: 16,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHorario: {
    margin: 20,
    padding: 24,
    borderRadius: 12,
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
  },
  modalTitle: {
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  timeInputGroup: {
    alignItems: 'center',
    gap: 8,
  },
  timeLabel: {
    marginBottom: 4,
  },
  timeInput: {
    width: 80,
    textAlign: 'center',
  },
  timeSeparator: {
    marginTop: 24,
    fontWeight: 'bold',
  },
  timeShortcuts: {
    marginBottom: 24,
  },
  shortcutsLabel: {
    marginBottom: 12,
  },
  shortcutsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  shortcutButton: {
    minWidth: 70,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
