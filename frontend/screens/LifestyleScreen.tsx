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
  Image,
} from 'react-native';

const NAVY = '#1a2e4a';
const ORANGE = '#e8820c';

// ─── DADOS MOCK ───────────────────────────────────────────────────────────────
const USER = {
  name: 'ARLITON',
  fullName: 'GRANBEIRO MEZZETH ALENCAR',
  points: 25,
  avatar: 'https://i.pravatar.cc/80?img=12',
};

type Reward = {
  id: string;
  category: string;
  categoryColor: string;
  categoryIcon: string;
  title: string;
  subtitle: string;
  pointsRequired: number;
  pointsLabel: string;
  unlocked: boolean;
  isStart?: boolean;
  comingSoon?: boolean;
};

const REWARDS: Reward[] = [
  {
    id: 'r0',
    category: '',
    categoryColor: '#aaa',
    categoryIcon: '⏳',
    title: 'Em breve!',
    subtitle: '',
    pointsRequired: 0,
    pointsLabel: '',
    unlocked: false,
    comingSoon: true,
  },
  {
    id: 'r1',
    category: 'Cultura',
    categoryColor: '#6a3d9a',
    categoryIcon: '🎭',
    title: 'Ingressos com 50% off',
    subtitle: 'Cine Drive-in',
    pointsRequired: 50,
    pointsLabel: '50',
    unlocked: false,
  },
  {
    id: 'r2',
    category: 'Gastronomia',
    categoryColor: ORANGE,
    categoryIcon: '🍽️',
    title: 'Café Grátis!',
    subtitle: 'Maria Amélia',
    pointsRequired: 25,
    pointsLabel: '25',
    unlocked: true,
    // nota: +25 pontos para liberar
  },
  {
    id: 'r3',
    category: 'Início',
    categoryColor: NAVY,
    categoryIcon: '🚗',
    title: 'Bem-vindo ao Placa Viva!',
    subtitle: 'Ponto de partida',
    pointsRequired: 10,
    pointsLabel: '10',
    unlocked: true,
    isStart: true,
  },
];

