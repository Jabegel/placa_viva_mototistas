import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Modal, TextInput, StatusBar, ImageBackground,
  Alert, Platform, Linking, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { getCoupons, type Coupon } from '../data/mockData';
import { Icon, BottomNav, PV, PlateCard } from '../components/PlacaVivaUI';

const { width: SW } = Dimensions.get('window');
const API_URL = 'http://192.168.0.5:8080';

export default function CouponsScreen({ route, navigation }: any) {
  const { city, station } = route?.params || {
    city: { name: 'Brasília', id: 'brasilia' },
    station: { id: 'posto-214-sul', name: 'Posto 214 Sul', brand: 'Petrobras', neighborhood: 'Asa Sul' },
  };
  const { user } = useUser();
  const coupons = getCoupons(station?.id);
  const [plate, setPlate] = useState('');
  const [savedPlate, setSavedPlate] = useState('');
  const [plateModal, setPlateModal] = useState(false);
  const [routesVisible, setRoutesVisible] = useState(false);
  const [calcModalVisible, setCalcModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatPlate = (t: string) => {
    const c = t.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c.length <= 3) return c;
    return c.slice(0, 3) + '-' + c.slice(3, 7);
  };

  const handleCouponPress = (coupon: Coupon) => {
    if (!savedPlate) { setPlateModal(true); return; }
    navigation.navigate('CouponDetail', { coupon, station, plate: savedPlate });
  };

  const handleSavePlate = async () => {
    if (plate.replace('-', '').length < 7) { Alert.alert('Atenção', 'Digite uma placa válida'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSavedPlate(plate);
    setPlateModal(false);
    setSaving(false);
  };

  const openWaze = () =>
    Linking.openURL(`waze://?q=${encodeURIComponent(station?.name)}&navigate=yes`)
      .catch(() => Linking.openURL('https://waze.com'));

  const openMaps = () =>
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(station?.name)}`);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero do posto ── */}
        <View style={s.hero}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600' }}
            style={s.heroBg}
            imageStyle={{ opacity: 0.4 }}
          >
            {/* Header sobre a imagem */}
            <View style={s.heroHeader}>
              <TouchableOpacity
                style={s.heroBack}
                onPress={() => navigation.navigate('StationSelect', { city })}
              >
                <Text style={s.heroBackText}>←</Text>
              </TouchableOpacity>
              <View style={s.logoRow}>
                <View style={s.logoIconBox}>
                  <View style={s.barChart}>
                    <View style={[s.bar, { height: 5 }]} />
                    <View style={[s.bar, { height: 9 }]} />
                    <View style={[s.bar, { height: 7 }]} />
                  </View>
                </View>
                <Text style={s.logoText}>PLACA <Text style={s.logoViva}>VIVA</Text></Text>
              </View>
              <View style={{ width: 32 }} />
            </View>

            {/* Badge do posto */}
            <View style={s.stationBadge}>
              <View style={s.stationLogoCircle}>
                <Icon name="car-outline" size={26} color={PV.gray} />
              </View>
              <View style={s.brandTag}>
                <Text style={s.brandTagText}>🟢 {station?.brand?.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>

          {/* Info card */}
          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <Text style={s.stationName}>{station?.name?.toUpperCase()}</Text>
              <TouchableOpacity
                style={s.changeBtn}
                onPress={() => navigation.navigate('StationSelect', { city })}
              >
                <Text style={s.changeBtnText}>↩ Trocar</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.stationLoc}>
              {city?.name?.toUpperCase()} – {station?.neighborhood?.toUpperCase() || 'ASA SUL'}
            </Text>
            <TouchableOpacity style={s.goRow} onPress={() => setRoutesVisible(true)}>
              <Icon name="location-outline" size={14} color={PV.gray} />
              <Text style={s.goText}>Vá até o posto</Text>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Saudação ── */}
        <View style={s.section}>
          <Text style={s.greeting}>
            {savedPlate ? `Placa ${savedPlate}` : (user.name || 'Olá')}, aqui estão os seus cupons
          </Text>
        </View>

        {/* ── Cupons ── */}
        <View style={s.coupons}>
          {coupons.map(coupon => (
            <TouchableOpacity key={coupon.id} onPress={() => handleCouponPress(coupon)} activeOpacity={0.88}>
              {coupon.tag && (
                <View style={s.tagBadge}><Text style={s.tagText}>{coupon.tag}</Text></View>
              )}
              <View style={[
                s.couponCard,
                { backgroundColor: coupon.color },
                coupon.tag ? s.noTopRadius : null,
              ]}>
                <View>
                  <Text style={s.couponType}>{coupon.fuelType}</Text>
                  <Text style={s.couponSub}>{coupon.fuelSubtype}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.couponPrice}>R$ {coupon.price.toFixed(2).replace('.', ',')}</Text>
                  <Text style={s.couponCta}>toque e veja condições</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={() => setCalcModalVisible(true)}>
            <Text style={s.calcLink}>Entenda como este cálculo é feito</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <BottomNav active="coupons" navigation={navigation} />

      {/* ══ Modal Cadastrar Placa ══ */}
      <Modal visible={plateModal} transparent animationType="slide" onRequestClose={() => setPlateModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.plateSheet}>
            <TouchableOpacity style={s.closeBtn} onPress={() => setPlateModal(false)}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <Text style={s.plateModalTitle}>Para usar seus descontos,{'\n'}informe sua placa</Text>
            <Text style={s.plateInputLabel}>Digite aqui a placa do seu veículo</Text>
            <TextInput
              style={s.plateInput}
              value={plate}
              onChangeText={t => setPlate(formatPlate(t))}
              placeholder="ABC-1D23"
              placeholderTextColor="#bbb"
              autoCapitalize="characters"
              maxLength={8}
            />
            <PlateCard plate={plate} style={{ marginBottom: 24 }} />
            <TouchableOpacity
              style={[s.plateBtn, saving && { opacity: 0.7 }]}
              onPress={handleSavePlate} disabled={saving}
            >
              <Text style={s.plateBtnText}>{saving ? 'Salvando...' : 'Cadastrar Placa'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ══ Modal Cálculo ══ */}
      <Modal visible={calcModalVisible} transparent animationType="slide" onRequestClose={() => setCalcModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.calcSheet}>
            <View style={s.calcHeader}>
              <Text style={s.calcTitle}>Como o preço é calculado?</Text>
              <TouchableOpacity onPress={() => setCalcModalVisible(false)}>
                <Text style={s.calcClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { icon: '⛽', t: 'Preço de referência', d: 'Consultamos em tempo real o preço praticado pelo posto no momento do acesso.' },
                { icon: '🏷️', t: 'Desconto Placa Viva', d: 'Aplicamos o desconto negociado exclusivamente para clientes com placa ativa.' },
                { icon: '📊', t: 'Comparativo etanol × gasolina', d: 'Se o etanol for menor que 70% da gasolina, indicamos o etanol como mais vantajoso.' },
                { icon: '⚡', t: 'Preço dinâmico', d: 'O preço aplicado é o confirmado na validação do cupom no posto, antes do abastecimento.' },
              ].map(item => (
                <View key={item.t} style={s.calcStep}>
                  <Text style={s.calcIcon}>{item.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.calcStepTitle}>{item.t}</Text>
                    <Text style={s.calcStepDesc}>{item.d}</Text>
                  </View>
                </View>
              ))}
              <View style={s.calcNote}>
                <Text style={s.calcNoteText}>💡 Apresente o cupom ao frentista ANTES de abastecer para garantir o desconto.</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={s.calcBtn} onPress={() => setCalcModalVisible(false)}>
              <Text style={s.calcBtnText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ══ Modal Rotas ══ */}
      <Modal visible={routesVisible} transparent animationType="fade" onRequestClose={() => setRoutesVisible(false)}>
        <TouchableOpacity style={s.routeOverlay} activeOpacity={1} onPress={() => setRoutesVisible(false)}>
          <View style={s.routeSheet}>
            <View style={s.routeHeader}>
              <Text style={s.routeTitle}>Dirija até o {station?.name}</Text>
              <TouchableOpacity onPress={() => setRoutesVisible(false)}>
                <Text style={s.routeClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.wazeBtn} onPress={openWaze}>
              <Text style={{ fontSize: 18 }}>🚗</Text>
              <Text style={s.wazeBtnText}>Dirija com Waze</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.mapsBtn} onPress={openMaps}>
              <Icon name="map-outline" size={18} color={PV.gray} />
              <Text style={s.mapsBtnText}>Dirija com Google Maps</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  hero: { backgroundColor: '#fff' },
  heroBg: { height: 170, backgroundColor: PV.navy, justifyContent: 'space-between', paddingBottom: 14 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14 },
  heroBack: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heroBackText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoIconBox: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, backgroundColor: '#fff', borderRadius: 1 },
  logoText: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  logoViva: { fontWeight: '900', letterSpacing: 2 },
  stationBadge: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16 },
  stationLogoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)' },
  brandTag: { backgroundColor: '#fff', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 },
  brandTagText: { fontSize: 11, fontWeight: '700', color: '#1a6b1a' },
  infoCard: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: PV.border },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  stationName: { fontSize: 14, fontWeight: '800', color: PV.navy, letterSpacing: 0.3, flex: 1 },
  changeBtn: { backgroundColor: PV.offWhite, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  changeBtnText: { fontSize: 11, color: PV.navy, fontWeight: '600' },
  stationLoc: { fontSize: 11, color: PV.gray, marginBottom: 6 },
  goRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinEmoji: { fontSize: 12 },
  goText: { fontSize: 12, color: PV.gray, flex: 1 },
  chevron: { fontSize: 16, color: '#bbb' },
  section: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  greeting: { fontSize: 14, color: PV.navy, fontWeight: '500' },
  coupons: { paddingHorizontal: 16, paddingBottom: 20 },
  tagBadge: { backgroundColor: '#fff3cd', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginTop: 10 },
  tagText: { fontSize: 12, color: '#856404', fontWeight: '600' },
  couponCard: { borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 18, marginBottom: 4 },
  noTopRadius: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  couponType: { fontSize: 17, fontWeight: '800', color: '#fff' },
  couponSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  couponPrice: { fontSize: 22, fontWeight: '900', color: '#fff' },
  couponCta: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  calcLink: { fontSize: 12, color: PV.navy, textDecorationLine: 'underline', textAlign: 'center', marginTop: 14, marginBottom: 8 },
  // Modal overlay
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  // Placa modal
  plateSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 26, paddingBottom: Platform.OS === 'ios' ? 44 : 26 },
  closeBtn: { position: 'absolute', top: 18, right: 20, width: 30, height: 30, borderRadius: 15, backgroundColor: PV.offWhite, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 13, color: '#666', fontWeight: '700' },
  plateModalTitle: { fontSize: 17, fontWeight: '800', color: PV.navy, textAlign: 'center', lineHeight: 25, marginBottom: 22, marginTop: 8 },
  plateInputLabel: { fontSize: 12, color: PV.gray, marginBottom: 7 },
  plateInput: { backgroundColor: PV.offWhite, borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: PV.navy, letterSpacing: 2, marginBottom: 18 },
  plateBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center' },
  plateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // Cálculo modal
  calcSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: Platform.OS === 'ios' ? 44 : 22, maxHeight: '85%' },
  calcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  calcTitle: { fontSize: 16, fontWeight: '800', color: PV.navy },
  calcClose: { fontSize: 18, color: PV.grayLight, fontWeight: '700' },
  calcStep: { flexDirection: 'row', gap: 12, marginBottom: 18, alignItems: 'flex-start' },
  calcIcon: { fontSize: 20, width: 28, textAlign: 'center', marginTop: 1 },
  calcStepTitle: { fontSize: 13, fontWeight: '700', color: PV.navy, marginBottom: 3 },
  calcStepDesc: { fontSize: 12, color: '#555', lineHeight: 17 },
  calcNote: { backgroundColor: '#fffbeb', borderRadius: 10, padding: 12, marginBottom: 10 },
  calcNoteText: { fontSize: 12, color: '#856404', lineHeight: 17 },
  calcBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  calcBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  // Rotas modal
  routeOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  routeSheet: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: SW * 0.82 },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  routeTitle: { fontSize: 14, fontWeight: '700', color: PV.navy, flex: 1, marginRight: 8, lineHeight: 20 },
  routeClose: { fontSize: 16, color: PV.grayLight, fontWeight: '700' },
  wazeBtn: { backgroundColor: '#00c0e8', borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, gap: 8, marginBottom: 10 },
  wazeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  mapsBtn: { backgroundColor: '#fff', borderRadius: 30, borderWidth: 1.5, borderColor: PV.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, gap: 8 },
  mapsBtnText: { fontSize: 15, fontWeight: '600', color: PV.navy },
});
