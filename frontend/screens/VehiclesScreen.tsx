import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, StatusBar, Platform, Modal,
} from 'react-native';

const NAVY = '#1a2e4a';

type Vehicle = {
  id: string;
  plate: string;
  model: string;
  fuelType: string;
  hasAlert?: boolean;
  image: string;
};

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', plate: 'ABC-1D23', model: '',        fuelType: 'Ñ',              hasAlert: true, image: '🚗' },
  { id: 'v2', plate: 'ABC-1D23', model: 'Nivus',   fuelType: 'Gasolina Aditivada', image: '🚙' },
  { id: 'v3', plate: 'CBA-1D23', model: 'Jeep Compass', fuelType: 'Etanol Comum', image: '🚐' },
];

export default function VehiclesScreen({ navigation }: any) {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [removeTarget, setRemoveTarget] = useState<Vehicle | null>(null);

  const confirmRemove = () => {
    if (!removeTarget) return;
    setVehicles(v => v.filter(x => x.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Veículos Cadastrados</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Botão Cadastrar Novo */}
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
          <View style={styles.addLogoBox}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 5 }]} />
              <View style={[styles.bar, { height: 9 }]} />
              <View style={[styles.bar, { height: 7 }]} />
            </View>
          </View>
          <Text style={styles.addText}>Cadastrar Novo Veículo</Text>
          <Text style={styles.addPlus}>＋</Text>
        </TouchableOpacity>

        {/* Lista de veículos */}
        {vehicles.map(vehicle => (
          <TouchableOpacity
            key={vehicle.id}
            style={styles.vehicleCard}
            onPress={() => navigation.navigate('VehicleDetail', { vehicle })}
            activeOpacity={0.8}
          >
            <View style={styles.vehicleImageBox}>
              <Text style={{ fontSize: 32 }}>{vehicle.image}</Text>
              {vehicle.hasAlert && (
                <View style={styles.alertDot}>
                  <Text style={{ fontSize: 10, color: '#fff' }}>!</Text>
                </View>
              )}
            </View>
            <View style={styles.vehicleInfo}>
              {vehicle.model ? (
                <Text style={styles.vehicleModel}>{vehicle.model}</Text>
              ) : null}
              <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
              <Text style={styles.vehicleFuel}>{vehicle.fuelType}</Text>
            </View>
            <Text style={styles.vehicleChevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons',    onPress: () => navigation.navigate('Coupons') },
          { icon: '📍', label: 'Mapa',      onPress: () => {} },
          { icon: '❤️', label: 'LifeStyle', onPress: () => navigation.navigate('Lifestyle') },
          { icon: '↗️', label: 'Indicar',   onPress: () => navigation.navigate('Share') },
          { icon: '☰', label: 'Menu',      onPress: () => navigation.navigate('Profile'), active: true },
        ].map((item: any) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal Descadastrar */}
      <Modal visible={!!removeTarget} transparent animationType="fade" onRequestClose={() => setRemoveTarget(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>
              Deseja realmente descadastrar?{'\n'}Se "Sim" este veículo no futuro{'\n'}precisará cadastrar novamente.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnNo]} onPress={() => setRemoveTarget(null)}>
                <Text style={styles.btnNoText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnYes]} onPress={confirmRemove}>
                <Text style={styles.btnYesText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: NAVY, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, backgroundColor: '#fff', borderRadius: 1 },

  // Botão adicionar
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, borderRadius: 12, padding: 14, marginBottom: 16, gap: 10 },
  addLogoBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  addText: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 14 },
  addPlus: { color: '#fff', fontSize: 22, fontWeight: '300' },

  // Cards de veículo
  vehicleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  vehicleImageBox: { width: 60, height: 48, alignItems: 'center', justifyContent: 'center', position: 'relative', marginRight: 12 },
  alertDot: { position: 'absolute', top: 0, right: 0, backgroundColor: '#e74c3c', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  vehicleInfo: { flex: 1 },
  vehicleModel: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 2 },
  vehiclePlate: { fontSize: 13, color: NAVY, fontWeight: '600' },
  vehicleFuel: { fontSize: 11, color: '#7a8a9a', marginTop: 2 },
  vehicleChevron: { fontSize: 22, color: '#bbb' },

  // Bottom Nav
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  confirmModal: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '78%', alignItems: 'center' },
  confirmText: { fontSize: 13, color: NAVY, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  confirmButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmBtn: { flex: 1, height: 42, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnNo: { backgroundColor: '#e74c3c' },
  btnYes: { backgroundColor: '#27ae60' },
  btnNoText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnYesText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
