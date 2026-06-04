import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Platform, Modal, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { Icon, BottomNav, PV } from '../components/PlacaVivaUI';

const USER_POINTS = 25;

type Reward = {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: string;
  title: string;
  subtitle: string;
  pointsRequired: number;
  unlocked: boolean;
  isStart?: boolean;
  comingSoon?: boolean;
  description?: string;
  validAt?: string;
  howToUse?: string;
  expiresIn?: string;
};

const REWARDS: Reward[] = [
  {
    id: 'r0', category: '', categoryColor: '#aaa', categoryIcon: '⏳',
    title: 'Em breve!', subtitle: '', pointsRequired: 0, unlocked: false, comingSoon: true,
    description: 'Nova recompensa chegando em breve. Fique ligado!',
  },
  {
    id: 'r5', category: 'Beleza', categoryColor: '#c0396b', categoryIcon: '💅',
    title: 'Manicure grátis', subtitle: 'Studio Bella', pointsRequired: 80, unlocked: false,
    description: 'Ganhe uma sessão de manicure completa com nail art incluída.',
    validAt: 'Unidades Asa Norte, Asa Sul e Sudoeste',
    howToUse: 'Apresente o cupom na recepção antes do atendimento.',
    expiresIn: '30 dias após resgatar',
  },
  {
    id: 'r4', category: 'Saúde', categoryColor: '#27ae60', categoryIcon: '🏋️',
    title: 'Aula de academia grátis', subtitle: 'Smart Fit', pointsRequired: 60, unlocked: false,
    description: 'Uma semana de acesso livre em qualquer unidade Smart Fit do DF.',
    validAt: 'Todas as unidades do Distrito Federal',
    howToUse: 'Mostre o QR Code do cupom na entrada.',
    expiresIn: '15 dias após resgatar',
  },
  {
    id: 'r1', category: 'Cultura', categoryColor: '#6a3d9a', categoryIcon: '🎭',
    title: 'Ingressos com 50% off', subtitle: 'Cine Drive-in', pointsRequired: 50, unlocked: false,
    description: 'Na compra de qualquer sessão, o segundo ingresso sai pela metade do preço.',
    validAt: 'Cine Drive-in do Parque da Cidade',
    howToUse: 'Apresente o cupom na bilheteria antes de pagar.',
    expiresIn: '45 dias após resgatar',
  },
  {
    id: 'r2', category: 'Gastronomia', categoryColor: '#e8820c', categoryIcon: '🍽️',
    title: 'Café grátis!', subtitle: 'Maria Amélia', pointsRequired: 25, unlocked: true,
    description: 'Na compra de uma fatia de bolo ou torta, o café é por nossa conta.',
    validAt: 'Unidade do Jardim Botânico',
    howToUse: 'Apresente este cupom no caixa antes de pagar.',
    expiresIn: '20 dias após resgatar',
  },
  {
    id: 'r3', category: 'Início', categoryColor: PV.navy, categoryIcon: '🚗',
    title: 'Bem-vindo ao Placa Viva!', subtitle: 'Ponto de partida',
    pointsRequired: 10, unlocked: true, isStart: true,
    description: 'Você começou sua jornada de benefícios!',
  },
];

// índice onde o carro está (último desbloqueado, antes do primeiro bloqueado)
const CAR_AFTER_INDEX = 4; // após 'Café grátis'

