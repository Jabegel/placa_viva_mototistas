import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_FUEL_HISTORY, getMonthlyStats } from '../data/mockData';
import { Icon, ProHeader, TruckBottomNav, PV } from '../components/PlacaVivaUI';

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function TruckHistoryScreen({ navigation }: any) {
  const [filterMonth, setFilterMonth] = useState(4); // default to May (index 4)
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  
  // Filter history based on selected month (date format: YYYY-MM-DD)
  const history = MOCK_FUEL_HISTORY.filter(item => {
    const m = parseInt(item.date.split('-')[1], 10) - 1; // 0-indexed month
    return m === filterMonth;
  });
  
  const stats = getMonthlyStats(history);
  
  const MONTHLY_GOAL = 50.00;
  const savings = stats.savings;
  const hasMetGoal = savings >= MONTHLY_GOAL;
  const diff = Math.abs(savings - MONTHLY_GOAL);
  const progress = Math.min((savings / MONTHLY_GOAL) * 100, 100);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ProHeader subtitle="Meu Histórico" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Card de economia — destaque */}
        <View style={s.savingsCard}>
          <Text style={s.savingsLabel}>Economia Acumulada no mês</Text>
          <Text style={s.savingsValue}>
            R$ {stats.savings.toFixed(2).replace('.', ',')}
          </Text>
          <TouchableOpacity style={s.goalBtn} onPress={() => setGoalModalVisible(true)}>
            <Text style={s.goalBtnText}>Ver meta mensal →</Text>
          </TouchableOpacity>
        </View>

        {/* Filtro de mês */}
        <View style={s.filterSection}>
          <Text style={s.filterTitle}>Extrato de Abastecimentos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={m}
                style={[s.monthChip, filterMonth === i && s.monthChipActive]}
                onPress={() => setFilterMonth(i)}
              >
                <Text style={[s.monthText, filterMonth === i && s.monthTextActive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista */}
        <View style={s.list}>
          {history.map(item => (
            <TouchableOpacity
              key={item.id}
              style={s.historyCard}
              onPress={() => navigation.navigate('TruckReceipt', { item })}
              activeOpacity={0.75}
            >
              <View style={s.historyTop}>
                <View style={s.historyIcon}>
                  <Icon name="flash-outline" size={18} color={PV.gray} />
                </View>
                <View style={s.historyMeta}>
                  <Text style={s.historyStation} numberOfLines={2}>
                    {item.stationName}
                  </Text>
                  <Text style={s.historyDetail}>
                    {formatDate(item.date)} · {item.time} · {item.liters}L · {item.fuelType}
                  </Text>
                </View>
              </View>
              <View style={s.historyValues}>
                <Text style={s.historyTotal}>
                  Valor Total: R$ {item.total.toFixed(2).replace('.', ',')}
                </Text>
                <Text style={s.historySavings}>
                  💰 Economia: + R$ {item.discount.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {history.length === 0 && (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: PV.gray, fontSize: 13, textAlign: 'center' }}>Nenhum abastecimento registrado neste mês.</Text>
            </View>
          )}
        </View>

        {/* Resumo do mês */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Resumo do mês</Text>
          {[
            { label: 'Total abastecido', value: `${stats.liters}L` },
            { label: 'Total gasto', value: `R$ ${stats.total.toFixed(2).replace('.', ',')}` },
          ].map(row => (
            <View key={row.label} style={s.summaryRow}>
              <Text style={s.summaryLabel}>{row.label}</Text>
              <Text style={s.summaryValue}>{row.value}</Text>
            </View>
          ))}
          <View style={[s.summaryRow, { borderBottomWidth: 0, marginTop: 4 }]}>
            <Text style={s.summaryLabelGreen}>Total economizado</Text>
            <Text style={s.summaryValueGreen}>
              R$ {stats.savings.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <TruckBottomNav active="history" navigation={navigation} />

      {/* Modal: Meta Mensal */}
      <Modal
        visible={goalModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={s.overlay}>
          <View style={s.modalContainer}>
            <TouchableOpacity style={s.modalCloseBtn} onPress={() => setGoalModalVisible(false)}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <View style={s.modalIconCircle}>
              <Icon name={hasMetGoal ? 'trophy-outline' : 'trending-up-outline'} size={32} color={hasMetGoal ? PV.gold : PV.orange} />
            </View>

            <Text style={s.modalTitle}>Meta de Economia</Text>
            <Text style={s.modalSubtitle}>Acompanhe o seu progresso mensal</Text>

            {/* Metas comparativo */}
            <View style={s.modalGoalRow}>
              <View style={{ alignItems: 'center' }}>
                <Text style={s.modalGoalLabel}>Meta Definida</Text>
                <Text style={s.modalGoalValue}>R$ {MONTHLY_GOAL.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View style={s.modalGoalDivider} />
              <View style={{ alignItems: 'center' }}>
                <Text style={s.modalGoalLabel}>Economia Real</Text>
                <Text style={[s.modalGoalValue, { color: '#27ae60' }]}>R$ {savings.toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>

            {/* Progresso visual */}
            <View style={s.progressContainer}>
              <View style={s.progressTrack}>
                <View style={[s.progressBar, { width: `${progress}%`, backgroundColor: hasMetGoal ? '#27ae60' : PV.navy }]} />
              </View>
              <Text style={s.progressPercent}>{Math.round((savings / MONTHLY_GOAL) * 100)}% atingido</Text>
            </View>

            {/* Mensagem de status */}
            <View style={[s.statusBox, hasMetGoal ? s.statusBoxSuccess : s.statusBoxPending]}>
              <Text style={[s.statusText, hasMetGoal ? s.statusTextSuccess : s.statusTextPending]}>
                {hasMetGoal
                  ? `Parabéns! Você superou a meta deste mês em R$ ${diff.toFixed(2).replace('.', ',')}! 🎉`
                  : `Faltam R$ ${diff.toFixed(2).replace('.', ',')} para atingir sua meta mensal de economia.`}
              </Text>
            </View>

            <TouchableOpacity style={s.closeBtn} onPress={() => setGoalModalVisible(false)}>
              <Text style={s.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  savingsCard: {
    backgroundColor: PV.navy, margin: 16, borderRadius: 16,
    padding: 22, alignItems: 'center',
  },
  savingsLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 },
  savingsValue: { fontSize: 38, fontWeight: '900', color: '#fff', marginBottom: 14 },
  goalBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 7,
  },
  goalBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  filterSection: { paddingHorizontal: 16, marginBottom: 4 },
  filterTitle: { fontSize: 13, fontWeight: '700', color: PV.navy },
  monthChip: {
    backgroundColor: PV.offWhite, borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 6, marginRight: 6,
  },
  monthChipActive: { backgroundColor: PV.navy },
  monthText: { fontSize: 12, color: PV.gray, fontWeight: '600' },
  monthTextActive: { color: '#fff' },
  list: { paddingHorizontal: 16, paddingTop: 10 },
  historyCard: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: PV.border,
  },
  historyTop: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  historyIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: PV.offWhite,
    alignItems: 'center', justifyContent: 'center',
  },
  historyMeta: { flex: 1 },
  historyStation: { fontSize: 12, fontWeight: '700', color: PV.navy, lineHeight: 17 },
  historyDetail: { fontSize: 11, color: PV.gray, marginTop: 2 },
  historyValues: { paddingLeft: 48 },
  historyTotal: { fontSize: 13, fontWeight: '700', color: PV.navy },
  historySavings: { fontSize: 12, color: '#27ae60', fontWeight: '600', marginTop: 2 },
  summaryCard: {
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: PV.border,
  },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: PV.navy, marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f5',
  },
  summaryLabel: { fontSize: 13, color: PV.gray },
  summaryValue: { fontSize: 13, fontWeight: '700', color: PV.navy },
  summaryLabelGreen: { fontSize: 13, color: '#27ae60', fontWeight: '600' },
  summaryValueGreen: { fontSize: 14, fontWeight: '800', color: '#27ae60' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PV.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 12,
    color: PV.gray,
    fontWeight: '700',
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f6f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PV.navy,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: PV.gray,
    marginBottom: 20,
  },
  modalGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: PV.offWhite,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
  },
  modalGoalLabel: {
    fontSize: 10,
    color: PV.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalGoalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: PV.navy,
  },
  modalGoalDivider: {
    width: 1,
    height: 30,
    backgroundColor: PV.border,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: PV.offWhite,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercent: {
    fontSize: 11,
    color: PV.gray,
    fontWeight: '700',
  },
  statusBox: {
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBoxSuccess: {
    backgroundColor: '#e8f5e9',
  },
  statusBoxPending: {
    backgroundColor: '#fffbeb',
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  statusTextSuccess: {
    color: '#27ae60',
  },
  statusTextPending: {
    color: '#b28905',
  },
  closeBtn: {
    backgroundColor: PV.navy,
    borderRadius: 24,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
