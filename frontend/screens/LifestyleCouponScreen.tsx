import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  ImageBackground,
} from 'react-native';

const NAVY = '#1a2e4a';
const ORANGE = '#e8820c';

// ─── DADOS MOCK DE PARCEIROS ──────────────────────────────────────────────────
export const MOCK_LIFESTYLE_PARTNERS: Record<string, LifestylePartner> = {
  'r1': {
    id: 'r1',
    category: 'CULTURA',
    categoryColor: '#6a3d9a',
    partnerName: 'Cine Drive-in BSB',
    partnerLogo: '🎬',
    heroImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
    couponTitle: 'Ingressos com 50% off',
    couponDescription: 'Na compra de qualquer sessão, o segundo ingresso sai pela metade do preço.',
    validAt: 'Válido no Cine Drive-in do Parque da Cidade',
    plates: ['ABC-1D23', 'DEF-2E34'],
    paymentNote: 'Apresente este cupom na bilheteria antes de pagar.',
    termsNote: 'Leia aqui os Termos e Condições deste Cupom',
  },
  'r2': {
    id: 'r2',
    category: 'GASTRONOMIA',
    categoryColor: ORANGE,
    partnerName: 'Maria Amélia Doces',
    partnerLogo: '☕',
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
    couponTitle: 'Café grátis',
    couponDescription: 'Na compra de uma fatia de bolo de torta.\nApresente este acesso no caixa.',
    validAt: 'Válido na unidade do Jardim Botânico',
    plates: ['ABC-1D23', 'DEF-2E34', 'GHI-3F45'],
    paymentNote: 'Pagamento: pix, dinheiro ou débito.',
    termsNote: 'Leia aqui os Termos e Condições deste Cupom',
  },
};

type LifestylePartner = {
  id: string;
  category: string;
  categoryColor: string;
  partnerName: string;
  partnerLogo: string;
  heroImage: string;
  couponTitle: string;
  couponDescription: string;
  validAt: string;
  plates: string[];
  paymentNote: string;
  termsNote: string;
};

const PLATES_MOCK = ['ABC-1D23', 'DEF-2E34', 'GHI-3F45'];

