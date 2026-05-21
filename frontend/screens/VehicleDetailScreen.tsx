import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, StatusBar, Platform, Modal, Alert,
} from 'react-native';

const NAVY = '#1a2e4a';

const FUEL_OPTIONS = [
  { id: 'gasolina-comum',    label: 'Gasolina Comum',    icon: '⛽', color: '#e8820c' },
  { id: 'gasolina-aditivada',label: 'Gasolina Aditivada', icon: '⛽', color: '#c8a832' },
  { id: 'gasolina-premium',  label: 'Gasolina Premium',   icon: '⛽', color: '#e74c3c' },
  { id: 'etanol-comum',      label: 'Etanol Comum',       icon: '🌿', color: '#27ae60' },
  { id: 'etanol-aditivado',  label: 'Etanol Aditivado',   icon: '🌿', color: '#2ecc71' },
  { id: 'diesel-s500-comum', label: 'Diesel S500 Comum',  icon: '⛽', color: '#7f8c8d', danger: true },
  { id: 'diesel-s500-aditivado', label: 'Diesel S500 Aditivado', icon: '⛽', color: '#95a5a6' },
  { id: 'diesel-s10-comum',  label: 'Diesel S10 Comum',   icon: '⛽', color: '#7f8c8d' },
  { id: 'diesel-s10-aditivado',  label: 'Diesel S10 Aditivado', icon: '⛽', color: '#95a5a6' },
];

