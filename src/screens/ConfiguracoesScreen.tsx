import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Appbar, List, Switch, Divider, useTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { jogos, limparDados } = useApp();

  const handleLimparDados = () => {
    Alert.alert(
      'Limpar Dados',
      'Deseja realmente apagar todos os seus jogos salvos? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await limparDados();
            Alert.alert('Sucesso', 'Todos os dados foram apagados.');
          },
        },
      ]
    );
  };

  const handleExportarDados = () => {
    if (jogos.length === 0) {
      Alert.alert('Sem Dados', 'Você não possui jogos salvos para exportar.');
      return;
    }

    // Criar resumo dos dados
    const resumo = jogos.map((j) => ({
      loteria: j.loteria,
      numeros: j.numeros.join(', '),
      data: new Date(j.dataCriacao).toLocaleDateString('pt-BR'),
    }));

    Alert.alert(
      'Dados Exportados',
      `${jogos.length} jogo(s) preparado(s) para exportação.\n\nFuncionalidade de compartilhamento em breve!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Configurações" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
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
          <List.Subheader>Dados</List.Subheader>
          <List.Item
            title="Jogos salvos"
            description={`${jogos.length} jogo${jogos.length !== 1 ? 's' : ''} salvo${jogos.length !== 1 ? 's' : ''}`}
            left={(props) => <List.Icon {...props} icon="ticket-outline" />}
          />
          <List.Item
            testID="button-exportar-dados"
            title="Exportar dados"
            description="Compartilhar seus jogos"
            left={(props) => <List.Icon {...props} icon="database-export" />}
            onPress={handleExportarDados}
          />
          <List.Item
            testID="button-limpar-dados"
            title="Limpar todos os dados"
            description="Apagar todos os jogos salvos"
            left={(props) => (
              <List.Icon {...props} icon="delete-outline" color={theme.colors.error} />
            )}
            titleStyle={{ color: theme.colors.error }}
            onPress={handleLimparDados}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Sobre as Loterias</List.Subheader>
          <List.Item
            title="Mega-Sena"
            description="6 números de 1 a 60"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#20986920' }]}>
                <MaterialCommunityIcons name="clover" size={20} color="#209869" />
              </View>
            )}
          />
          <List.Item
            title="Quina"
            description="5 números de 1 a 80"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#26008520' }]}>
                <MaterialCommunityIcons name="star-outline" size={20} color="#260085" />
              </View>
            )}
          />
          <List.Item
            title="Lotofácil"
            description="15 números de 1 a 25"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#93008920' }]}>
                <MaterialCommunityIcons name="grid" size={20} color="#930089" />
              </View>
            )}
          />
          <List.Item
            title="Lotomania"
            description="50 números de 0 a 99"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#F7810020' }]}>
                <MaterialCommunityIcons name="numeric" size={20} color="#F78100" />
              </View>
            )}
          />
          <List.Item
            title="Dupla Sena"
            description="6 números de 1 a 50"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#A6132420' }]}>
                <MaterialCommunityIcons name="dice-multiple" size={20} color="#A61324" />
              </View>
            )}
          />
          <List.Item
            title="Timemania"
            description="10 números de 1 a 80"
            left={() => (
              <View style={[styles.loteriaIcon, { backgroundColor: '#00FF4820' }]}>
                <MaterialCommunityIcons name="soccer" size={20} color="#00AA30" />
              </View>
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Sobre o App</List.Subheader>
          <List.Item
            title="Versão"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title="Desenvolvido por"
            description="Gabriel Schmitt"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
        </List.Section>

        <View style={styles.disclaimerContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            variant="bodySmall"
            style={[styles.disclaimerTexto, { color: theme.colors.onSurfaceVariant }]}
          >
            Este aplicativo é apenas para fins de entretenimento. Jogue com responsabilidade.
            Resultados gerados são aleatórios e não garantem prêmios.
          </Text>
        </View>
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
  loteriaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  disclaimerTexto: {
    flex: 1,
    lineHeight: 18,
  },
});
