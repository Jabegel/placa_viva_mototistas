import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Modal, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, ProHeader, InteractiveFilter, FilterType, TruckBottomNav, PV } from '../components/PlacaVivaUI';
import { useUser } from '../context/UserContext';

const FUEL_FILTERS = [
  { id: 'diesel-s10',  label: 'Caminhão / Diesel S-10' },
  { id: 'diesel-s500', label: 'Caminhão / Diesel S-500' },
];

type TruckCoupon = {
  id: string;
  stationName: string;
  distance: number;
  neighborhood: string;
  discountPerLiter: number;
  estimatedSavings: number;
  fuelType: string;
  pricePerLiter: number;
};

const MOCK: TruckCoupon[] = [
  { id: 'tc1', stationName: 'Posto Petrobras 214 Sul', distance: 7.4, neighborhood: 'Asa Sul', discountPerLiter: 0.20, estimatedSavings: 10.00, fuelType: 'Diesel S-10 PRO', pricePerLiter: 6.39 },
  { id: 'tc2', stationName: 'Posto Jarjour 206 Norte', distance: 5.0, neighborhood: 'Asa Norte', discountPerLiter: 0.25, estimatedSavings: 15.00, fuelType: 'Diesel S-10 PRO', pricePerLiter: 6.35 },
  { id: 'tc3', stationName: 'Posto São Bento 203 Norte', distance: 4.5, neighborhood: 'Asa Norte', discountPerLiter: 0.20, estimatedSavings: 12.00, fuelType: 'Diesel S-500 PRO', pricePerLiter: 6.10 },
];

export default function TruckCouponsScreen({ navigation }: any) {
  const { vehicles } = useUser();
  const [filterType, setFilterType] = useState<FilterType>('combustivel');
  const [filterValue, setFilterValue] = useState('all');

  const filtered = MOCK.filter(coupon => {
    if (filterValue === 'all') return true;
    if (filterType === 'combustivel') {
      if (filterValue === 'diesel-s10') return coupon.fuelType.includes('S-10');
      if (filterValue === 'diesel-s500') return coupon.fuelType.includes('S-500');
      if (filterValue === 'gasolina') return coupon.stationName.includes('Petrobras');
      if (filterValue === 'etanol') return coupon.stationName.includes('Jarjour');
    }
    if (filterType === 'veiculo') {
      const selectedVehicle = vehicles.find(v => v.id === filterValue);
      if (selectedVehicle) {
        if (selectedVehicle.kind === 'truck') {
          return coupon.fuelType.includes('Diesel');
        } else {
          return !coupon.fuelType.includes('Diesel');
        }
      }
      return true;
    }
    if (filterType === 'cidade') {
      if (filterValue === 'brasilia') return true;
      if (filterValue === 'taguatinga') return coupon.stationName.includes('Petrobras');
      if (filterValue === 'goiania') return coupon.stationName.includes('Jarjour');
      if (filterValue === 'luziania') return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ProHeader subtitle="Histórico de Cupons Utilizados" navigation={navigation} />

      <InteractiveFilter
        selectedType={filterType}
        selectedValue={filterValue}
        onChange={(type, val) => {
          setFilterType(type);
          setFilterValue(val);
        }}
      />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {filtered.map(coupon => (
          <View key={coupon.id} style={[s.card, s.cardUsed]}>
            <View style={s.cardTop}>
              <View style={s.stationIconBox}>
                <Icon name="flash-outline" size={20} color={PV.gray} />
              </View>
              <View style={s.cardMeta}>
                <Text style={s.stationName}>{coupon.stationName}</Text>
                <View style={s.locationRow}>
                  <Icon name="location-outline" size={14} color={PV.gray} />
                  <Text style={s.locationText}>
                    {coupon.distance} km de você · {coupon.neighborhood}
                  </Text>
                </View>
                <Text style={s.discountText}>
                  Desconto obtido: R$ {coupon.discountPerLiter.toFixed(2).replace('.', ',')}/L
                </Text>
                <Text style={s.savingsText}>
                  Economia acumulada: R$ {coupon.estimatedSavings.toFixed(2).replace('.', ',')}
                </Text>
                
                <View style={s.usedBadge}>
                  <Icon name="checkmark-circle" size={14} color="#27ae60" />
                  <Text style={s.usedBadgeText}>Cupom utilizado</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: PV.gray, fontSize: 13 }}>Nenhum cupom utilizado neste filtro.</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <TruckBottomNav active="coupons" navigation={navigation} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: PV.border,
  },
  cardUsed: { opacity: 0.8 },
  cardTop: { flexDirection: 'row', gap: 10 },
  stationIconBox: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: PV.offWhite,
    alignItems: 'center', justifyContent: 'center',
  },
  cardMeta: { flex: 1 },
  stationName: { fontSize: 13, fontWeight: '700', color: PV.navy, marginBottom: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  locationText: { fontSize: 11, color: PV.gray },
  discountText: { fontSize: 12, fontWeight: '700', color: '#7a5c2e', marginBottom: 2 },
  savingsText: { fontSize: 11, color: '#27ae60', marginBottom: 6 },
  usedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  usedBadgeText: {
    fontSize: 11,
    color: '#27ae60',
    fontWeight: '700',
  },
});
