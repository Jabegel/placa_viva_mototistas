import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/PlacaVivaUI';

const NAVY = '#1a2e4a';

type City = {
  id: string;
  name: string;
  state: string;
};

const CITIES: { state: string; cities: City[] }[] = [
  {
    state: 'Distrito Federal',
    cities: [
      { id: 'brasilia', name: 'Brasília', state: 'DF' },
      { id: 'taguatinga', name: 'Taguatinga', state: 'DF' },
    ],
  },
  {
    state: 'Goiás',
    cities: [
      { id: 'abadiania', name: 'Abadiânia', state: 'GO' },
      { id: 'goiania', name: 'Goiânia', state: 'GO' },
      { id: 'luziania', name: 'Luziânia', state: 'GO' },
    ],
  },
];

export default function CitySelectScreen({ navigation }: any) {
  const [selected, setSelected] = useState<string>('brasilia');

  const handleSelect = (city: City) => {
    setSelected(city.id);
    // Pequeno delay para mostrar o feedback visual antes de navegar
    setTimeout(() => {
      navigation.navigate('StationSelect', { city });
    }, 150);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
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
        <Text style={styles.title}>Onde você quer{'\n'}economizar hoje?</Text>
        <Text style={styles.subtitle}>Toque na sua cidade para continuar</Text>

        {CITIES.map((group) => (
          <View key={group.state} style={styles.group}>
            <Text style={styles.stateLabel}>{group.state}</Text>
            {group.cities.map((city) => {
              const isSelected = selected === city.id;
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityRow, isSelected && styles.cityRowSelected]}
                  onPress={() => handleSelect(city)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.pinIcon, isSelected && styles.pinIconSelected]}>
                    <Icon
                      name={isSelected ? 'location' : 'location-outline'}
                      size={18}
                      color={isSelected ? '#fff' : NAVY}
                    />
                  </View>
                  <Text style={[styles.cityName, isSelected && styles.cityNameSelected]}>
                    {city.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  // Header com logo
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
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

  // Grupos por estado
  group: { marginBottom: 20 },
  stateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7a8a9a',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // Item de cidade
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cityRowSelected: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  pinIcon: { marginRight: 10 },
  pinIconSelected: {},
  cityName: {
    fontSize: 15,
    fontWeight: '500',
    color: NAVY,
  },
  cityNameSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});
