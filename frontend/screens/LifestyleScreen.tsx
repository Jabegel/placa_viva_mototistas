import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, StatusBar, Platform, Image, Modal,
} from 'react-native';
import { useUser } from '../context/UserContext';

const NAVY = '#1a2e4a';
const ORANGE = '#e8820c';

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
  // Detalhes para o modal
  description?: string;
  validAt?: string;
  howToUse?: string;
  expiresIn?: string;
};

const REWARDS: Reward[] = [
  {
    id: 'r0',
    category: '', categoryColor: '#aaa', categoryIcon: '⏳',
    title: 'Em breve!', subtitle: '',
    pointsRequired: 0, unlocked: false, comingSoon: true,
    description: 'Nova recompensa chegando em breve. Fique ligado!',
  },
  {
    id: 'r5',
    category: 'Beleza', categoryColor: '#c0396b', categoryIcon: '💅',
    title: 'Manicure grátis', subtitle: 'Studio Bella',
    pointsRequired: 80, unlocked: false,
    description: 'Ganhe uma sessão de manicure completa no Studio Bella, com nail art incluída.',
    validAt: 'Unidade Asa Norte, Asa Sul e Sudoeste',
    howToUse: 'Apresente o cupom na recepção antes de iniciar o atendimento.',
    expiresIn: '30 dias após resgatar',
  },
  {
    id: 'r4',
    category: 'Saúde', categoryColor: '#27ae60', categoryIcon: '🏋️',
    title: 'Aula de academia grátis', subtitle: 'Smart Fit',
    pointsRequired: 60, unlocked: false,
    description: 'Uma semana de acesso livre em qualquer unidade Smart Fit do DF.',
    validAt: 'Todas as unidades do Distrito Federal',
    howToUse: 'Mostre o QR Code do cupom na entrada.',
    expiresIn: '15 dias após resgatar',
  },
  {
    id: 'r1',
    category: 'Cultura', categoryColor: '#6a3d9a', categoryIcon: '🎭',
    title: 'Ingressos com 50% off', subtitle: 'Cine Drive-in',
    pointsRequired: 50, unlocked: false,
    description: 'Na compra de qualquer sessão, o segundo ingresso sai pela metade do preço.',
    validAt: 'Cine Drive-in do Parque da Cidade',
    howToUse: 'Apresente o cupom na bilheteria antes de pagar.',
    expiresIn: '45 dias após resgatar',
  },
  {
    id: 'r2',
    category: 'Gastronomia', categoryColor: ORANGE, categoryIcon: '🍽️',
    title: 'Café grátis!', subtitle: 'Maria Amélia',
    pointsRequired: 25, unlocked: true,
    description: 'Na compra de uma fatia de bolo ou torta, o café é por nossa conta.',
    validAt: 'Unidade do Jardim Botânico',
    howToUse: 'Apresente este cupom no caixa antes de pagar.',
    expiresIn: '20 dias após resgatar',
  },
  {
    id: 'r3',
    category: 'Início', categoryColor: NAVY, categoryIcon: '🚗',
    title: 'Bem-vindo ao Placa Viva!', subtitle: 'Ponto de partida',
    pointsRequired: 10, unlocked: true, isStart: true,
    description: 'Você começou sua jornada de benefícios. Continue abastecendo para ganhar mais pontos!',
  },
];

