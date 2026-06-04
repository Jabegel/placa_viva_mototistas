import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Modal, Dimensions, Linking, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TRUCK_STATIONS, MOCK_FUEL_HISTORY } from '../data/mockData';
import { Icon, ProHeader, InteractiveFilter, FilterType, StationProCard, TruckBottomNav, PV } from '../components/PlacaVivaUI';
import { useUser } from '../context/UserContext';

const { width: SW } = Dimensions.get('window');

const FUEL_FILTERS = [
  { id: 'diesel-s10',  label: 'Caminhão / Diesel S-10' },
  { id: 'diesel-s500', label: 'Caminhão / Diesel S-500' },
  { id: 'all',         label: 'Todos' },
];

export default function TruckStationsScreen({ navigation }: any) {
  const { vehicles } = useUser();
  const [filterType, setFilterType] = useState<FilterType>('combustivel');
  const [filterValue, setFilterValue] = useState('all');
  const [routeTarget, setRouteTarget] = useState<any>(null);
  const [selectedStationForDiscounts, setSelectedStationForDiscounts] = useState<any>(null);

  const openWaze = (s: any) =>
    Linking.openURL(`waze://?q=${encodeURIComponent(s.name)}&navigate=yes`)
      .catch(() => Linking.openURL('https://waze.com'));

  const openMaps = (s: any) =>
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(s.name)}`);

  const filteredStations = MOCK_TRUCK_STATIONS.filter(station => {
    if (filterValue === 'all') return true;
    if (filterType === 'combustivel') {
      if (filterValue === 'diesel-s10') return true;
      if (filterValue === 'diesel-s500') return !!station.dieselS500Price;
      if (filterValue === 'gasolina') return station.brand === 'Petrobras' || station.brand === 'Shell';
      if (filterValue === 'etanol') return station.brand === 'Ipiranga' || station.brand === 'Petrobras';
    }
    if (filterType === 'veiculo') {
      const selectedVehicle = vehicles.find(v => v.id === filterValue);
      if (selectedVehicle) {
        if (selectedVehicle.kind === 'truck') {
          return station.hasParking || station.hasTruckLane;
        }
        if (selectedVehicle.kind === 'suv') {
          return station.brand === 'Petrobras' || station.brand === 'Ipiranga';
        }
        if (selectedVehicle.kind === 'motorcycle') {
          return !station.hasTruckLane;
        }
      }
      return true;
    }
    if (filterType === 'cidade') {
      if (filterValue === 'brasilia') return true;
      if (filterValue === 'taguatinga') return station.brand === 'Ipiranga';
      if (filterValue === 'goiania') return station.brand === 'Shell';
      if (filterValue === 'luziania') return false;
    }
    return true;
  });

  const getSavingsForStation = (stationName: string) => {
    const matches = MOCK_FUEL_HISTORY.filter(h => 
      h.stationName.toLowerCase().includes(stationName.toLowerCase()) ||
      stationName.toLowerCase().includes(h.stationName.toLowerCase())
    );
    return matches.reduce((acc, curr) => acc + curr.discount, 0);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ProHeader subtitle="Postos na sua rota" navigation={navigation} />

      <InteractiveFilter
        selectedType={filterType}
        selectedValue={filterValue}
        onChange={(type, val) => {
          setFilterType(type);
          setFilterValue(val);
        }}
      />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {filteredStations.map(station => {
          const savings = getSavingsForStation(station.name);
          return (
            <StationProCard
              key={station.id}
              station={station}
              fuelFilter={filterType === 'combustivel' ? filterValue : 'diesel-s10'}
              savings={savings}
              onDescontos={() => setSelectedStationForDiscounts(station)}
              onNavigate={() => setRouteTarget(station)}
            />
          );
        })}

        {filteredStations.length === 0 && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: PV.gray, fontSize: 13, textAlign: 'center' }}>
              Nenhum posto encontrado para este filtro.
            </Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <TruckBottomNav active="stations" navigation={navigation} />

      {/* Modal rotas */}
      <Modal
        visible={!!routeTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setRouteTarget(null)}
      >
        <TouchableOpacity
          style={s.routeOverlay}
          activeOpacity={1}
          onPress={() => setRouteTarget(null)}
        >
          <View style={s.routeSheet}>
            <View style={s.routeHeader}>
              <Text style={s.routeTitle}>
                Dirija até o{'\n'}{routeTarget?.name}
              </Text>
              <TouchableOpacity onPress={() => setRouteTarget(null)}>
                <Text style={s.routeClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={s.wazeBtn}
              onPress={() => routeTarget && openWaze(routeTarget)}
            >
              <Text style={{ fontSize: 18 }}>🚗</Text>
              <Text style={s.wazeBtnText}>Dirija com Waze</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.mapsBtn}
              onPress={() => routeTarget && openMaps(routeTarget)}
            >
              <Icon name="map-outline" size={18} color={PV.gray} />
              <Text style={s.mapsBtnText}>Dirija com Google Maps</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Descontos do Posto */}
      <Modal
        visible={!!selectedStationForDiscounts}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedStationForDiscounts(null)}
      >
        <TouchableOpacity
          style={s.discountsOverlay}
          activeOpacity={1}
          onPress={() => setSelectedStationForDiscounts(null)}
        >
          <View style={s.discountsSheet} onStartShouldSetResponder={() => true}>
            <View style={s.discountsHandle} />
            
            <View style={s.discountsHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.discountsTitle}>{selectedStationForDiscounts?.name}</Text>
                <Text style={s.discountsSub}>{selectedStationForDiscounts?.neighborhood} · PRO Rota</Text>
              </View>
              <TouchableOpacity style={s.discountsCloseBtn} onPress={() => setSelectedStationForDiscounts(null)}>
                <Text style={s.discountsCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.discountsLabel}>Descontos exclusivos disponíveis:</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
              {/* Diesel S-10 PRO */}
              <View style={s.discountItem}>
                <View style={s.discountIconBox}>
                  <Icon name="water-outline" size={15} color={PV.orange} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.discountFuel}>Diesel S-10 PRO</Text>
                  <Text style={s.discountPrice}>
                    Preço: R$ {(selectedStationForDiscounts?.dieselS10Price || 0).toFixed(2).replace('.', ',')}/L
                  </Text>
                </View>
                <Text style={s.discountBadgeText}>
                  -R$ {(selectedStationForDiscounts?.discount || 0).toFixed(2).replace('.', ',')}/L
                </Text>
              </View>

              {/* Diesel S-500 PRO (only if available) */}
              {selectedStationForDiscounts?.dieselS500Price && (
                <View style={s.discountItem}>
                  <View style={s.discountIconBox}>
                    <Icon name="water-outline" size={15} color={PV.gold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.discountFuel}>Diesel S-500 PRO</Text>
                    <Text style={s.discountPrice}>
                      Preço: R$ {(selectedStationForDiscounts?.dieselS500Price || 0).toFixed(2).replace('.', ',')}/L
                    </Text>
                  </View>
                  <Text style={s.discountBadgeText}>
                    -R$ {(selectedStationForDiscounts?.discount || 0).toFixed(2).replace('.', ',')}/L
                  </Text>
                </View>
              )}

              {/* Gasolina Comum (mocked) */}
              <View style={s.discountItem}>
                <View style={s.discountIconBox}>
                  <Icon name="flame-outline" size={15} color={PV.red} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.discountFuel}>Gasolina Comum PRO</Text>
                  <Text style={s.discountPrice}>Preço: R$ 5,95/L</Text>
                </View>
                <Text style={s.discountBadgeText}>-R$ 0,15/L</Text>
              </View>

              {/* Etanol Comum (mocked) */}
              <View style={s.discountItem}>
                <View style={s.discountIconBox}>
                  <Icon name="leaf-outline" size={15} color={PV.greenOk} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.discountFuel}>Etanol Comum PRO</Text>
                  <Text style={s.discountPrice}>Preço: R$ 4,35/L</Text>
                </View>
                <Text style={s.discountBadgeText}>-R$ 0,10/L</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={s.discountsConfirmBtn} onPress={() => setSelectedStationForDiscounts(null)}>
              <Text style={s.discountsConfirmText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  sectionLabel: {
    fontSize: 11, color: PV.gray, fontWeight: '600',
    letterSpacing: 0.3, marginBottom: 12,
  },
  routeOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  routeSheet: {
    backgroundColor: '#fff', borderRadius: 18,
    padding: 20, width: SW * 0.82,
  },
  routeHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 18,
  },
  routeTitle: {
    fontSize: 14, fontWeight: '700', color: PV.navy,
    flex: 1, marginRight: 8, lineHeight: 20,
  },
  routeClose: { fontSize: 16, color: PV.grayLight, fontWeight: '700' },
  wazeBtn: {
    backgroundColor: '#00c0e8', borderRadius: 28,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', height: 50, gap: 8, marginBottom: 10,
  },
  wazeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  mapsBtn: {
    backgroundColor: '#fff', borderRadius: 28,
    borderWidth: 1.5, borderColor: PV.border,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', height: 50, gap: 8,
  },
  mapsBtnText: { fontSize: 15, fontWeight: '600', color: PV.navy },
  discountsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  discountsSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  discountsHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#dde2ea',
    alignSelf: 'center',
    marginBottom: 20,
  },
  discountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  discountsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: PV.navy,
  },
  discountsSub: {
    fontSize: 12,
    color: PV.gray,
    marginTop: 2,
  },
  discountsCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PV.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountsCloseText: {
    fontSize: 11,
    color: PV.gray,
    fontWeight: '700',
  },
  discountsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: PV.gray,
    marginBottom: 14,
  },
  discountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PV.offWhite,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  discountIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PV.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountFuel: {
    fontSize: 13,
    fontWeight: '700',
    color: PV.navy,
    marginBottom: 2,
  },
  discountPrice: {
    fontSize: 11,
    color: PV.gray,
  },
  discountBadgeText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '700',
  },
  discountsConfirmBtn: {
    backgroundColor: PV.navy,
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  discountsConfirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
