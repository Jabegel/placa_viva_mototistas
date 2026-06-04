import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Platform, Modal, Alert, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, Vehicle, VehicleKind } from '../context/UserContext';
import { Icon, MenuBottomNav, UserNavyHeader, PlateCard, PV } from '../components/PlacaVivaUI';

// Grade de ícones minimalistas disponíveis para o veículo
const VEHICLE_ICONS = [
  { icon: 'car-outline',       label: 'Hatch' },
  { icon: 'car-sport-outline', label: 'SUV' },
  { icon: 'bus-outline',       label: 'Caminhão' },
  { icon: 'bicycle-outline',   label: 'Moto' },
] as { icon: any; label: string }[];

const ICON_COLORS = [
  { id: 'navy',   value: PV.navy },
  { id: 'orange', value: '#e8820c' },
  { id: 'green',  value: '#27ae60' },
  { id: 'red',    value: '#e74c3c' },
  { id: 'blue',   value: '#2d6a8a' },
  { id: 'gray',   value: '#7f8c8d' },
];

const FUEL_OPTIONS = [
  { id: 'gasolina-comum',        label: 'Gasolina Comum',      icon: '⛽', color: '#e8820c', warn: false },
  { id: 'gasolina-aditivada',    label: 'Gasolina Aditivada',  icon: '⛽', color: '#c8a832', warn: false },
  { id: 'gasolina-premium',      label: 'Gasolina Premium',    icon: '⛽', color: '#e74c3c', warn: false },
  { id: 'etanol-comum',          label: 'Etanol Comum',        icon: '🌿', color: '#27ae60', warn: false },
  { id: 'etanol-aditivado',      label: 'Etanol Aditivado',    icon: '🌿', color: '#2ecc71', warn: false },
  { id: 'diesel-s500-comum',     label: 'Diesel S500 Comum',   icon: '⛽', color: '#e74c3c', warn: true  },
  { id: 'diesel-s500-aditivado', label: 'Diesel S500 Aditivado',icon: '⛽', color: '#7f8c8d', warn: false },
  { id: 'diesel-s10-comum',      label: 'Diesel S10 Comum',    icon: '⛽', color: '#7f8c8d', warn: false },
  { id: 'diesel-s10-aditivado',  label: 'Diesel S10 Aditivado',icon: '⛽', color: '#95a5a6', warn: false },
];

const getKindFromIcon = (iconName: string): VehicleKind => {
  if (iconName === 'car-sport-outline') return 'suv';
  if (iconName === 'bus-outline') return 'truck';
  if (iconName === 'bicycle-outline') return 'motorcycle';
  return 'car';
};

