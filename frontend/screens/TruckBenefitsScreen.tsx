import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_FUEL_HISTORY } from '../data/mockData';
import { Icon, ProHeader, TruckBottomNav, PV } from '../components/PlacaVivaUI';

const POINTS_PER_LITER = 10;

export default function TruckBenefitsScreen({ navigation }: any) {
  const history = MOCK_FUEL_HISTORY;
  
  const totalPoints = history.reduce((acc, h) => acc + (h.liters * POINTS_PER_LITER), 0);

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ProHeader subtitle="Extrato de Pontos" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Card Destaque de Pontos */}
        <View style={s.pointsCard}>
          <Text style={s.pointsLabel}>Seu Saldo de Pontos PRO</Text>
          <Text style={s.pointsValue}>
            {totalPoints.toLocaleString('pt-BR')} <Text style={s.pointsUnit}>pts</Text>
          </Text>
          <View style={s.conversionRow}>
            <Icon name="star" size={12} color="#fff" />
            <Text style={s.conversionText}>Cada 1 litro abastecido = 10 pontos</Text>
          </View>
        </View>

        {/* Seção da lista de lançamentos */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Pontos gerados por abastecimento</Text>
        </View>

        <View style={s.list}>
          {history.map(item => {
            const pointsGenerated = item.liters * POINTS_PER_LITER;
            return (
              <View key={item.id} style={s.itemCard}>
                <View style={s.itemLeft}>
                  <View style={s.iconBox}>
                    <Icon name="ribbon-outline" size={20} color={PV.orange} />
                  </View>
                  <View style={s.itemInfo}>
                    <Text style={s.stationName} numberOfLines={1}>
                      {item.stationName}
                    </Text>
                    <Text style={s.itemMeta}>
                      {formatDate(item.date)} · {item.liters}L · {item.fuelType}
                    </Text>
                  </View>
                </View>
                <View style={s.itemRight}>
                  <Text style={s.pointsText}>+{pointsGenerated}</Text>
                  <Text style={s.pointsSub}>pontos</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <TruckBottomNav active="benefits" navigation={navigation} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  pointsCard: {
    backgroundColor: PV.navy,
    margin: 16,
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    shadowColor: PV.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  pointsLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontWeight: '600',
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  pointsUnit: {
    fontSize: 20,
    fontWeight: '700',
    color: PV.orange,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
  },
  conversionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: PV.navy,
  },
  list: {
    paddingHorizontal: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PV.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 13,
    fontWeight: '700',
    color: PV.navy,
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 11,
    color: PV.gray,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#27ae60',
  },
  pointsSub: {
    fontSize: 9,
    color: PV.gray,
    fontWeight: '700',
    marginTop: 1,
  },
});