export default function LifestyleScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'lifestyle' | 'coupons'>('lifestyle');

  const handleRewardPress = (reward: Reward) => {
    if (reward.comingSoon || reward.isStart) return;
    navigation.navigate('LifestyleCoupon', { reward });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header do usuário */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerLogoBox}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 7, backgroundColor: '#fff' }]} />
              <View style={[styles.bar, { height: 12, backgroundColor: '#fff' }]} />
              <View style={[styles.bar, { height: 9, backgroundColor: '#fff' }]} />
            </View>
          </View>
          <View>
            <Text style={styles.userName}>{USER.name}</Text>
            <Text style={styles.userFull}>{USER.fullName}</Text>
          </View>
        </View>
        <Image source={{ uri: USER.avatar }} style={styles.avatar} />
      </View>

      {/* Pontos Lifestyle */}
      <View style={styles.pointsRow}>
        <Text style={styles.pointsLabel}>Pontos Lifestyle</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>{USER.points}</Text>
        </View>
      </View>

      {/* Trilha */}
      <ScrollView
        style={styles.trail}
        contentContainerStyle={styles.trailContent}
        showsVerticalScrollIndicator={false}
      >
        {REWARDS.map((reward, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === REWARDS.length - 1;

          return (
            <View key={reward.id} style={styles.trailStep}>
              {/* Linha vertical da trilha */}
              {!isLast && (
                <View style={styles.trailLineWrapper}>
                  <View style={styles.trailLine} />
                  {/* Ícone de carro na trilha */}
                  {index === 1 && (
                    <View style={styles.trailCarIcon}>
                      <Text style={{ fontSize: 18 }}>🚗</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Linha do step: badge + card (alternando lados) */}
              <View style={[styles.stepRow, isLeft ? styles.stepLeft : styles.stepRight]}>

                {/* Lado do texto (categoria + subtítulo) */}
                {!isLeft && (
                  <View style={styles.categoryBubble}>
                    {reward.category ? (
                      <>
                        <View style={[styles.categoryDot, { backgroundColor: reward.categoryColor }]}>
                          <Text style={{ fontSize: 10 }}>{reward.categoryIcon}</Text>
                        </View>
                        <Text style={[styles.categoryName, { color: reward.categoryColor }]}>
                          {reward.category}
                        </Text>
                        {reward.id === 'r2' && (
                          <Text style={styles.categoryNote}>+25 pontos{'\n'}para liberar</Text>
                        )}
                      </>
                    ) : null}
                  </View>
                )}

                {/* Círculo central com pontos */}
                <TouchableOpacity
                  style={[
                    styles.pointCircle,
                    reward.unlocked ? styles.pointCircleActive : styles.pointCircleInactive,
                    reward.comingSoon && styles.pointCircleGray,
                  ]}
                  onPress={() => handleRewardPress(reward)}
                  activeOpacity={reward.comingSoon || reward.isStart ? 1 : 0.8}
                >
                  {reward.comingSoon ? (
                    <Text style={{ fontSize: 18 }}>⏳</Text>
                  ) : (
                    <Text style={styles.pointCircleText}>{reward.pointsLabel}</Text>
                  )}
                </TouchableOpacity>

                {/* Lado do texto (lado direito ou esquerdo) */}
                {isLeft && (
                  <View style={styles.rewardCard}>
                    {reward.comingSoon ? (
                      <Text style={styles.comingSoonText}>Em breve!</Text>
                    ) : (
                      <>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        {reward.subtitle ? (
                          <Text style={styles.rewardSubtitle}>{reward.subtitle}</Text>
                        ) : null}
                      </>
                    )}
                  </View>
                )}

                {!isLeft && (
                  <View style={styles.rewardCard}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    {reward.subtitle ? (
                      <Text style={styles.rewardSubtitle}>{reward.subtitle}</Text>
                    ) : null}
                  </View>
                )}

                {isLeft && reward.category ? (
                  <View style={styles.categoryBubble}>
                    <View style={[styles.categoryDot, { backgroundColor: reward.categoryColor }]}>
                      <Text style={{ fontSize: 10 }}>{reward.categoryIcon}</Text>
                    </View>
                    <Text style={[styles.categoryName, { color: reward.categoryColor }]}>
                      {reward.category}
                    </Text>
                    {reward.id === 'r2' && (
                      <Text style={styles.categoryNote}>+25 pontos{'\n'}para liberar</Text>
                    )}
                  </View>
                ) : isLeft ? <View style={styles.categoryBubble} /> : null}
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons',    active: false, onPress: () => navigation.navigate('Coupons') },
          { icon: '📍', label: 'Mapa',      active: false, onPress: () => {} },
          { icon: '❤️', label: 'LifeStyle', active: true,  onPress: () => {} },
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
  safeArea: { flex: 1, backgroundColor: '#fff' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f2f5',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogoBox: {
    backgroundColor: NAVY, borderRadius: 8,
    width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
  },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1 },
  userName: { fontSize: 14, fontWeight: '800', color: NAVY },
  userFull: { fontSize: 10, color: '#7a8a9a', marginTop: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: NAVY },

  // Pontos
  pointsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    paddingHorizontal: 20, paddingVertical: 10, gap: 8,
  },
  pointsLabel: { fontSize: 13, color: '#7a8a9a', fontWeight: '500' },
  pointsBadge: {
    backgroundColor: NAVY, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 3,
  },
  pointsBadgeText: { fontSize: 13, fontWeight: '800', color: '#fff' },

  // Trilha
  trail: { flex: 1 },
  trailContent: { paddingHorizontal: 20, paddingTop: 8 },

  trailStep: { position: 'relative', marginBottom: 0 },
  trailLineWrapper: {
    position: 'absolute',
    left: '50%',
    top: 44,
    bottom: -20,
    width: 3,
    alignItems: 'center',
    zIndex: 0,
  },
  trailLine: {
    flex: 1,
    width: 3,
    backgroundColor: '#dde2ea',
    // padrão tracejado via bordas alternadas — simula estrada
    borderStyle: 'dashed',
    borderColor: '#7a8a9a',
    borderWidth: 1.5,
  },
  trailCarIcon: {
    position: 'absolute',
    top: '40%',
    left: -10,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 0,
    zIndex: 1,
  },
  stepLeft: { justifyContent: 'flex-start' },
  stepRight: { justifyContent: 'flex-end' },

  // Círculo de pontos
  pointCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2, flexShrink: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  pointCircleActive: { backgroundColor: NAVY },
  pointCircleInactive: { backgroundColor: '#e0e0e0', borderWidth: 2, borderColor: '#bbb' },
  pointCircleGray: { backgroundColor: '#f0f2f5', borderWidth: 2, borderColor: '#dde2ea' },
  pointCircleText: { fontSize: 16, fontWeight: '900', color: '#fff' },

  // Cards
  rewardCard: {
    flex: 1, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#f5f6f8', borderRadius: 12, marginHorizontal: 6,
  },
  rewardTitle: { fontSize: 14, fontWeight: '700', color: NAVY, lineHeight: 20 },
  rewardSubtitle: { fontSize: 12, color: '#7a8a9a', marginTop: 2 },
  comingSoonText: { fontSize: 14, fontWeight: '700', color: '#aab0bc' },

  // Categoria
  categoryBubble: {
    width: 80, alignItems: 'center', flexShrink: 0,
  },
  categoryDot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  categoryName: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  categoryNote: { fontSize: 10, color: '#7a8a9a', textAlign: 'center', marginTop: 2, lineHeight: 14 },

  // Bottom Nav
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
});