export default function LifestyleScreen({ navigation }: any) {
  const { user } = useUser();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const handleRewardPress = (reward: Reward) => {
    if (reward.isStart) return;
    setSelectedReward(reward);
  };

  const handleUseReward = (reward: Reward) => {
    setSelectedReward(null);
    navigation.navigate('LifestyleCoupon', { reward });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
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
            <Text style={styles.userName}>{(user.name || 'Usuário').toUpperCase()}</Text>
            <Text style={styles.userSub}>MEU LIFESTYLE</Text>
          </View>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeNum}>{USER_POINTS}</Text>
          <Text style={styles.pointsBadgeLabel}>pts</Text>
        </View>
      </View>

      {/* Subtítulo */}
      <View style={styles.pointsRow}>
        <Text style={styles.pointsLabel}>Pontos Lifestyle</Text>
        <View style={styles.pointsInline}>
          <Text style={styles.pointsInlineNum}>⭐ {USER_POINTS} pontos acumulados</Text>
        </View>
      </View>

      {/* Trilha */}
      <ScrollView style={styles.trail} contentContainerStyle={styles.trailContent} showsVerticalScrollIndicator={false}>
        {REWARDS.map((reward, index) => {
          const isLeft = index % 2 === 0;
          const isLast = index === REWARDS.length - 1;
          const canUnlock = USER_POINTS >= reward.pointsRequired && !reward.comingSoon;
          const pointsNeeded = reward.pointsRequired - USER_POINTS;

          return (
            <View key={reward.id} style={styles.trailStep}>
              {!isLast && (
                <View style={styles.trailLineWrapper}>
                  <View style={[styles.trailLine, { borderColor: reward.unlocked ? NAVY : '#dde2ea' }]} />
                </View>
              )}

              <View style={[styles.stepRow, isLeft ? styles.stepLeft : styles.stepRight]}>
                {/* Categoria (lado oposto ao card) */}
                {!isLeft && (
                  <View style={styles.categoryBubble}>
                    {reward.category ? (
                      <>
                        <View style={[styles.categoryDot, { backgroundColor: reward.categoryColor }]}>
                          <Text style={{ fontSize: 11 }}>{reward.categoryIcon}</Text>
                        </View>
                        <Text style={[styles.categoryName, { color: reward.categoryColor }]}>
                          {reward.category}
                        </Text>
                        {!reward.unlocked && !reward.comingSoon && pointsNeeded > 0 && (
                          <Text style={styles.categoryNote}>+{pointsNeeded} pts{'\n'}para liberar</Text>
                        )}
                      </>
                    ) : null}
                  </View>
                )}

                {/* Círculo de pontos */}
                <TouchableOpacity
                  style={[
                    styles.pointCircle,
                    reward.unlocked ? styles.pointCircleActive : styles.pointCircleInactive,
                    reward.comingSoon && styles.pointCircleGray,
                    canUnlock && !reward.unlocked && styles.pointCircleReady,
                  ]}
                  onPress={() => handleRewardPress(reward)}
                  activeOpacity={reward.isStart ? 1 : 0.8}
                >
                  {reward.comingSoon ? (
                    <Text style={{ fontSize: 18 }}>⏳</Text>
                  ) : (
                    <>
                      <Text style={[styles.pointCircleText, !reward.unlocked && styles.pointCircleTextDark]}>
                        {reward.pointsRequired}
                      </Text>
                      {reward.unlocked && <Text style={styles.pointCircleCheck}>✓</Text>}
                    </>
                  )}
                </TouchableOpacity>

                {/* Card da recompensa */}
                <TouchableOpacity
                  style={[styles.rewardCard, reward.unlocked && styles.rewardCardActive]}
                  onPress={() => handleRewardPress(reward)}
                  activeOpacity={reward.isStart ? 1 : 0.8}
                >
                  {reward.comingSoon ? (
                    <Text style={styles.comingSoonText}>Em breve!</Text>
                  ) : (
                    <>
                      <Text style={[styles.rewardTitle, reward.unlocked && styles.rewardTitleActive]}>
                        {reward.title}
                      </Text>
                      {reward.subtitle ? (
                        <Text style={[styles.rewardSubtitle, reward.unlocked && styles.rewardSubtitleActive]}>
                          {reward.subtitle}
                        </Text>
                      ) : null}
                      {!reward.isStart && (
                        <Text style={[styles.rewardCta, reward.unlocked && styles.rewardCtaActive]}>
                          {reward.unlocked ? 'Ver cupom →' : 'Ver detalhes →'}
                        </Text>
                      )}
                    </>
                  )}
                </TouchableOpacity>

                {isLeft && reward.category ? (
                  <View style={styles.categoryBubble}>
                    <View style={[styles.categoryDot, { backgroundColor: reward.categoryColor }]}>
                      <Text style={{ fontSize: 11 }}>{reward.categoryIcon}</Text>
                    </View>
                    <Text style={[styles.categoryName, { color: reward.categoryColor }]}>
                      {reward.category}
                    </Text>
                    {!reward.unlocked && !reward.comingSoon && pointsNeeded > 0 && (
                      <Text style={styles.categoryNote}>+{pointsNeeded} pts{'\n'}para liberar</Text>
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

      {/* Modal de detalhes da recompensa */}
      <Modal
        visible={!!selectedReward}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedReward(null)}
      >
        <View style={styles.detailOverlay}>
          <View style={styles.detailSheet}>
            {selectedReward && (
              <>
                <TouchableOpacity style={styles.detailClose} onPress={() => setSelectedReward(null)}>
                  <Text style={styles.detailCloseText}>✕</Text>
                </TouchableOpacity>

                {/* Ícone e categoria */}
                <View style={[styles.detailIconCircle, { backgroundColor: selectedReward.categoryColor + '20' }]}>
                  <Text style={{ fontSize: 36 }}>{selectedReward.categoryIcon}</Text>
                </View>

                <View style={[styles.detailCategoryTag, { backgroundColor: selectedReward.categoryColor }]}>
                  <Text style={styles.detailCategoryText}>{selectedReward.category.toUpperCase()}</Text>
                </View>

                <Text style={styles.detailTitle}>{selectedReward.title}</Text>
                {selectedReward.subtitle ? (
                  <Text style={styles.detailPartner}>{selectedReward.subtitle}</Text>
                ) : null}

                {/* Pontos */}
                <View style={styles.detailPointsRow}>
                  <View style={[styles.detailPointsBadge,
                    selectedReward.unlocked ? styles.detailPointsBadgeActive : {}]}>
                    <Text style={[styles.detailPointsNum, selectedReward.unlocked && styles.detailPointsNumActive]}>
                      {selectedReward.pointsRequired} pts
                    </Text>
                    <Text style={[styles.detailPointsLabel, selectedReward.unlocked && styles.detailPointsLabelActive]}>
                      {selectedReward.unlocked ? '✓ Desbloqueado' : `Você tem ${USER_POINTS} pts`}
                    </Text>
                  </View>
                </View>

                {/* Descrição */}
                {selectedReward.description && (
                  <Text style={styles.detailDesc}>{selectedReward.description}</Text>
                )}

                {/* Infos */}
                {selectedReward.validAt && (
                  <View style={styles.detailInfoRow}>
                    <Text style={styles.detailInfoIcon}>📍</Text>
                    <Text style={styles.detailInfoText}>{selectedReward.validAt}</Text>
                  </View>
                )}
                {selectedReward.howToUse && (
                  <View style={styles.detailInfoRow}>
                    <Text style={styles.detailInfoIcon}>💡</Text>
                    <Text style={styles.detailInfoText}>{selectedReward.howToUse}</Text>
                  </View>
                )}
                {selectedReward.expiresIn && (
                  <View style={styles.detailInfoRow}>
                    <Text style={styles.detailInfoIcon}>⏰</Text>
                    <Text style={styles.detailInfoText}>Validade: {selectedReward.expiresIn}</Text>
                  </View>
                )}

                {/* Botão */}
                {selectedReward.unlocked && !selectedReward.isStart ? (
                  <TouchableOpacity
                    style={[styles.detailButton, { backgroundColor: selectedReward.categoryColor }]}
                    onPress={() => handleUseReward(selectedReward)}
                  >
                    <Text style={styles.detailButtonText}>Usar recompensa →</Text>
                  </TouchableOpacity>
                ) : !selectedReward.unlocked && !selectedReward.comingSoon ? (
                  <View style={styles.detailButtonLocked}>
                    <Text style={styles.detailButtonLockedText}>
                      🔒 Faltam {selectedReward.pointsRequired - USER_POINTS} pontos para desbloquear
                    </Text>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogoBox: { backgroundColor: NAVY, borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1 },
  userName: { fontSize: 14, fontWeight: '800', color: NAVY },
  userSub: { fontSize: 10, color: '#7a8a9a', marginTop: 1, letterSpacing: 0.5 },
  pointsBadge: { backgroundColor: NAVY, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  pointsBadgeNum: { fontSize: 18, fontWeight: '900', color: '#fff', lineHeight: 20 },
  pointsBadgeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
  pointsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#f9f9fb', borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  pointsLabel: { fontSize: 13, color: '#7a8a9a', fontWeight: '500' },
  pointsInline: {},
  pointsInlineNum: { fontSize: 12, color: NAVY, fontWeight: '600' },
  trail: { flex: 1 },
  trailContent: { paddingHorizontal: 16, paddingTop: 12 },
  trailStep: { position: 'relative', marginBottom: 0 },
  trailLineWrapper: { position: 'absolute', left: '50%', top: 44, bottom: -20, width: 3, alignItems: 'center', zIndex: 0 },
  trailLine: { flex: 1, width: 2, borderStyle: 'dashed', borderWidth: 1.5 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 0, zIndex: 1 },
  stepLeft: { justifyContent: 'flex-start' },
  stepRight: { justifyContent: 'flex-end' },
  pointCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', zIndex: 2, flexShrink: 0, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 5, elevation: 3 },
  pointCircleActive: { backgroundColor: NAVY },
  pointCircleInactive: { backgroundColor: '#e8e8e8', borderWidth: 2, borderColor: '#ccc' },
  pointCircleReady: { backgroundColor: '#27ae60', borderWidth: 0 },
  pointCircleGray: { backgroundColor: '#f0f2f5', borderWidth: 2, borderColor: '#dde2ea' },
  pointCircleText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  pointCircleTextDark: { color: '#666' },
  pointCircleCheck: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: -2 },
  rewardCard: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f5f6f8', borderRadius: 12, marginHorizontal: 6, borderWidth: 1, borderColor: 'transparent' },
  rewardCardActive: { backgroundColor: '#eef2f8', borderColor: NAVY + '30' },
  rewardTitle: { fontSize: 13, fontWeight: '700', color: '#666', lineHeight: 18 },
  rewardTitleActive: { color: NAVY },
  rewardSubtitle: { fontSize: 11, color: '#aab0bc', marginTop: 2 },
  rewardSubtitleActive: { color: '#7a8a9a' },
  rewardCta: { fontSize: 10, color: '#aab0bc', marginTop: 4 },
  rewardCtaActive: { color: NAVY, fontWeight: '600' },
  comingSoonText: { fontSize: 13, fontWeight: '700', color: '#aab0bc' },
  categoryBubble: { width: 72, alignItems: 'center', flexShrink: 0 },
  categoryDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  categoryName: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  categoryNote: { fontSize: 9, color: '#7a8a9a', textAlign: 'center', marginTop: 2, lineHeight: 13 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 20 : 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
  // Modal detalhes
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  detailSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 28, alignItems: 'center' },
  detailClose: { position: 'absolute', top: 20, right: 24, width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f2f5', alignItems: 'center', justifyContent: 'center' },
  detailCloseText: { fontSize: 14, color: '#666', fontWeight: '700' },
  detailIconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12, marginTop: 8 },
  detailCategoryTag: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12 },
  detailCategoryText: { fontSize: 11, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  detailTitle: { fontSize: 20, fontWeight: '800', color: NAVY, textAlign: 'center', marginBottom: 4 },
  detailPartner: { fontSize: 13, color: '#7a8a9a', marginBottom: 14 },
  detailPointsRow: { marginBottom: 16 },
  detailPointsBadge: { backgroundColor: '#f0f2f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' },
  detailPointsBadgeActive: { backgroundColor: '#e8f5e9' },
  detailPointsNum: { fontSize: 18, fontWeight: '900', color: '#666' },
  detailPointsNumActive: { color: '#27ae60' },
  detailPointsLabel: { fontSize: 11, color: '#aab0bc', marginTop: 2 },
  detailPointsLabelActive: { color: '#27ae60' },
  detailDesc: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  detailInfoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8, width: '100%' },
  detailInfoIcon: { fontSize: 14, marginTop: 1 },
  detailInfoText: { fontSize: 12, color: '#7a8a9a', flex: 1, lineHeight: 18 },
  detailButton: { borderRadius: 30, height: 50, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 16 },
  detailButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  detailButtonLocked: { backgroundColor: '#f5f6f8', borderRadius: 30, height: 50, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 16 },
  detailButtonLockedText: { fontSize: 13, color: '#7a8a9a', fontWeight: '600' },
});
