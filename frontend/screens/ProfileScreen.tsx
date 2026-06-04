import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Modal, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { Icon, MenuBottomNav, PV, LogoIcon } from '../components/PlacaVivaUI';

const MENU_ITEMS = [
  { id: 'personal', icon: 'person-outline',        label: 'Informações Pessoais', screen: 'PersonalInfo' },
  { id: 'vehicles', icon: 'car-outline',            label: 'Veículos Cadastrados',  screen: 'Vehicles', badge: true },
  { id: 'favorite', icon: 'star-outline',           label: 'Posto Favorito',        screen: null },
  { id: 'history',  icon: 'document-text-outline',  label: 'Ver Histórico',         screen: 'TruckHistory', pro: true },
  { id: 'security', icon: 'lock-closed-outline',    label: 'Segurança',             screen: null },
  { id: 'terms',    icon: 'reader-outline',          label: 'Termos e Política',     screen: null },
  { id: 'logout',   icon: 'log-out-outline',         label: 'Sair do aplicativo',    screen: 'logout', danger: true },
] as { id: string; icon: any; label: string; screen: string | null; badge?: boolean; pro?: boolean; danger?: boolean }[];

export default function ProfileScreen({ navigation }: any) {
  const { user } = useUser();
  const [logoutModal, setLogoutModal] = useState(false);

  const handlePress = (item: typeof MENU_ITEMS[0]) => {
    if (item.id === 'logout') { setLogoutModal(true); return; }
    if (item.screen) navigation.navigate(item.screen);
  };

  const confirmLogout = () => {
    setLogoutModal(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={PV.navy} />

      {/* Header navy com logo */}
      <View style={s.header}>
        <LogoIcon size={28} />
        <Text style={s.headerLogo}>PLACA <Text style={{ fontWeight: '900', letterSpacing: 3 }}>VIVA</Text></Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar retângulo com câmera */}
        <View style={s.avatarSection}>
          <View style={s.avatarRect}>
            <Text style={{ fontSize: 52, opacity: 0.35 }}>👤</Text>
            <View style={s.cameraBtn}>
              <Icon name="camera-outline" size={12} color={PV.gray} />
            </View>
          </View>
          <Text style={s.userName}>{user.name || 'Nome do Usuário'}</Text>
        </View>

        {/* Menu */}
        <View style={s.menuList}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={[s.menuItem, i < MENU_ITEMS.length - 1 && s.menuBorder]}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              <View style={s.menuLeft}>
                <Icon
                  name={item.icon}
                  size={19}
                  color={(item as any).danger ? '#e74c3c' : PV.navy}
                />
                <Text style={[s.menuLabel, (item as any).danger && s.menuDanger]}>
                  {item.label}
                </Text>
              </View>
              <View style={s.menuRight}>
                {(item as any).badge && (
                  <View style={s.notifDot}><Text style={s.notifDotText}>!</Text></View>
                )}
                {(item as any).pro && (
                  <View style={s.proBadge}><Text style={s.proText}>PRO</Text></View>
                )}
                {!(item as any).danger && <Text style={s.chevron}>›</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      <MenuBottomNav navigation={navigation} />

      {/* Modal logout */}
      <Modal visible={logoutModal} transparent animationType="fade" onRequestClose={() => setLogoutModal(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalText}>Deseja realmente sair do aplicativo?{'\n'}Será preciso entrar novamente.</Text>
            <View style={s.modalBtns}>
              <TouchableOpacity style={[s.modalBtn, s.btnNo]} onPress={() => setLogoutModal(false)}>
                <Text style={s.btnText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, s.btnYes]} onPress={confirmLogout}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: PV.navy, paddingHorizontal: 20, paddingVertical: 14 },
  headerLogo: { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  avatarSection: { alignItems: 'center', backgroundColor: '#fff', paddingVertical: 24, marginBottom: 12 },
  avatarRect: { width: '90%', height: 120, backgroundColor: '#d8dde6', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative' },
  cameraBtn: { position: 'absolute', bottom: 8, right: 8, backgroundColor: PV.navy, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: PV.navy },
  menuList: { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { fontSize: 17, width: 22, textAlign: 'center' },
  menuLabel: { fontSize: 14, color: PV.navy, fontWeight: '500' },
  menuDanger: { color: '#e74c3c' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  notifDot: { backgroundColor: '#e74c3c', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  notifDotText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  proBadge: { backgroundColor: '#e8820c', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  proText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  chevron: { fontSize: 20, color: '#bbb' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 16, padding: 22, width: '78%', alignItems: 'center' },
  modalText: { fontSize: 13, color: PV.navy, textAlign: 'center', lineHeight: 21, marginBottom: 18 },
  modalBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, height: 40, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnNo: { backgroundColor: '#e74c3c' },
  btnYes: { backgroundColor: '#27ae60' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
