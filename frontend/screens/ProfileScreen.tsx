import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Modal, StatusBar, Platform, Image,
} from 'react-native';

const NAVY = '#1a2e4a';

const MENU_ITEMS = [
  { id: 'personal',  icon: '👤', label: 'Informações Pessoais', screen: 'PersonalInfo' },
  { id: 'vehicles',  icon: '🚗', label: 'Veículos Cadastrados',  screen: 'Vehicles', badge: true },
  { id: 'favorite',  icon: '⭐', label: 'Posto Favorito',        screen: null },
  { id: 'security',  icon: '🔒', label: 'Segurança',             screen: null },
  { id: 'terms',     icon: '📄', label: 'Termos e Política',     screen: null },
  { id: 'logout',    icon: '🚪', label: 'Sair do aplicativo',    screen: 'logout', danger: true },
];

export default function ProfileScreen({ navigation }: any) {
  const [logoutModal, setLogoutModal] = useState(false);

  const handleMenuPress = (item: typeof MENU_ITEMS[0]) => {
    if (item.id === 'logout') { setLogoutModal(true); return; }
    if (item.screen) navigation.navigate(item.screen);
  };

  const confirmLogout = () => {
    setLogoutModal(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header logo */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoPlaca}>PLACA </Text>
          <Text style={styles.logoViva}>VIVA</Text>
          <View style={styles.logoIcon}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 5, backgroundColor: NAVY }]} />
              <View style={[styles.bar, { height: 9, backgroundColor: NAVY }]} />
              <View style={[styles.bar, { height: 7, backgroundColor: NAVY }]} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={{ fontSize: 48 }}>👤</Text>
            </View>
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>Nome do Usuário</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>!</Text>
                  </View>
                )}
                {!item.danger && <Text style={styles.menuChevron}>›</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons',    onPress: () => navigation.navigate('Coupons') },
          { icon: '📍', label: 'Mapa',      onPress: () => {} },
          { icon: '❤️', label: 'LifeStyle', onPress: () => navigation.navigate('Lifestyle') },
          { icon: '↗️', label: 'Indicar',   onPress: () => navigation.navigate('Share') },
          { icon: '☰', label: 'Menu',      onPress: () => {}, active: true },
        ].map((item: any) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal Logout */}
      <Modal visible={logoutModal} transparent animationType="fade" onRequestClose={() => setLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>Gostaria de sair do aplicativo?{'\n'}Você precisará entrar novamente.</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={[styles.confirmBtn, styles.confirmBtnNo]} onPress={() => setLogoutModal(false)}>
                <Text style={styles.confirmBtnNoText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, styles.confirmBtnYes]} onPress={confirmLogout}>
                <Text style={styles.confirmBtnYesText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoPlaca: { fontSize: 17, fontWeight: '800', color: NAVY, letterSpacing: 1 },
  logoViva: { fontSize: 17, fontWeight: '900', color: NAVY, letterSpacing: 2 },
  logoIcon: { backgroundColor: NAVY, borderRadius: 5, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 3, borderRadius: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 28, backgroundColor: '#fff', marginBottom: 12 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#e0e4ea', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: NAVY, borderStyle: 'dashed' },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: NAVY, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  avatarEditText: { fontSize: 12 },
  userName: { fontSize: 16, fontWeight: '700', color: NAVY },
  menuList: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: { fontSize: 14, color: NAVY, fontWeight: '500' },
  menuLabelDanger: { color: '#e74c3c' },
  menuItemRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notifBadge: { backgroundColor: '#e74c3c', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  menuChevron: { fontSize: 20, color: '#bbb' },
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  confirmModal: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '78%', alignItems: 'center' },
  confirmText: { fontSize: 14, color: NAVY, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  confirmButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmBtn: { flex: 1, height: 42, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  confirmBtnNo: { backgroundColor: '#e74c3c' },
  confirmBtnYes: { backgroundColor: '#27ae60' },
  confirmBtnNoText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  confirmBtnYesText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