export default function LifestyleScreen({ navigation }: any) {
  const { user } = useUser();
  const [selected, setSelected] = useState<Reward | null>(null);

  const handlePress = (r: Reward) => {
    if (r.isStart) return;
    setSelected(r);
  };

  const handleUse = (r: Reward) => {
    setSelected(null);
    navigation.navigate('LifestyleCoupon', { reward: r });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header com avatar ── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoBox}>
            <View style={s.barChart}>
              <View style={[s.bar, { height: 7 }]} />
              <View style={[s.bar, { height: 12 }]} />
              <View style={[s.bar, { height: 9 }]} />
            </View>
          </View>
          <View>
            <Text style={s.userName}>{(user.name || 'Usuário').toUpperCase()}</Text>
            <Text style={s.userSub}>
              {user.phone ? user.phone.replace('+55', '').trim() : 'GRANBEIRO MEZZETH ALENCAR'}
            </Text>
          </View>
        </View>
        {/* Avatar com borda azul */}
        <View style={s.avatarBorder}>
          <View style={s.avatarCircle}>
            <Text style={{ fontSize: 22 }}>👤</Text>
          </View>
        </View>
      </View>

      {/* ── Badge de pontos ── */}
      <View style={s.pointsRow}>
        <Text style={s.pointsLabel}>Pontos Lifestyle</Text>
        <View style={s.pointsBadge}>
          <Text style={s.pointsBadgeText}>{USER_POINTS}</Text>
        </View>
      </View>

      {/* ── Trilha ── */}
      <ScrollView style={s.trail} contentContainerStyle={s.trailContent} showsVerticalScrollIndicator={false}>
        {REWARDS.map((reward, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === REWARDS.length - 1;
          const pointsNeeded = reward.pointsRequired - USER_POINTS;
          const showCar = index === CAR_AFTER_INDEX; // carro aparece depois deste nó

          return (
            <View key={reward.id}>
              <View style={[s.stepRow, isLeft ? s.stepLeft : s.stepRight]}>

                {/* Categoria no lado oposto ao card */}
                {!isLeft && (
                  <View style={s.catSide}>
                    {reward.category ? (
                      <>
                        <Text style={{ fontSize: 18 }}>{reward.categoryIcon}</Text>
                        <Text style={[s.catName, { color: reward.categoryColor }]}>{reward.category}</Text>
                        {!reward.unlocked && !reward.comingSoon && pointsNeeded > 0 && (
                          <Text style={s.catNote}>+{pointsNeeded} pts{'\n'}para liberar</Text>
                        )}
                      </>
                    ) : <View />}
                  </View>
                )}

                {/* Conector esquerdo */}
                {!isLeft && <View style={s.connector} />}

                {/* Círculo de pontos */}
                <TouchableOpacity
                  style={[
                    s.circle,
                    reward.unlocked ? s.circleActive : s.circleInactive,
                    reward.comingSoon && s.circleGray,
                  ]}
                  onPress={() => handlePress(reward)}
                  activeOpacity={reward.isStart ? 1 : 0.8}
                >
                  {reward.comingSoon
                    ? <Icon name="hourglass-outline" size={16} color={PV.gray} />
                    : <Text style={[s.circleNum, !reward.unlocked && s.circleNumDark]}>
                        {reward.pointsRequired}
                      </Text>
                  }
                </TouchableOpacity>

                {/* Conector direito */}
                {isLeft && <View style={s.connector} />}

                {/* Card texto */}
                <TouchableOpacity
                  style={[s.card, reward.unlocked && s.cardActive]}
                  onPress={() => handlePress(reward)}
                  activeOpacity={reward.isStart ? 1 : 0.8}
                >
                  {reward.comingSoon
                    ? <Text style={s.cardGray}>Em breve!</Text>
                    : <>
                        <Text style={[s.cardTitle, reward.unlocked && s.cardTitleActive]}>{reward.title}</Text>
                        {reward.subtitle ? <Text style={s.cardSub}>{reward.subtitle}</Text> : null}
                        {!reward.isStart && (
                          <Text style={[s.cardCta, reward.unlocked && s.cardCtaActive]}>
                            {reward.unlocked ? 'Ver cupom →' : 'Ver detalhes →'}
                          </Text>
                        )}
                      </>
                  }
                </TouchableOpacity>

                {isLeft && reward.category ? (
                  <View style={s.catSide}>
                    <Text style={{ fontSize: 18 }}>{reward.categoryIcon}</Text>
                    <Text style={[s.catName, { color: reward.categoryColor }]}>{reward.category}</Text>
                    {!reward.unlocked && !reward.comingSoon && pointsNeeded > 0 && (
                      <Text style={s.catNote}>+{pointsNeeded} pts{'\n'}para liberar</Text>
                    )}
                  </View>
                ) : isLeft ? <View style={s.catSide} /> : null}
              </View>

              {/* Trilha vertical entre nós */}
              {!isLast && (
                <View style={s.trailSegment}>
                  {/* Estrada cinza escura com listras centrais */}
                  <View style={s.road}>
                    <View style={s.roadStripe} />
                    <View style={s.roadStripe} />
                    <View style={s.roadStripe} />
                  </View>
                  {/* Carro no ponto de progresso */}
                  {showCar && (
                    <View style={s.carOnRoad}>
                      <Text style={{ fontSize: 22 }}>🚗</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav active="lifestyle" navigation={navigation} />

      {/* ── Modal detalhes ── */}
      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={s.detailOverlay}>
          <View style={s.detailSheet}>
            {selected && (
              <>
                <TouchableOpacity style={s.detailClose} onPress={() => setSelected(null)}>
                  <Text style={s.detailCloseText}>✕</Text>
                </TouchableOpacity>
                <View style={[s.detailIconCircle, { backgroundColor: selected.categoryColor + '22' }]}>
                  <Text style={{ fontSize: 38 }}>{selected.categoryIcon}</Text>
                </View>
                {selected.category ? (
                  <View style={[s.detailCatTag, { backgroundColor: selected.categoryColor }]}>
                    <Text style={s.detailCatText}>{selected.category.toUpperCase()}</Text>
                  </View>
                ) : null}
                <Text style={s.detailTitle}>{selected.title}</Text>
                {selected.subtitle ? <Text style={s.detailPartner}>{selected.subtitle}</Text> : null}
                <View style={s.detailPtsRow}>
                  <View style={[s.detailPtsBadge, selected.unlocked && s.detailPtsBadgeOk]}>
                    <Text style={[s.detailPtsNum, selected.unlocked && s.detailPtsNumOk]}>
                      {selected.pointsRequired} pts
                    </Text>
                    <Text style={[s.detailPtsLabel, selected.unlocked && s.detailPtsLabelOk]}>
                      {selected.unlocked ? '✓ Desbloqueado' : `Você tem ${USER_POINTS} pts`}
                    </Text>
                  </View>
                </View>
                {selected.description && <Text style={s.detailDesc}>{selected.description}</Text>}
                {selected.validAt && (
                  <View style={s.detailInfo}><Icon name="location-outline" size={14} color={PV.gray} /><Text style={s.detailInfoText}>{selected.validAt}</Text></View>
                )}
                {selected.howToUse && (
                  <View style={s.detailInfo}><Icon name="bulb-outline" size={13} color={PV.gray} /><Text style={s.detailInfoText}>{selected.howToUse}</Text></View>
                )}
                {selected.expiresIn && (
                  <View style={s.detailInfo}><Icon name="time-outline" size={13} color={PV.gray} /><Text style={s.detailInfoText}>Validade: {selected.expiresIn}</Text></View>
                )}
                {selected.unlocked && !selected.isStart ? (
                  <TouchableOpacity style={[s.detailBtn, { backgroundColor: selected.categoryColor }]} onPress={() => handleUse(selected)}>
                    <Text style={s.detailBtnText}>Usar recompensa →</Text>
                  </TouchableOpacity>
                ) : !selected.unlocked && !selected.comingSoon ? (
                  <View style={s.detailBtnLocked}>
                    <Text style={s.detailBtnLockedText}>🔒 Faltam {selected.pointsRequired - USER_POINTS} pontos</Text>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { backgroundColor: PV.navy, borderRadius: 8, width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, backgroundColor: '#fff', borderRadius: 1 },
  userName: { fontSize: 13, fontWeight: '800', color: PV.navy },
  userSub: { fontSize: 9, color: PV.gray, marginTop: 1, letterSpacing: 0.3 },
  avatarBorder: { borderWidth: 2.5, borderColor: PV.navy, borderRadius: 22, padding: 2 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e0e4ea', alignItems: 'center', justifyContent: 'center' },
  // Pontos
  pointsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#f9f9fb', borderBottomWidth: 1, borderBottomColor: '#f0f2f5', gap: 8 },
  pointsLabel: { fontSize: 12, color: PV.gray },
  pointsBadge: { backgroundColor: PV.navy, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  pointsBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  // Trilha
  trail: { flex: 1, backgroundColor: '#fff' },
  trailContent: { paddingHorizontal: 12, paddingTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 0, zIndex: 1, marginVertical: 4 },
  stepLeft: {},
  stepRight: { flexDirection: 'row-reverse' },
  // Categoria lateral
  catSide: { width: 68, alignItems: 'center', flexShrink: 0 },
  catName: { fontSize: 10, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  catNote: { fontSize: 9, color: PV.gray, textAlign: 'center', lineHeight: 13, marginTop: 2 },
  // Conector horizontal
  connector: { width: 16, height: 2, backgroundColor: '#dde2ea' },
  // Círculo
  circle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2 },
  circleActive: { backgroundColor: PV.navy },
  circleInactive: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#ccc', borderStyle: 'dashed' },
  circleGray: { backgroundColor: '#f0f2f5', borderWidth: 2, borderColor: '#dde2ea', borderStyle: 'solid' },
  circleNum: { fontSize: 15, fontWeight: '900', color: '#fff' },
  circleNumDark: { color: '#888' },
  // Card texto
  card: { flex: 1, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#f5f6f8', borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: 'transparent' },
  cardActive: { backgroundColor: '#eef2f8', borderColor: PV.navy + '30' },
  cardGray: { fontSize: 13, fontWeight: '700', color: '#aab0bc' },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#888', lineHeight: 18 },
  cardTitleActive: { color: PV.navy },
  cardSub: { fontSize: 11, color: '#aab0bc', marginTop: 1 },
  cardCta: { fontSize: 10, color: '#aab0bc', marginTop: 3 },
  cardCtaActive: { color: PV.navy, fontWeight: '600' },
  // Estrada
  trailSegment: { alignItems: 'center', position: 'relative', marginVertical: 0 },
  road: { width: 28, height: 52, backgroundColor: '#555', borderRadius: 2, alignItems: 'center', justifyContent: 'space-around', paddingVertical: 6 },
  roadStripe: { width: 4, height: 8, backgroundColor: '#fff', borderRadius: 1, opacity: 0.9 },
  carOnRoad: { position: 'absolute', top: '30%', left: '50%', transform: [{ translateX: -11 }] },
  // Bottom nav
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: PV.grayLight },
  navLabelActive: { color: PV.navy, fontWeight: '700' },
  // Modal
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  detailSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 28, alignItems: 'center' },
  detailClose: { position: 'absolute', top: 18, right: 22, width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center' },
  detailCloseText: { fontSize: 13, color: '#666', fontWeight: '700' },
  detailIconCircle: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 6 },
  detailCatTag: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 3, marginBottom: 10 },
  detailCatText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  detailTitle: { fontSize: 19, fontWeight: '800', color: PV.navy, textAlign: 'center', marginBottom: 3 },
  detailPartner: { fontSize: 13, color: PV.gray, marginBottom: 12 },
  detailPtsRow: { marginBottom: 14 },
  detailPtsBadge: { backgroundColor: '#f0f2f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 7, alignItems: 'center' },
  detailPtsBadgeOk: { backgroundColor: '#e8f5e9' },
  detailPtsNum: { fontSize: 17, fontWeight: '900', color: '#666' },
  detailPtsNumOk: { color: '#27ae60' },
  detailPtsLabel: { fontSize: 11, color: '#aab0bc', marginTop: 2 },
  detailPtsLabelOk: { color: '#27ae60' },
  detailDesc: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 19, marginBottom: 14 },
  detailInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 7, width: '100%' },
  detailInfoIcon: { fontSize: 13, marginTop: 1 },
  detailInfoText: { fontSize: 12, color: PV.gray, flex: 1, lineHeight: 17 },
  detailBtn: { borderRadius: 30, height: 48, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 14 },
  detailBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  detailBtnLocked: { backgroundColor: '#f5f6f8', borderRadius: 30, height: 48, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 14 },
  detailBtnLockedText: { fontSize: 13, color: PV.gray, fontWeight: '600' },
});
