import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  Linking,
  Platform,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { MOCK_TERMS, type Coupon, type Station } from '../data/mockData';

const NAVY = '#1a2e4a';
const { width: SCREEN_W } = Dimensions.get('window');

// Simula múltiplas placas cadastradas pelo usuário
const MOCK_PLATES = ['ABC-1D23', 'DEF-2E34', 'GHI-3F45'];

type Props = {
  route: any;
  navigation: any;
};

export default function CouponDetailScreen({ route, navigation }: Props) {
  const { coupon, station, plate: initialPlate }: { coupon: Coupon; station: Station; plate: string } =
    route?.params || {
      coupon: { id: '1', fuelType: 'Gasolina', fuelSubtype: 'Comum', price: 6.07, color: '#c8a832' },
      station: { name: 'Posto 214 Sul', brand: 'Petrobras', neighborhood: 'Asa Sul', id: 'posto-214-sul' },
      plate: 'ABC-1D23',
    };

  const plates = initialPlate ? [initialPlate, ...MOCK_PLATES.filter(p => p !== initialPlate)] : MOCK_PLATES;
  const [activePlateIndex, setActivePlateIndex] = useState(0);
  const [termsVisible, setTermsVisible] = useState(false);
  const [routesVisible, setRoutesVisible] = useState(false);
  const plateListRef = useRef<FlatList>(null);

  const activePlate = plates[activePlateIndex];

  const scrollToPlate = (dir: 'prev' | 'next') => {
    const next = dir === 'next'
      ? Math.min(activePlateIndex + 1, plates.length - 1)
      : Math.max(activePlateIndex - 1, 0);
    setActivePlateIndex(next);
    plateListRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const openWaze = () => {
    Linking.openURL(`waze://?q=${encodeURIComponent(station.name + ' ' + station.neighborhood)}&navigate=yes`)
      .catch(() => Linking.openURL('https://waze.com'));
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${station.name} ${station.neighborhood}`);
    const url = Platform.OS === 'ios'
      ? `comgooglemaps://?q=${query}`
      : `geo:0,0?q=${query}`;
    Linking.openURL(url).catch(() =>
      Linking.openURL(`https://maps.google.com/?q=${query}`)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero igual à tela de cupons */}
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
              <View style={styles.stationLogo}>
                <Text style={{ fontSize: 24 }}>⛽</Text>
              </View>
              <View style={styles.brandTag}>
                <Text style={styles.brandText}>🟢 {station.brand?.toUpperCase()}</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.stationInfoCard}>
            <Text style={styles.stationName}>{station.name?.toUpperCase()}</Text>
            <Text style={styles.stationLocation}>
              BRASÍLIA – {station.neighborhood?.toUpperCase()}
            </Text>
            <TouchableOpacity style={styles.goToStation} onPress={() => setRoutesVisible(true)}>
              <Text style={styles.pinEmoji}>📍</Text>
              <Text style={styles.goToText}>Vá até o posto</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.greeting}>João, aqui está seu cupom</Text>
          </TouchableOpacity>
        </View>

        {/* Card do cupom */}
        <View style={styles.couponWrapper}>
          {coupon.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{coupon.tag}</Text>
            </View>
          )}
          <View style={[styles.couponCard, { backgroundColor: coupon.color }]}>
            <Text style={styles.couponLabel}>
              {coupon.fuelType.toUpperCase()} {coupon.fuelSubtype.toUpperCase()}
            </Text>
            <Text style={styles.couponPrice}>
              R$ {coupon.price.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.couponSub}>Preço por litro</Text>
          </View>
        </View>

        {/* Carrossel de placas */}
        <View style={styles.plateSection}>
          <TouchableOpacity
            style={[styles.plateArrow, activePlateIndex === 0 && styles.arrowDisabled]}
            onPress={() => scrollToPlate('prev')}
          >
            <Text style={styles.plateArrowText}>‹</Text>
          </TouchableOpacity>

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
            <Text style={styles.plateNumber}>{activePlate}</Text>
          </View>

          <TouchableOpacity
            style={[styles.plateArrow, activePlateIndex === plates.length - 1 && styles.arrowDisabled]}
            onPress={() => scrollToPlate('next')}
          >
            <Text style={styles.plateArrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Dots do carrossel */}
        <View style={styles.dotsRow}>
          {plates.map((_, i) => (
            <View key={i} style={[styles.dot, i === activePlateIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Info de pagamento */}
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💳</Text>
            <Text style={styles.infoText}>Pagamento: pix, dinheiro ou débito</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⚠️</Text>
            <Text style={styles.infoText}>
              O valor exibido reflete o preço vigente no momento do abastecimento.
            </Text>
          </View>
        </View>

        {/* Termos */}
        <TouchableOpacity style={styles.termsLink} onPress={() => setTermsVisible(true)}>
          <Text style={styles.termsLinkText}>Termos e Condições</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons', active: true, onPress: () => navigation.goBack() },
          { icon: '📍', label: 'Mapa',   active: false, onPress: () => setRoutesVisible(true) },
          { icon: '❤️', label: 'Favoritos', active: false, onPress: () => {} },
          { icon: '↗️', label: 'Indicar',   active: false, onPress: () => navigation.navigate('Share') },
          { icon: '☰', label: 'Menu',      active: false, onPress: () => {} },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Modal Termos e Condições ── */}
      <Modal visible={termsVisible} animationType="slide" transparent onRequestClose={() => setTermsVisible(false)}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.termsSheet}>
            <Text style={styles.termsTitle}>Termos e Condições</Text>
            <Text style={styles.termsSubtitle}>Por favor, revise os detalhes abaixo para continuar</Text>
            <ScrollView style={styles.termsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.termsBox}>
                <Text style={styles.termsText}>{MOCK_TERMS}</Text>
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.termsButton} onPress={() => setTermsVisible(false)}>
              <Text style={styles.termsButtonText}>Ok</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>

      {/* ── Modal Rotas ── */}
      <Modal visible={routesVisible} animationType="fade" transparent onRequestClose={() => setRoutesVisible(false)}>
        <TouchableOpacity style={styles.routesOverlay} activeOpacity={1} onPress={() => setRoutesVisible(false)}>
          <View style={styles.routesSheet}>
            <View style={styles.routesHeader}>
              <Text style={styles.routesTitle}>Dirija até o {station.name}</Text>
              <TouchableOpacity onPress={() => setRoutesVisible(false)}>
                <Text style={styles.routesClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.wazeButton} onPress={openWaze} activeOpacity={0.85}>
              <Text style={styles.wazeIcon}>🚗</Text>
              <Text style={styles.wazeText}>Dirija com Waze</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapsButton} onPress={openGoogleMaps} activeOpacity={0.85}>
              <Text style={styles.mapsIcon}>🗺️</Text>
              <Text style={styles.mapsText}>Dirija com Google Maps</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },

  // Hero
  hero: { backgroundColor: '#fff' },
  heroBg: { height: 160, backgroundColor: NAVY, justifyContent: 'space-between', padding: 16 },
  heroHeader: { flexDirection: 'row' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoPlaca: { fontSize: 15, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  logoViva: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  logoIcon: {
    backgroundColor: '#fff', borderRadius: 5, width: 22, height: 22,
    alignItems: 'center', justifyContent: 'center', marginLeft: 3,
  },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, backgroundColor: NAVY, borderRadius: 1 },
  stationBadge: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  stationLogo: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  brandTag: { backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 4 },
  brandText: { fontSize: 11, fontWeight: '700', color: '#1a6b1a' },
  stationInfoCard: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  stationName: { fontSize: 15, fontWeight: '800', color: NAVY, letterSpacing: 0.5 },
  stationLocation: { fontSize: 11, color: '#7a8a9a', marginTop: 2 },
  goToStation: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  pinEmoji: { fontSize: 12 },
  goToText: { fontSize: 12, color: '#7a8a9a', flex: 1 },
  chevron: { fontSize: 16, color: '#bbb' },

  // Saudação
  section: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backArrow: { fontSize: 18, color: NAVY, fontWeight: '700' },
  greeting: { fontSize: 14, color: NAVY, fontWeight: '500' },

  // Cupom
  couponWrapper: { paddingHorizontal: 20, marginTop: 8 },
  tagBadge: {
    backgroundColor: '#fff3cd', borderTopLeftRadius: 10, borderTopRightRadius: 10,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  tagText: { fontSize: 12, color: '#856404', fontWeight: '600' },
  couponCard: {
    borderRadius: 12, borderTopLeftRadius: 0,
    paddingHorizontal: 24, paddingVertical: 24, alignItems: 'center',
  },
  couponLabel: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1 },
  couponPrice: { fontSize: 48, fontWeight: '900', color: '#fff', marginTop: 4 },
  couponSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  // Carrossel de placas
  plateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  plateArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center',
  },
  arrowDisabled: { backgroundColor: '#dde2ea' },
  plateArrowText: { fontSize: 20, color: '#fff', fontWeight: '800', lineHeight: 24 },
  platePreview: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: NAVY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  plateHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  plateHeaderText: { fontSize: 10, fontWeight: '800', color: NAVY, letterSpacing: 1 },
  plateHeaderIcon: {
    backgroundColor: NAVY, borderRadius: 3, width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  plateNumber: {
    fontSize: 30, fontWeight: '900', color: NAVY, letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },

  // Dots
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#dde2ea' },
  dotActive: { backgroundColor: NAVY, width: 18 },

  // Info
  infoBlock: { paddingHorizontal: 20, marginTop: 20, gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoIcon: { fontSize: 14, marginTop: 1 },
  infoText: { fontSize: 12, color: '#7a8a9a', flex: 1, lineHeight: 18 },

  // Termos link
  termsLink: { alignSelf: 'center', marginTop: 16 },
  termsLinkText: { fontSize: 12, color: NAVY, textDecorationLine: 'underline', fontWeight: '600' },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
    paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },

  // Modal Termos
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  termsSheet: { flex: 1, backgroundColor: '#fff', margin: 0, paddingHorizontal: 24, paddingTop: 32 },
  termsTitle: { fontSize: 22, fontWeight: '800', color: NAVY, marginBottom: 6 },
  termsSubtitle: { fontSize: 13, color: '#7a8a9a', marginBottom: 16 },
  termsScroll: { flex: 1 },
  termsBox: {
    backgroundColor: '#f5f6f8', borderRadius: 12,
    padding: 16, marginBottom: 20,
  },
  termsText: { fontSize: 12, color: '#444', lineHeight: 20 },
  termsButton: {
    backgroundColor: NAVY, borderRadius: 30,
    height: 52, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  termsButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Modal Rotas
  routesOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  routesSheet: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 20, width: SCREEN_W * 0.82,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  routesHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  routesTitle: { fontSize: 14, fontWeight: '700', color: NAVY, flex: 1, marginRight: 8 },
  routesClose: { fontSize: 16, color: '#aab0bc', fontWeight: '700' },
  wazeButton: {
    backgroundColor: '#00c0e8', borderRadius: 30,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, gap: 8, marginBottom: 10,
  },
  wazeIcon: { fontSize: 18 },
  wazeText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  mapsButton: {
    backgroundColor: '#fff', borderRadius: 30, borderWidth: 1.5, borderColor: '#dde2ea',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 50, gap: 8,
  },
  mapsIcon: { fontSize: 18 },
  mapsText: { fontSize: 15, fontWeight: '600', color: NAVY },
});