export default function VehicleDetailScreen({ route, navigation }: any) {
  const { vehicle } = route?.params || {
    vehicle: { id: 'v2', plate: 'ABC-1D23', model: 'Nivus', fuelType: 'Gasolina Aditivada', image: '🚙' },
  };

  const [plate, setPlate] = useState(vehicle.plate || '');
  const [selectedFuel, setSelectedFuel] = useState(
    FUEL_OPTIONS.find(f => f.label === vehicle.fuelType)?.id || 'gasolina-aditivada'
  );
  const [fuelModalVisible, setFuelModalVisible] = useState(false);
  const [pendingFuel, setPendingFuel] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentFuel = FUEL_OPTIONS.find(f => f.id === selectedFuel);

  const handleFuelSelect = (fuelId: string) => {
    setPendingFuel(fuelId);
    setFuelModalVisible(false);
    setConfirmModal(true);
  };

  const confirmFuelChange = () => {
    if (pendingFuel) setSelectedFuel(pendingFuel);
    setPendingFuel(null);
    setConfirmModal(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    Alert.alert('Sucesso', 'Veículo atualizado!');
    navigation.goBack();
  };

  const handleRemove = () => {
    setRemoveModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados do Veículo</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Imagem do veículo */}
        <View style={styles.vehicleImageSection}>
          <View style={styles.vehicleImageBox}>
            <Text style={{ fontSize: 56 }}>{vehicle.image}</Text>
            <TouchableOpacity style={styles.imageEditBadge}>
              <Text style={{ fontSize: 12 }}>✏️</Text>
            </TouchableOpacity>
          </View>
          {vehicle.model ? <Text style={styles.vehicleModelLabel}>{vehicle.model}</Text> : null}
        </View>

        {/* Placa visual */}
        <View style={styles.platePreview}>
          <View style={styles.plateHeader}>
            <Text style={styles.plateHeaderText}>PLACA VIVA</Text>
            <View style={styles.plateHeaderIcon}>
              <View style={styles.barChart}>
                <View style={[styles.bar, { height: 4, backgroundColor: NAVY }]} />
                <View style={[styles.bar, { height: 7, backgroundColor: NAVY }]} />
                <View style={[styles.bar, { height: 5, backgroundColor: NAVY }]} />
              </View>
            </View>
          </View>
          <Text style={styles.plateNumber}>{plate || 'ABC-1D23'}</Text>
        </View>

        {/* Campo nome do veículo */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nome do Veículo</Text>
          <TextInput
            style={styles.input}
            value={vehicle.model}
            placeholder="Ex: Nivus"
            placeholderTextColor="#bbb"
          />
        </View>

        {/* Campo Placa */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Placa</Text>
          <TextInput
            style={styles.input}
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
            placeholder="ABC-1D23"
            placeholderTextColor="#bbb"
            maxLength={8}
          />
        </View>

        {/* Combustível preferido */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Combustível Preferido</Text>
          <TouchableOpacity style={styles.fuelSelector} onPress={() => setFuelModalVisible(true)} activeOpacity={0.8}>
            <Text style={{ fontSize: 16 }}>{currentFuel?.icon}</Text>
            <Text style={[styles.fuelSelectorText, { color: currentFuel?.color }]}>
              {currentFuel?.label}
            </Text>
            <Text style={styles.fuelChevron}>⌄</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeButton} onPress={() => setRemoveModal(true)} activeOpacity={0.8}>
          <Text style={styles.removeButtonText}>Descadastrar</Text>
        </TouchableOpacity>

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

      {/* ── Modal: Alterar Combustível ── */}
      <Modal visible={fuelModalVisible} transparent animationType="slide" onRequestClose={() => setFuelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.fuelSheet}>
            <View style={styles.fuelSheetHeader}>
              <Text style={styles.fuelSheetTitle}>Combustível Preferido</Text>
              <TouchableOpacity onPress={() => setFuelModalVisible(false)}>
                <Text style={styles.fuelSheetClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FUEL_OPTIONS.map(fuel => (
                <TouchableOpacity
                  key={fuel.id}
                  style={[
                    styles.fuelOption,
                    fuel.id === selectedFuel && styles.fuelOptionActive,
                    (fuel as any).danger && styles.fuelOptionDanger,
                  ]}
                  onPress={() => handleFuelSelect(fuel.id)}
                  activeOpacity={0.75}
                >
                  <Text style={{ fontSize: 16, marginRight: 10 }}>{fuel.icon}</Text>
                  <Text style={[
                    styles.fuelOptionText,
                    fuel.id === selectedFuel && styles.fuelOptionTextActive,
                    (fuel as any).danger && styles.fuelOptionTextDanger,
                  ]}>
                    {fuel.label}
                  </Text>
                  {fuel.id === selectedFuel && <Text style={styles.fuelCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Confirmação de Combustível ── */}
      <Modal visible={confirmModal} transparent animationType="fade" onRequestClose={() => setConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>
              Deseja realmente alterar a{'\n'}lista de combustível preferido?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnNo]} onPress={() => { setPendingFuel(null); setConfirmModal(false); }}>
                <Text style={styles.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnYes]} onPress={confirmFuelChange}>
                <Text style={styles.btnText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Confirmação Descadastrar ── */}
      <Modal visible={removeModal} transparent animationType="fade" onRequestClose={() => setRemoveModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>
              Deseja realmente descadastrar?{'\n'}Se "Sim" este veículo no futuro{'\n'}precisará cadastrar novamente.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnNo]} onPress={() => setRemoveModal(false)}>
                <Text style={styles.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.btnYes]} onPress={handleRemove}>
                <Text style={styles.btnText}>Sim</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 24 },

  vehicleImageSection: { alignItems: 'center', marginBottom: 16 },
  vehicleImageBox: { position: 'relative', width: 110, height: 90, alignItems: 'center', justifyContent: 'center' },
  imageEditBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: NAVY, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  vehicleModelLabel: { fontSize: 16, fontWeight: '700', color: NAVY, marginTop: 4 },

  platePreview: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 3, borderColor: NAVY, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', alignSelf: 'center', minWidth: 200, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  plateHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  plateHeaderText: { fontSize: 10, fontWeight: '800', color: NAVY, letterSpacing: 1 },
  plateHeaderIcon: { backgroundColor: NAVY, borderRadius: 3, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, borderRadius: 1 },
  plateNumber: { fontSize: 28, fontWeight: '900', color: NAVY, letterSpacing: 4, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: '#7a8a9a', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde2ea', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: NAVY },
  fuelSelector: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde2ea', paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  fuelSelectorText: { flex: 1, fontSize: 14, fontWeight: '600' },
  fuelChevron: { fontSize: 16, color: '#aab0bc' },

  saveButton: { backgroundColor: NAVY, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  removeButton: { backgroundColor: '#fff', borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1.5, borderColor: '#e74c3c' },
  removeButtonText: { color: '#e74c3c', fontSize: 15, fontWeight: '700' },

  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },

  // Modal combustível
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  fuelSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 24, maxHeight: '80%' },
  fuelSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fuelSheetTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  fuelSheetClose: { fontSize: 18, color: '#aab0bc', fontWeight: '700' },
  fuelOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, marginBottom: 6, backgroundColor: '#f5f6f8' },
  fuelOptionActive: { backgroundColor: NAVY },
  fuelOptionDanger: { backgroundColor: '#fff0f0' },
  fuelOptionText: { flex: 1, fontSize: 14, fontWeight: '600', color: NAVY },
  fuelOptionTextActive: { color: '#fff' },
  fuelOptionTextDanger: { color: '#e74c3c' },
  fuelCheck: { fontSize: 16, color: '#fff', fontWeight: '800' },

  // Modal confirmação
  confirmModal: { backgroundColor: '#fff', borderRadius: 16, padding: 24, marginHorizontal: 40, marginBottom: 240 },
  confirmText: { fontSize: 13, color: NAVY, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  confirmButtons: { flexDirection: 'row', gap: 12 },
  confirmBtn: { flex: 1, height: 42, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnNo: { backgroundColor: '#e74c3c' },
  btnYes: { backgroundColor: '#27ae60' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
