import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function Dashboard({ route, navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A3A5A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {data.user_name}!</Text>
        <Text style={styles.profileTag}>{data.user_type}</Text>
      </View>

      {/* Card de Economia */}
      <View style={styles.cardSavings}>
        <Text style={styles.cardLabel}>Economia Total no Mês</Text>
        <Text style={styles.savingsValue}>R$ {data.monthly_savings.toFixed(2)}</Text>
        <Text style={styles.litersLabel}>{data.total_liters_month} Litros abastecidos</Text>
      </View>

      {/* Card de Benefícios */}
      <View style={styles.cardReward}>
        <Text style={styles.cardLabel}>Próximo Benefício</Text>
        <Text style={styles.rewardText}>{data.next_reward_text}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${data.next_reward_progress * 100}%` }]} />
        </View>
      </View>

      {/* Botões de Ação Rápida */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Abastecer Agora</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.actionText}>Ver Histórico de Economia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
          <Text style={styles.actionText}>Ver Postos Próximos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 40, marginBottom: 20 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#1A3A5A' },
  profileTag: { fontSize: 14, color: '#1A3A5A', backgroundColor: '#D1E3F8', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  cardSavings: { backgroundColor: '#1A3A5A', borderRadius: 15, padding: 20, marginBottom: 20, elevation: 5 },
  cardLabel: { color: '#D1E3F8', fontSize: 14, marginBottom: 5 },
  savingsValue: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  litersLabel: { color: '#FFF', fontSize: 14, opacity: 0.8 },
  cardReward: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#D1E3F8' },
  rewardText: { fontSize: 18, fontWeight: 'bold', color: '#1A3A5A', marginBottom: 15 },
  progressBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 },
  progressBarFill: { height: 10, backgroundColor: '#4CAF50', borderRadius: 5 },
  actionsContainer: { gap: 15, marginBottom: 40 },
  actionButton: { backgroundColor: '#1A3A5A', padding: 18, borderRadius: 12, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#2C5A8A' },
  actionText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