export default function LifestyleCouponScreen({ route, navigation }: any) {
  const { reward } = route?.params || { reward: { id: 'r2' } };
  const partner: LifestylePartner =
    MOCK_LIFESTYLE_PARTNERS[reward?.id] ?? MOCK_LIFESTYLE_PARTNERS['r2'];

  const { user } = useUser();
  const [activePlateIndex, setActivePlateIndex] = useState(0);
  const plates = partner.plates ?? PLATES_MOCK;
  const activePlate = plates[activePlateIndex];

  const scrollPlate = (dir: 'prev' | 'next') => {
    const next =
      dir === 'next'
        ? Math.min(activePlateIndex + 1, plates.length - 1)
        : Math.max(activePlateIndex - 1, 0);
    setActivePlateIndex(next);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero com imagem do parceiro */}
        <View style={styles.hero}>
          <ImageBackground
            source={{ uri: partner.heroImage }}
            style={styles.heroBg}
            imageStyle={{ opacity: 0.55 }}
          >
            {/* Logo Placa Viva */}
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

            {/* Badge do parceiro */}
            <View style={styles.partnerBadge}>
              <View style={styles.partnerLogoCircle}>
                <Text style={{ fontSize: 28 }}>{partner.partnerLogo}</Text>
              </View>
              <View style={[styles.categoryTag, { backgroundColor: partner.categoryColor }]}>
                <Text style={styles.categoryTagText}>⭐ {partner.category}</Text>
              </View>
            </View>
          </ImageBackground>

          {/* Info do parceiro */}
          <View style={styles.partnerInfoCard}>
            <Text style={styles.partnerName}>{partner.partnerName.toUpperCase()}</Text>
            <Text style={styles.partnerCategory}>LIFESTYLE</Text>
            <TouchableOpacity style={styles.goToPartner}>
              <Text style={styles.pinEmoji}>📍</Text>
              <Text style={styles.goToText}>Vá até a {partner.partnerName}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.greeting}>{user.name || 'Olá'}, aqui está seu cupom</Text>
          </TouchableOpacity>
        </View>

        {/* Tag de categoria */}
        <View style={styles.couponWrapper}>
          <View style={[styles.categoryBadge, { backgroundColor: partner.categoryColor + '22' }]}>
            <Text style={[styles.categoryBadgeText, { color: partner.categoryColor }]}>
              CUPOM {partner.category}
            </Text>
          </View>

          {/* Card do cupom */}
          <View style={[styles.couponCard, { backgroundColor: partner.categoryColor }]}>
            <Text style={styles.couponTitle}>{partner.couponTitle}</Text>
            <Text style={styles.couponDesc}>{partner.couponDescription}</Text>
          </View>
        </View>

        {/* Carrossel de placas */}
        <View style={styles.plateSection}>
          <TouchableOpacity
            style={[styles.plateArrow, activePlateIndex === 0 && styles.arrowDisabled]}
            onPress={() => scrollPlate('prev')}
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
            onPress={() => scrollPlate('next')}
          >
            <Text style={styles.plateArrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {plates.map((_, i) => (
            <View key={i} style={[styles.dot, i === activePlateIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Detalhes */}
        <View style={styles.detailsBlock}>
          <Text style={styles.detailsText}>{partner.couponDescription}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{partner.validAt}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💳</Text>
            <Text style={styles.infoText}>{partner.paymentNote}</Text>
          </View>

          <TouchableOpacity style={styles.termsRow}>
            <Text style={styles.infoIcon}>📄</Text>
            <Text style={styles.termsText}>{partner.termsNote}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons',    active: false, onPress: () => navigation.navigate('Coupons') },
          { icon: '📍', label: 'Mapa',      active: false, onPress: () => {} },
          { icon: '❤️', label: 'LifeStyle', active: true,  onPress: () => navigation.navigate('Lifestyle') },
          { icon: '↗️', label: 'Indicar',   active: false, onPress: () => navigation.navigate('Share') },
          { icon: '☰', label: 'Menu',      active: false, onPress: () => navigation.navigate('Profile') },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },

  // Hero
  hero: { backgroundColor: '#fff' },
  heroBg: { height: 150, backgroundColor: NAVY,justifyContent: 'space-between',padding: 16,paddingTop: Platform.OS === 'ios' ? 20 : 40,},
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
  partnerBadge: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  partnerLogoCircle: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
  },
  categoryTag: {
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 4,
  },
  categoryTagText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  partnerInfoCard: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  partnerName: { fontSize: 15, fontWeight: '800', color: NAVY, letterSpacing: 0.5 },
  partnerCategory: { fontSize: 11, color: '#7a8a9a', marginTop: 2, letterSpacing: 1 },
  goToPartner: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
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
  categoryBadge: {
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  couponCard: {
    borderRadius: 12, borderTopLeftRadius: 0,
    paddingHorizontal: 24, paddingVertical: 28, alignItems: 'center',
  },
  couponTitle: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center' },
  couponDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 6, lineHeight: 20 },

  // Placa
  plateSection: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20, marginTop: 20, gap: 12,
  },
  plateArrow: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: NAVY, alignItems: 'center', justifyContent: 'center',
  },
  arrowDisabled: { backgroundColor: '#dde2ea' },
  plateArrowText: { fontSize: 20, color: '#fff', fontWeight: '800', lineHeight: 24 },
  platePreview: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 3, borderColor: NAVY,
    paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
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

  // Detalhes
  detailsBlock: { paddingHorizontal: 20, marginTop: 20, gap: 12 },
  detailsText: { fontSize: 13, color: '#555', lineHeight: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoIcon: { fontSize: 14, marginTop: 1 },
  infoText: { fontSize: 12, color: '#7a8a9a', flex: 1, lineHeight: 18 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  termsText: { fontSize: 12, color: NAVY, textDecorationLine: 'underline', fontWeight: '600' },

  // Bottom Nav
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
});
