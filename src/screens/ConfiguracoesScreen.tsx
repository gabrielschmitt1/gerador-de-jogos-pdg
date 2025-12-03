import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, List, Switch, Divider, useTheme } from 'react-native-paper';
import { useThemeContext } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { notificacoesAtivadas, lembreteAutomatico, toggleNotificacoes, toggleLembreteAutomatico } =
    useNotifications();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Configurações" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Notificações</List.Subheader>
          <List.Item
            title="Ativar notificações"
            description="Receba alertas sobre seus agendamentos"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                testID="switch-notificacoes"
                value={notificacoesAtivadas}
                onValueChange={toggleNotificacoes}
              />
            )}
          />
          <List.Item
            title="Lembrete automático"
            description="Notificação 1 hora antes do agendamento"
            left={(props) => <List.Icon {...props} icon="clock-alert-outline" />}
            right={() => (
              <Switch
                testID="switch-lembrete-automatico"
                value={lembreteAutomatico}
                onValueChange={toggleLembreteAutomatico}
                disabled={!notificacoesAtivadas}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Aparência</List.Subheader>
          <List.Item
            title="Modo escuro"
            description={isDarkMode ? 'Tema escuro ativo' : 'Tema claro ativo'}
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch testID="switch-modo-escuro" value={isDarkMode} onValueChange={toggleTheme} />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Dados e Backup</List.Subheader>
          <List.Item
            testID="button-exportar-dados"
            title="Exportar dados"
            description="Salvar seus agendamentos em arquivo"
            left={(props) => <List.Icon {...props} icon="database-export" />}
            onPress={() => {}}
          />
          <List.Item
            testID="button-importar-dados"
            title="Importar dados"
            description="Restaurar agendamentos de backup"
            left={(props) => <List.Icon {...props} icon="database-import" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Sobre</List.Subheader>
          <List.Item
            title="Versão"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title="Termos de uso"
            left={(props) => <List.Icon {...props} icon="file-document-outline" />}
            onPress={() => {}}
          />
          <List.Item
            title="Política de privacidade"
            left={(props) => <List.Icon {...props} icon="shield-check-outline" />}
            onPress={() => {}}
          />
        </List.Section>
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
  },
});
