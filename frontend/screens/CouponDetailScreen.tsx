import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Modal, FlatList, Dimensions, Linking,
  Platform, StatusBar, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TERMS, type Coupon, type Station } from '../data/mockData';
import { useUser } from '../context/UserContext';
import { Icon, BottomNav, PV, PlateCard } from '../components/PlacaVivaUI';

const { width: SW } = Dimensions.get('window');
const MOCK_PLATES = ['ABC-1D23', 'DEF-2E34', 'GHI-3F45'];

export default function CouponDetailScreen({ route, navigation }: any) {
  const { coupon, station, plate: initialPlate }: { coupon: Coupon; station: Station; plate: string }
    = route?.params || {
      coupon: { id: '1', fuelType: 'Gasolina', fuelSubtype: 'Comum', price: 6.07, color: '#c8a832' },
      station: { name: 'Posto 214 Sul', brand: 'Petrobras', neighborhood: 'Asa Sul', id: 'posto-214-sul' },
      plate: 'ABC-1D23',
    };

  const { user } = useUser();
  const plates = initialPlate ? [initialPlate, ...MOCK_PLATES.filter(p => p !== initialPlate)] : MOCK_PLATES;
  const [activePlateIndex, setActivePlateIndex] = useState(0);
  const [termsVisible, setTermsVisible] = useState(false);
  const [routesVisible, setRoutesVisible] = useState(false);

  const city = route?.params?.city || { name: 'Brasília', id: 'brasilia' };

  const scrollPlate = (dir: 'prev' | 'next') => {
    setActivePlateIndex(i =>
      dir === 'next' ? Math.min(i + 1, plates.length - 1) : Math.max(i - 1, 0)
    );
  };

  const openWaze = () =>
    Linking.openURL(`waze://?q=${encodeURIComponent(station.name)}&navigate=yes`)
      .catch(() => Linking.openURL('https://waze.com'));

  const openMaps = () =>
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(station.name)}`);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=600' }}
            style={s.heroBg}
            imageStyle={{ opacity: 0.4 }}
          >
            <View style={s.heroHeader}>
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
            </View>
            <View style={s.stationBadge}>
              <View style={s.stationLogoCircle}>
                <Icon name="flash-outline" size={26} color={PV.gray} />
              </View>
              <View style={s.brandTag}>
                <Text style={s.brandTagText}>🟢 {station.brand?.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>
          <View style={s.infoCard}>
            <Text style={s.stationName}>{station.name?.toUpperCase()}</Text>
            <Text style={s.stationLoc}>BRASÍLIA – {station.neighborhood?.toUpperCase()}</Text>
            <TouchableOpacity style={s.goRow} onPress={() => setRoutesVisible(true)}>
              <Icon name="location-outline" size={14} color={PV.gray} />
              <Text style={s.goText}>Vá até o posto</Text>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação + voltar */}
        <View style={s.section}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backRow}>
            <Text style={s.backArrow}>←</Text>
            <Text style={s.greeting}>{user.name || 'Olá'}, aqui está seu cupom</Text>
          </TouchableOpacity>
        </View>

        {/* Tag + Card do cupom — fiel ao design */}
        <View style={s.couponWrapper}>
          {/* Label laranja do tipo (ex: GASOLINA COMUM) */}
          <View style={s.couponTypeLabel}>
            <Text style={s.couponTypeLabelText}>
              {coupon.fuelType.toUpperCase()} {coupon.fuelSubtype.toUpperCase()}
            </Text>
          </View>

          {/* Card colorido com preço grande */}
          <View style={[s.couponCard, { backgroundColor: coupon.color }]}>
            <Text style={s.couponPrice}>
              R$ {coupon.price.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={s.couponPriceSub}>Preço por litro</Text>
          </View>
        </View>

        {/* Carrossel de placas */}
        <View style={s.plateSection}>
          <TouchableOpacity
            style={[s.plateArrow, activePlateIndex === 0 && s.arrowDisabled]}
            onPress={() => scrollPlate('prev')}
          >
            <Text style={s.plateArrowText}>‹</Text>
          </TouchableOpacity>
          <PlateCard plate={plates[activePlateIndex]} style={{ flex: 1 }} />
          <TouchableOpacity
            style={[s.plateArrow, activePlateIndex === plates.length - 1 && s.arrowDisabled]}
            onPress={() => scrollPlate('next')}
          >
            <Text style={s.plateArrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Dots */}
        <View style={s.dotsRow}>
          {plates.map((_, i) => (
            <View key={i} style={[s.dot, i === activePlateIndex && s.dotActive]} />
          ))}
        </View>

        {/* Info pagamento */}
        <View style={s.infoBlock}>
          <View style={s.infoRow}>
            <Icon name="card-outline" size={14} color={PV.gray} />
            <Text style={s.infoText}>Pagamento: pix, dinheiro ou débito</Text>
          </View>
          <View style={s.infoRow}>
            <Icon name="warning-outline" size={14} color={PV.gray} />
            <Text style={s.infoText}>O valor exibido reflete o preço vigente no momento do abastecimento.</Text>
          </View>
        </View>

        <TouchableOpacity style={s.termsLink} onPress={() => setTermsVisible(true)}>
          <Text style={s.termsLinkText}>Termos e Condições</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav active="coupons" navigation={navigation} />

      {/* ── Modal Termos ── */}
      <Modal visible={termsVisible} animationType="slide" transparent onRequestClose={() => setTermsVisible(false)}>
        <View style={s.termsOverlay}>
          <SafeAreaView style={s.termsSheet}>
            <Text style={s.termsTitle}>Termos e Condições</Text>
            <Text style={s.termsSub}>Por favor, revise os detalhes abaixo para continuar</Text>
            <ScrollView style={s.termsScroll} showsVerticalScrollIndicator={false}>
              <View style={s.termsBox}>
                <Text style={s.termsText}>{MOCK_TERMS}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={s.termsBtn} onPress={() => setTermsVisible(false)}>
              <Text style={s.termsBtnText}>Ok</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>

      {/* ── Modal Rotas ── */}
      <Modal visible={routesVisible} animationType="fade" transparent onRequestClose={() => setRoutesVisible(false)}>
        <TouchableOpacity style={s.routeOverlay} activeOpacity={1} onPress={() => setRoutesVisible(false)}>
          <View style={s.routeSheet}>
            <View style={s.routeHeader}>
              <Text style={s.routeTitle}>Dirija até o {station.name}</Text>
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
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 14 },
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
  stationName: { fontSize: 14, fontWeight: '800', color: PV.navy },
  stationLoc: { fontSize: 11, color: PV.gray, marginBottom: 6, marginTop: 2 },
  goRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinEmoji: { fontSize: 12 },
  goText: { fontSize: 12, color: PV.gray, flex: 1 },
  chevron: { fontSize: 16, color: '#bbb' },
  section: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backArrow: { fontSize: 18, color: PV.navy, fontWeight: '700' },
  greeting: { fontSize: 14, color: PV.navy, fontWeight: '500' },
  // Cupom — fiel ao design de referência
  couponWrapper: { paddingHorizontal: 16, marginTop: 10 },
  couponTypeLabel: { paddingVertical: 8, paddingHorizontal: 14 },
  couponTypeLabelText: { fontSize: 13, fontWeight: '700', color: PV.orange, letterSpacing: 0.5 },
  couponCard: { borderRadius: 12, paddingVertical: 28, paddingHorizontal: 20, alignItems: 'center' },
  couponPrice: { fontSize: 52, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  couponPriceSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  // Placa
  plateSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 20, gap: 10 },
  plateArrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: PV.navy, alignItems: 'center', justifyContent: 'center' },
  arrowDisabled: { backgroundColor: PV.border },
  plateArrowText: { fontSize: 22, color: '#fff', fontWeight: '800', lineHeight: 26 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: PV.border },
  dotActive: { backgroundColor: PV.navy, width: 18 },
  // Info
  infoBlock: { paddingHorizontal: 16, marginTop: 18, gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoIcon: { fontSize: 14, marginTop: 1 },
  infoText: { fontSize: 12, color: PV.gray, flex: 1, lineHeight: 18 },
  termsLink: { alignSelf: 'center', marginTop: 14 },
  termsLinkText: { fontSize: 12, color: PV.navy, textDecorationLine: 'underline', fontWeight: '600' },
  // Termos
  termsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  termsSheet: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 22, paddingTop: 28 },
  termsTitle: { fontSize: 22, fontWeight: '800', color: PV.navy, marginBottom: 5 },
  termsSub: { fontSize: 13, color: PV.gray, marginBottom: 14 },
  termsScroll: { flex: 1 },
  termsBox: { backgroundColor: PV.offWhite, borderRadius: 10, padding: 14, marginBottom: 16 },
  termsText: { fontSize: 12, color: '#444', lineHeight: 20 },
  termsBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  termsBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  // Rotas
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
