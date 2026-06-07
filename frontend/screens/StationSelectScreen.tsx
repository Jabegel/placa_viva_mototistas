import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { Icon, WhiteHeader, BottomNav, PV } from '../components/PlacaVivaUI';

const API_URL = 'http://192.168.0.5:8080';

type Station = { id: string; name: string; brand: string; neighborhood?: string; };

const MOCK: Station[] = [
  { id: 'posto-103-sul',   name: 'Posto 103 Sul',   brand: 'Petrobras', neighborhood: 'Asa Sul' },
  { id: 'posto-203-norte', name: 'Posto 203 Norte', brand: 'Petrobras', neighborhood: 'Asa Norte' },
  { id: 'posto-214-sul',   name: 'Posto 214 Sul',   brand: 'Petrobras', neighborhood: 'Asa Sul' },
  { id: 'posto-312-norte', name: 'Posto 312 Norte', brand: 'Shell',     neighborhood: 'Asa Norte' },
  { id: 'posto-sudoeste',  name: 'Posto Sudoeste',  brand: 'Ipiranga',  neighborhood: 'Sudoeste' },
];

export default function StationSelectScreen({ route, navigation }: any) {
  const city = route?.params?.city || { id: 'brasilia', name: 'Brasília', state: 'DF' };
  const { user, setUser } = useUser();
  const [stations, setStations] = useState<Station[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/stations?city=${city.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setStations(d?.stations ?? MOCK))
      .catch(() => setStations(MOCK))
      .finally(() => setLoading(false));
  }, [city.id]);

  const handleSelect = (s: Station) => {
    setSelected(s.id);
    setTimeout(() => navigation.navigate('Coupons', { city, station: s }), 150);
  };

  const toggleFav = (s: Station) => {
    const isFav = user.favoriteStation === s.id;
    setUser({ favoriteStation: isFav ? '' : s.id });
    if (!isFav) Alert.alert('⭐ Posto Favorito', `"${s.name}" salvo como favorito!`);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <WhiteHeader onBack={() => navigation.navigate('CitySelect')} />

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Seus descontos{'\n'}estão prontos</Text>
        <Text style={s.sub}>Escolha o posto para começar</Text>
        <TouchableOpacity 
      style={{
        backgroundColor: '#1e3a5f',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        alignItems: 'center'
      }} 
      onPress={() => navigation.navigate('ProfitRoute')}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        Calcular Rota de Lucro (PRO)
      </Text>
    </TouchableOpacity>


        {loading
          ? <ActivityIndicator color={PV.navy} style={{ marginTop: 40 }} />
          : stations.map(station => {
              const isSelected = selected === station.id;
              const isFav = user.favoriteStation === station.id;
              return (
                <TouchableOpacity
                  key={station.id}
                  style={[s.row, isSelected && s.rowSelected]}
                  onPress={() => handleSelect(station)}
                  activeOpacity={0.75}
                >
                  {/* Ícone de bomba */}
                  <View style={[s.pumpBox, isSelected && s.pumpBoxActive]}>
                    <Icon name="car-outline" size={18} color={isSelected ? '#fff' : PV.gray} />
                  </View>

                  <View style={s.info}>
                    <Text style={[s.name, isSelected && s.nameSelected]}>{station.name}</Text>
                    <Text style={[s.brand, isSelected && s.brandSelected]}>{station.brand}</Text>
                  </View>

                  {/* Estrela favorito */}
                  <TouchableOpacity onPress={() => toggleFav(station)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={[s.star, isFav && s.starActive]}>{isFav ? '★' : '☆'}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
        }
        <Text style={s.hint}>Cada posto tem ofertas exclusivas</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: PV.navy, lineHeight: 34, marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 13, color: PV.gray, textAlign: 'center', marginBottom: 28 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PV.offWhite, borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 14,
    marginBottom: 10, borderWidth: 1.5, borderColor: 'transparent',
  },
  rowSelected: { backgroundColor: PV.navy, borderColor: PV.navy },
  pumpBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pumpBoxActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: PV.navy },
  nameSelected: { color: '#fff', fontWeight: '700' },
  brand: { fontSize: 12, color: PV.gray, marginTop: 2 },
  brandSelected: { color: 'rgba(255,255,255,0.7)' },
  star: { fontSize: 22, color: '#ccc', paddingLeft: 8 },
  starActive: { color: '#f5c518' },
  hint: { fontSize: 12, color: PV.gray, textAlign: 'center', marginTop: 16 },
});
