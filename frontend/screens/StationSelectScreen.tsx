import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

const NAVY = '#1a2e4a';
const API_URL = 'http://192.168.0.5:8080';

type Station = {
  id: string;
  name: string;
  brand: string;
};

// Dados mock — em produção virão do GET /stations?city=brasilia
const MOCK_STATIONS: Station[] = [
  { id: 'posto-103-sul', name: 'Posto 103 Sul', brand: 'Petrobras' },
  { id: 'posto-203-norte', name: 'Posto 203 Norte', brand: 'Petrobras' },
  { id: 'posto-214-sul', name: 'Posto 214 Sul', brand: 'Petrobras' },
];

export default function StationSelectScreen({ route, navigation }: any) {
  const { city } = route.params;
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch(`${API_URL}/stations?city=${city.id}`);
      if (response.ok) {
        const data = await response.json();
        setStations(data.stations);
      } else {
        setStations(MOCK_STATIONS);
      }
    } catch {
      // Fallback para mock em desenvolvimento
      setStations(MOCK_STATIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (station: Station) => {
    setSelected(station.id);
    setTimeout(() => {
      navigation.navigate('Coupons', { city, station });
    }, 150);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoPlaca}>PLACA </Text>
        <Text style={styles.logoViva}>VIVA</Text>
        <View style={styles.logoIcon}>
          <View style={styles.barChart}>
            <View style={[styles.bar, { height: 6 }]} />
            <View style={[styles.bar, { height: 11 }]} />
            <View style={[styles.bar, { height: 8 }]} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seus descontos{'\n'}estão prontos</Text>
        <Text style={styles.subtitle}>Escolha o posto para começar</Text>

        {loading ? (
          <ActivityIndicator color={NAVY} style={{ marginTop: 40 }} />
        ) : (
          <>
            {stations.map((station) => {
              const isSelected = selected === station.id;
              return (
                <TouchableOpacity
                  key={station.id}
                  style={[styles.stationRow, isSelected && styles.stationRowSelected]}
                  onPress={() => handleSelect(station)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.fuelIcon, isSelected && styles.fuelIconSelected]}>
                    <Text style={{ fontSize: 14 }}>⛽</Text>
                  </View>
                  <View style={styles.stationInfo}>
                    <Text style={[styles.stationName, isSelected && styles.stationNameSelected]}>
                      {station.name}
                    </Text>
                    <Text style={[styles.stationBrand, isSelected && styles.stationBrandSelected]}>
                      {station.brand}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.hint}>Cada posto tem ofertas exclusivas</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: { marginRight: 12 },
  backArrow: { fontSize: 20, color: NAVY, fontWeight: '600' },
  logoPlaca: { fontSize: 18, fontWeight: '800', color: NAVY, letterSpacing: 1 },
  logoViva: { fontSize: 18, fontWeight: '900', color: NAVY, letterSpacing: 2 },
  logoIcon: {
    backgroundColor: NAVY,
    borderRadius: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, backgroundColor: '#fff', borderRadius: 1 },

  // Conteúdo
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: NAVY,
    lineHeight: 34,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#7a8a9a',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Item de posto
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  stationRowSelected: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  fuelIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  fuelIconSelected: { opacity: 1 },
  stationInfo: { flex: 1 },
  stationName: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
  stationNameSelected: { color: '#fff' },
  stationBrand: {
    fontSize: 12,
    color: '#7a8a9a',
    marginTop: 2,
  },
  stationBrandSelected: { color: 'rgba(255,255,255,0.7)' },

  hint: {
    fontSize: 12,
    color: '#7a8a9a',
    textAlign: 'center',
    marginTop: 16,
  },
});