export default function VehicleDetailScreen({ route, navigation }: any) {
  const { user, vehicles, setVehicles, updateVehicle } = useUser();
  const isNew = route?.params?.isNew ?? !route?.params?.vehicle;
  const vehicle = route?.params?.vehicle;

  const [plate, setPlate] = useState(vehicle?.plate || '');
  const [modelName, setModelName] = useState(vehicle?.model || '');
  const [photo, setPhoto] = useState<string | undefined>(vehicle?.photo);
  const [vehicleIcon, setVehicleIcon] = useState<string>(vehicle?.iconName || 'car-outline');
  const [iconColor, setIconColor] = useState<string>(vehicle?.iconColor || PV.navy);
  const [iconEditModal, setIconEditModal] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState(
    vehicle ? (FUEL_OPTIONS.find(f => f.label === vehicle.fuelType)?.id || 'gasolina-aditivada') : 'gasolina-comum'
  );
  const [fuelModal, setFuelModal] = useState(false);
  const [pendingFuel, setPendingFuel] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentFuel = FUEL_OPTIONS.find(f => f.id === selectedFuel)!;

  const handleFuelSelect = (id: string) => {
    setPendingFuel(id);
    setFuelModal(false);
    setConfirmModal(true);
  };

  const confirmFuelChange = () => {
    if (pendingFuel) setSelectedFuel(pendingFuel);
    setPendingFuel(null);
    setConfirmModal(false);
  };

  const pickPhoto = async () => {
    setIconEditModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!plate.trim()) {
      Alert.alert('Erro', 'Por favor, informe a placa do veículo.');
      return;
    }

    setSaving(true);
    await new Promise(r => setTimeout(r, 600));

    if (isNew) {
      const newVehicle: Vehicle = {
        id: 'v_' + Date.now(),
        plate,
        model: modelName,
        photo,
        iconName: vehicleIcon,
        iconColor,
        kind: getKindFromIcon(vehicleIcon),
        fuelType: FUEL_OPTIONS.find(f => f.id === selectedFuel)?.label || 'Não definido',
        fuelColor: FUEL_OPTIONS.find(f => f.id === selectedFuel)?.color || '#aab0bc',
      };
      setVehicles([...vehicles, newVehicle]);
      setSaving(false);
      Alert.alert('✓', 'Veículo cadastrado com sucesso!');
    } else {
      updateVehicle(vehicle.id, {
        plate,
        model: modelName,
        photo,
        iconName: vehicleIcon,
        iconColor,
        kind: getKindFromIcon(vehicleIcon),
        fuelType: FUEL_OPTIONS.find(f => f.id === selectedFuel)?.label || selectedFuel,
        fuelColor: FUEL_OPTIONS.find(f => f.id === selectedFuel)?.color || vehicle.fuelColor,
      });
      setSaving(false);
      Alert.alert('✓', 'Veículo atualizado!');
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={PV.navy} />
      <UserNavyHeader onBack={() => navigation.goBack()} userName={user.name} navigation={navigation} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>{isNew ? 'Cadastrar Novo Veículo' : 'Dados do Veículo'}</Text>

        {/* Círculo do veículo — toque abre modal de edição */}
        <View style={s.carSection}>
          <TouchableOpacity style={s.carCircle} onPress={() => setIconEditModal(true)} activeOpacity={0.8}>
            {photo ? (
              <Image source={{ uri: photo }} style={s.carPhoto} />
            ) : (
              <Icon name={vehicleIcon as any} size={46} color={iconColor} />
            )}
            <View style={s.carEditBtn}>
              <Icon name="camera-outline" size={11} color="#fff" />
            </View>
          </TouchableOpacity>
          {modelName ? <Text style={s.carModel}>{modelName}</Text> : null}
        </View>

        {/* Placa visual */}
        <PlateCard plate={plate} style={{ marginBottom: 22 }} />

        {/* Nome do veículo */}
        <View style={s.field}>
          <Text style={s.label}>Nome do Veículo</Text>
          <TextInput style={s.input} value={modelName} onChangeText={setModelName}
            placeholder="Ex: Nivus" placeholderTextColor="#bbb" />
        </View>

        {/* Placa */}
        <View style={s.field}>
          <Text style={s.label}>Placa</Text>
          <TextInput style={s.input} value={plate} onChangeText={setPlate}
            autoCapitalize="characters" placeholder="ABC-1D23"
            placeholderTextColor="#bbb" maxLength={8} />
        </View>

        {/* Combustível preferido */}
        <View style={s.field}>
          <Text style={s.label}>Combustível Preferido</Text>
          <TouchableOpacity style={s.fuelSelector} onPress={() => setFuelModal(true)} activeOpacity={0.8}>
            <View style={[s.fuelDot, { backgroundColor: currentFuel.color }]} />
            <Text style={[s.fuelSelectorText, { color: currentFuel.color }]}>{currentFuel.label}</Text>
            <Text style={s.fuelChev}>⌄</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[s.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave} disabled={saving}>
          <Text style={s.saveBtnText}>{saving ? 'Salvando...' : isNew ? 'Cadastrar' : 'Salvar'}</Text>
        </TouchableOpacity>

        {!isNew && (
          <TouchableOpacity style={s.removeBtn} onPress={() => setRemoveModal(true)}>
            <Text style={s.removeBtnText}>Descadastrar</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <MenuBottomNav navigation={navigation} />

      {/* ── Modal: Alterar Combustível ── */}
      <Modal visible={fuelModal} transparent animationType="slide" onRequestClose={() => setFuelModal(false)}>
        <View style={s.sheetOverlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Combustível Preferido</Text>
              <TouchableOpacity onPress={() => setFuelModal(false)}>
                <Text style={s.sheetClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FUEL_OPTIONS.map(fuel => (
                <TouchableOpacity
                  key={fuel.id}
                  style={[s.fuelOption, fuel.id === selectedFuel && s.fuelOptionActive]}
                  onPress={() => handleFuelSelect(fuel.id)}
                >
                  {/* Ícone colorido da bomba */}
                  <View style={[s.fuelIconBox, { backgroundColor: fuel.color + '22' }]}>
                    <Text style={{ fontSize: 14 }}>{fuel.icon}</Text>
                  </View>
                  <Text style={[
                    s.fuelOptionText,
                    fuel.id === selectedFuel && s.fuelOptionTextActive,
                    fuel.warn && s.fuelOptionWarn,
                  ]}>{fuel.label}</Text>
                  {fuel.id === selectedFuel && <Text style={s.fuelCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* ── Modal: Editar imagem do veículo ── */}
      <Modal visible={iconEditModal} transparent animationType="slide" onRequestClose={() => setIconEditModal(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setIconEditModal(false)}>
          <View style={s.iconSheet}>
            <View style={s.sheetHandle} />
            <Text style={s.iconSheetTitle}>Imagem do Veículo</Text>

            {/* Linha de ações: câmera | ícone */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.actionBtn} onPress={pickPhoto}>
                <View style={[s.actionIconBox, { backgroundColor: PV.navy }]}>
                  <Icon name="camera-outline" size={24} color="#fff" />
                </View>
                <Text style={s.actionLabel}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionBtn} onPress={() => setPhoto(undefined)}>
                <View style={[s.actionIconBox, { backgroundColor: '#f0f2f5' }]}>
                  <Icon name="color-palette-outline" size={24} color={PV.navy} />
                </View>
                <Text style={s.actionLabel}>Usar Ícone</Text>
              </TouchableOpacity>
            </View>

            {/* Grade de tipos de veículo */}
            <Text style={s.gridSectionLabel}>Tipo de veículo</Text>
            <View style={s.iconGrid}>
              {VEHICLE_ICONS.map(opt => (
                <TouchableOpacity
                  key={opt.icon}
                  style={[s.iconCell, vehicleIcon === opt.icon && s.iconCellActive]}
                  onPress={() => { setVehicleIcon(opt.icon); setPhoto(undefined); }}
                >
                  <Icon name={opt.icon} size={28} color={vehicleIcon === opt.icon ? '#fff' : PV.navy} />
                  <Text style={[s.iconCellLabel, vehicleIcon === opt.icon && { color: '#fff' }]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Paleta de cores do ícone */}
            <Text style={s.gridSectionLabel}>Cor</Text>
            <View style={s.colorRow}>
              {ICON_COLORS.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[s.colorDot, { backgroundColor: c.value }, iconColor === c.value && s.colorDotActive]}
                  onPress={() => setIconColor(c.value)}
                />
              ))}
            </View>

            <TouchableOpacity style={s.sheetDoneBtn} onPress={() => setIconEditModal(false)}>
              <Text style={s.sheetDoneBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal: Confirmar troca de combustível ── */}
      <Modal visible={confirmModal} transparent animationType="fade" onRequestClose={() => setConfirmModal(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalText}>Deseja realmente alterar o{'\n'}tipo de combustível preferido?</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, s.btnNo]} onPress={() => { setPendingFuel(null); setConfirmModal(false); }}>
                <Text style={s.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, s.btnYes]} onPress={confirmFuelChange}>
                <Text style={s.btnText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: Confirmar descadastro ── */}
      <Modal visible={removeModal} transparent animationType="fade" onRequestClose={() => setRemoveModal(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalText}>Deseja realmente descadastrar?{'\n'}Se quiser ter esse veículo no futuro,{'\n'}deverá cadastrá-lo novamente.</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, s.btnNo]} onPress={() => setRemoveModal(false)}>
                <Text style={s.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, s.btnYes]} onPress={() => {
                setRemoveModal(false);
                if (vehicle) {
                  setVehicles(vehicles.filter(x => x.id !== vehicle.id));
                }
                navigation.goBack();
              }}>
                <Text style={s.btnText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6f8' },
  content: { paddingHorizontal: 18, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: PV.navy, marginBottom: 16 },
  carSection: { alignItems: 'center', marginBottom: 16 },
  carCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e8edf3', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: PV.border, position: 'relative', overflow: 'hidden' },
  carPhoto: { width: '100%', height: '100%', borderRadius: 50 },
  carEditBtn: { position: 'absolute', bottom: 2, right: 2, backgroundColor: PV.navy, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  carModel: { fontSize: 16, fontWeight: '700', color: PV.navy, marginTop: 8 },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: PV.gray, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, color: PV.navy },
  fuelSelector: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 13, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 8 },
  fuelDot: { width: 10, height: 10, borderRadius: 5 },
  fuelSelectorText: { flex: 1, fontSize: 14, fontWeight: '600' },
  fuelChev: { fontSize: 16, color: PV.grayLight },
  saveBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 6, shadowColor: PV.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  removeBtn: { backgroundColor: '#fff', borderRadius: 30, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1.5, borderColor: '#e74c3c' },
  removeBtnText: { color: '#e74c3c', fontSize: 15, fontWeight: '700' },
  // Sheet combustível
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, paddingBottom: Platform.OS === 'ios' ? 44 : 22, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 15, fontWeight: '800', color: PV.navy },
  sheetClose: { fontSize: 18, color: PV.grayLight, fontWeight: '700' },
  fuelOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6, backgroundColor: '#f5f6f8', gap: 10 },
  fuelOptionActive: { backgroundColor: PV.navy },
  fuelIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  fuelOptionText: { flex: 1, fontSize: 14, fontWeight: '600', color: PV.navy },
  fuelOptionTextActive: { color: '#fff' },
  fuelOptionWarn: { color: '#e74c3c' },
  fuelCheck: { fontSize: 15, color: '#fff', fontWeight: '800' },
  // Modals
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 22, width: '78%', alignItems: 'center' },
  modalText: { fontSize: 13, color: PV.navy, textAlign: 'center', lineHeight: 21, marginBottom: 18 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, height: 40, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnNo: { backgroundColor: '#e74c3c' },
  btnYes: { backgroundColor: '#27ae60' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  iconSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: Platform.OS === 'ios' ? 40 : 28 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#dde2ea', alignSelf: 'center', marginBottom: 16 },
  iconSheetTitle: { fontSize: 17, fontWeight: '800', color: PV.navy, textAlign: 'center', marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 22 },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIconBox: { width: 58, height: 58, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 12, color: PV.gray, fontWeight: '600' },
  gridSectionLabel: { fontSize: 12, fontWeight: '700', color: PV.gray, marginBottom: 10 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  iconCell: { flex: 1, minWidth: '22%', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#f0f2f5', gap: 6 },
  iconCellActive: { backgroundColor: PV.navy },
  iconCellLabel: { fontSize: 10, color: PV.navy, fontWeight: '600' },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotActive: { borderWidth: 3, borderColor: PV.navy },
  sheetDoneBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 50, alignItems: 'center', justifyContent: 'center' },
  sheetDoneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
