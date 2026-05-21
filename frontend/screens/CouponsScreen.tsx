import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Modal, TextInput, StatusBar, ImageBackground,
  Alert, Platform,
} from 'react-native';
import { getCoupons, type Coupon } from '../data/mockData';

const NAVY = '#1a2e4a';
const API_URL = 'http://192.168.0.5:8080';

export default function CouponsScreen({ route, navigation }: any) {
  const { city, station } = route?.params || {
    city: { name: 'Brasília', state: 'DF', id: 'brasilia' },
    station: { id: 'posto-214-sul', name: 'Posto 214 Sul', brand: 'Petrobras', neighborhood: 'Asa Sul' },
  };

  const coupons = getCoupons(station?.id);
  const [plate, setPlate] = useState('');
  const [savedPlate, setSavedPlate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatPlate = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 3) return cleaned;
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7);
  };

  const handleCouponPress = (coupon: Coupon) => {
    if (!savedPlate) {
      setModalVisible(true);
    } else {
      navigation.navigate('CouponDetail', { coupon, station, plate: savedPlate });
    }
  };

  const handleSavePlate = async () => {
    const raw = plate.replace('-', '');
    if (raw.length < 7) { Alert.alert('Atenção', 'Digite uma placa válida'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedPlate(plate);
    setModalVisible(false);
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

        {/* Hero */}
        <View style={styles.hero}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600' }}
            style={styles.heroBg}
            imageStyle={{ opacity: 0.45 }}
          >
            <View style={styles.heroHeader}>
              <View style={styles.logoRow}>
                <Text style={styles.logoPlaca}>PLACA </Text>
                <Text style={styles.logoViva}>VIVA</Text>
                <View style={styles.logoIcon}>
                  <View style={styles.barChart}>
                    <View style={[styles.bar, { height: 5 }]} />
                    <View style={[styles.bar, { height: 9 }]} />
                    <View style={[styles.bar, { height: 7 }]} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.stationBadge}>
              <View style={styles.stationLogo}><Text style={{ fontSize: 26 }}>⛽</Text></View>
              <View style={styles.petrobrasTag}>
                <Text style={styles.petrobrasText}>🟢 {station?.brand?.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.stationInfoCard}>
            <Text style={styles.stationName}>{station?.name?.toUpperCase()}</Text>
            <Text style={styles.stationLocation}>
              {city?.name?.toUpperCase()} – {station?.neighborhood?.toUpperCase() || 'ASA SUL'}
            </Text>
            <TouchableOpacity style={styles.goToStation}>
              <Text style={styles.pinEmoji}>📍</Text>
              <Text style={styles.goToText}>Vá até o posto</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.section}>
          <Text style={styles.greeting}>
            {savedPlate ? `Placa ${savedPlate}` : 'Arliton'}, aqui estão os seus cupons
          </Text>
        </View>

        {/* Lista de cupons */}
        <View style={styles.couponsContainer}>
          {coupons.map((coupon) => (
            <TouchableOpacity key={coupon.id} onPress={() => handleCouponPress(coupon)} activeOpacity={0.88}>
              {coupon.tag && (
                <View style={styles.tagBadge}><Text style={styles.tagText}>{coupon.tag}</Text></View>
              )}
              <View style={[styles.couponCard, { backgroundColor: coupon.color },
              coupon.tag ? styles.couponNoTopRadius : null]}>
                <View>
                  <Text style={styles.couponFuelType}>{coupon.fuelType}</Text>
                  <Text style={styles.couponFuelSubtype}>{coupon.fuelSubtype}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.couponPrice}>R$ {coupon.price.toFixed(2).replace('.', ',')}</Text>
                  <Text style={styles.couponCta}>toque e veja condições</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity>
            <Text style={styles.howCalc}>Entenda como este cálculo é feito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons', active: true, onPress: () => { } },
          { icon: '📍', label: 'Mapa', active: false, onPress: () => { } },
          { icon: '❤️', label: 'Favoritos', active: false, onPress: () => { } },
          { icon: '↗️', label: 'Indicar', active: false, onPress: () => navigation.navigate('Share') },
          { icon: '☰', label: 'Menu', active: false, onPress: () => navigation.navigate('Profile') },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal Cadastrar Placa */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Para usar seus descontos,{'\n'}informe sua placa</Text>
            <Text style={styles.modalInputLabel}>Digite aqui a placa do seu veículo</Text>
            <TextInput
              style={styles.modalInput}
              value={plate}
              onChangeText={t => setPlate(formatPlate(t))}
              placeholder="ABC-1D23"
              placeholderTextColor="#bbb"
              autoCapitalize="characters"
              maxLength={8}
            />
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
            <TouchableOpacity style={[styles.modalButton, saving && { opacity: 0.7 }]} onPress={handleSavePlate} disabled={saving}>
              <Text style={styles.modalButtonText}>{saving ? 'Salvando...' : 'Cadastrar Placa'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  hero: { backgroundColor: '#fff' },
  heroBg: { height: 150, backgroundColor: NAVY,justifyContent: 'space-between',padding: 16,paddingTop: Platform.OS === 'ios' ? 20 : 40,},
  heroHeader: { flexDirection: 'row' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoPlaca: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  logoViva: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  logoIcon: { backgroundColor: '#fff', borderRadius: 5, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 3 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, backgroundColor: NAVY, borderRadius: 1 },
  stationBadge: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  stationLogo: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  petrobrasTag: { backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 },
  petrobrasText: { fontSize: 11, fontWeight: '700', color: '#1a6b1a' },
  stationInfoCard: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  stationName: { fontSize: 15, fontWeight: '800', color: NAVY, letterSpacing: 0.5 },
  stationLocation: { fontSize: 11, color: '#7a8a9a', marginTop: 2 },
  goToStation: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  pinEmoji: { fontSize: 12 },
  goToText: { fontSize: 12, color: '#7a8a9a', flex: 1 },
  chevron: { fontSize: 16, color: '#bbb' },
  section: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6 },
  greeting: { fontSize: 14, color: NAVY, fontWeight: '500' },
  couponsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  tagBadge: { backgroundColor: '#fff3cd', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginTop: 12 },
  tagText: { fontSize: 12, color: '#856404', fontWeight: '600' },
  couponCard: { borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, marginBottom: 2 },
  couponNoTopRadius: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  couponFuelType: { fontSize: 18, fontWeight: '800', color: '#fff' },
  couponFuelSubtype: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  couponPrice: { fontSize: 22, fontWeight: '900', color: '#fff' },
  couponCta: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  howCalc: { fontSize: 12, color: NAVY, textDecorationLine: 'underline', textAlign: 'center', marginTop: 16, marginBottom: 8 },
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: Platform.OS === 'ios' ? 44 : 28 },
  modalClose: { position: 'absolute', top: 20, right: 24, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 14, color: '#666', fontWeight: '600' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NAVY, textAlign: 'center', lineHeight: 26, marginBottom: 24, marginTop: 8 },
  modalInputLabel: { fontSize: 12, color: '#7a8a9a', marginBottom: 8 },
  modalInput: { backgroundColor: '#f5f6f8', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde2ea', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: NAVY, letterSpacing: 2, marginBottom: 20 },
  platePreview: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 3, borderColor: NAVY, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', marginBottom: 24, alignSelf: 'center', minWidth: 200, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  plateHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  plateHeaderText: { fontSize: 10, fontWeight: '800', color: NAVY, letterSpacing: 1 },
  plateHeaderIcon: { backgroundColor: NAVY, borderRadius: 3, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  plateNumber: { fontSize: 32, fontWeight: '900', color: NAVY, letterSpacing: 4, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  modalButton: { backgroundColor: NAVY, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
