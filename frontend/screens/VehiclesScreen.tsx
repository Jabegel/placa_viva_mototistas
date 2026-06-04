import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Modal, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, type Vehicle } from '../context/UserContext';
import { Icon, MenuBottomNav, UserNavyHeader, PV } from '../components/PlacaVivaUI';

// Tipos de veículo → ícone Ionicons correspondente
type VehicleKind = 'car' | 'suv' | 'truck' | 'motorcycle' | 'van';

const KIND_ICON: Record<VehicleKind, any> = {
  car:        'car-outline',
  suv:        'car-sport-outline',
  truck:      'bus-outline',       // Ionicons não tem truck; bus-outline é o mais próximo
  motorcycle: 'bicycle-outline',
  van:        'car-outline',
};

export default function VehiclesScreen({ navigation }: any) {
  const { user, vehicles, setVehicles } = useUser();
  const [removeTarget, setRemoveTarget] = useState<Vehicle | null>(null);

  const confirmRemove = () => {
    if (!removeTarget) return;
    setVehicles(vehicles.filter(x => x.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={PV.navy} />
      <UserNavyHeader onBack={() => navigation.goBack()} userName={user.name} navigation={navigation} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <Text style={s.sectionTitle}>Veículos Cadastrados</Text>

        <TouchableOpacity style={s.addBtn} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleDetail', { isNew: true })}>
          <Text style={s.addBtnText}>Cadastrar Novo Veículo</Text>
          <Icon name="add-circle-outline" size={22} color={PV.navy} />
        </TouchableOpacity>

        {vehicles.map(v => (
          <View key={v.id} style={s.card}>

          {/* Thumbnail do veículo — só exibe, edição no detalhe */}
            <View style={s.carImageBox}>
              {v.photo ? (
                <Image source={{ uri: v.photo }} style={s.carPhoto} />
              ) : (
                <Icon name={KIND_ICON[v.kind]} size={28} color={PV.navy} />
              )}
              {v.hasAlert && (
                <View style={s.alertDot}><Text style={s.alertDotText}>!</Text></View>
              )}
            </View>

            {/* Info + navegação para detalhe */}
            <TouchableOpacity
              style={s.cardInfo}
              onPress={() => navigation.navigate('VehicleDetail', { vehicle: v })}
              activeOpacity={0.75}
            >
              {v.model ? <Text style={s.cardModel}>{v.model}</Text> : null}
              <Text style={s.cardPlate}>{v.plate}</Text>
              <View style={s.fuelRow}>
                <View style={[s.fuelDot, { backgroundColor: v.fuelColor }]} />
                <Text style={s.fuelText}>{v.fuelType}</Text>
              </View>
            </TouchableOpacity>

            <Text style={s.chevron}>›</Text>
          </View>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>

      <MenuBottomNav navigation={navigation} />

      {/* Modal descadastrar */}
      <Modal visible={!!removeTarget} transparent animationType="fade" onRequestClose={() => setRemoveTarget(null)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalText}>Deseja realmente descadastrar?{'\n'}Se quiser ter esse veículo no futuro,{'\n'}deverá cadastrá-lo novamente.</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, s.btnNo]} onPress={() => setRemoveTarget(null)}>
                <Text style={s.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, s.btnYes]} onPress={confirmRemove}>
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
  content: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: PV.navy, marginBottom: 14 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12,
    borderWidth: 1.5, borderColor: PV.border, borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 14, color: PV.navy, fontWeight: '600' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  carImageBox: {
    width: 64, height: 54, backgroundColor: '#f0f2f5', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative',
    overflow: 'hidden',
  },
  carPhoto: { width: '100%', height: '100%', borderRadius: 10 },
  cameraBtn: {
    position: 'absolute', bottom: 3, right: 3,
    backgroundColor: PV.navy, width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  alertDot: {
    position: 'absolute', top: -4, left: -4,
    backgroundColor: '#e74c3c', width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
  },
  alertDotText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  cardInfo: { flex: 1 },
  cardModel: { fontSize: 14, fontWeight: '700', color: PV.navy },
  cardPlate: { fontSize: 13, color: PV.navy, fontWeight: '600', marginTop: 1 },
  fuelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  fuelDot: { width: 8, height: 8, borderRadius: 4 },
  fuelText: { fontSize: 11, color: PV.gray },
  chevron: { fontSize: 22, color: '#bbb' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 22, width: '78%', alignItems: 'center' },
  modalText: { fontSize: 13, color: PV.navy, textAlign: 'center', lineHeight: 21, marginBottom: 18 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, height: 40, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnNo: { backgroundColor: '#e74c3c' },
  btnYes: { backgroundColor: '#27ae60' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
