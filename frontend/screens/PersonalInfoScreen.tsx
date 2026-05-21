import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, StatusBar, Platform, Alert, Modal,
} from 'react-native';

const NAVY = '#1a2e4a';
const GREEN = '#27ae60';

export default function PersonalInfoScreen({ navigation }: any) {
  const [form, setForm] = useState({
    name: 'Cicrano de Tal',
    phone: '+55 1...',
    email: '',
    birthDate: '10/01/1986',
    gender: 'Masculino',
  });
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    Alert.alert('Sucesso', 'Informações salvas com sucesso!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informações Pessoais</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.editImageText}>Editar Imagem</Text>
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={v => set('name', v)}
            placeholder="Seu nome completo"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Número de Celular</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={v => set('phone', v)}
            keyboardType="phone-pad"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TouchableOpacity style={styles.confirmBadge}>
              <Text style={styles.confirmBadgeText}>Confirmar e-mail</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={v => set('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu email"
            placeholderTextColor="#bbb"
          />
          {emailUnconfirmed && (
            <View style={styles.warningRow}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>Adicione um e-mail de recuperação monitorado</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={form.birthDate}
            onChangeText={v => set('birthDate', v)}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            placeholderTextColor="#bbb"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Sexo</Text>
          <View style={styles.selectWrapper}>
            <Text style={styles.selectText}>{form.gender}</Text>
            <Text style={styles.selectChevron}>⌄</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

function BottomNav({ navigation }: any) {
  return (
    <View style={styles.bottomNav}>
      {[
        { icon: '🎫', label: 'Cupons',    onPress: () => navigation.navigate('Coupons') },
        { icon: '📍', label: 'Mapa',      onPress: () => {} },
        { icon: '❤️', label: 'LifeStyle', onPress: () => navigation.navigate('Lifestyle') },
        { icon: '↗️', label: 'Indicar',   onPress: () => navigation.navigate('Share') },
        { icon: '☰', label: 'Menu',      onPress: () => navigation.navigate('Profile'), active: true },
      ].map((item: any) => (
        <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: NAVY, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarPlaceholder: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#e0e4ea', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  editImageText: { fontSize: 13, color: '#2980b9', fontWeight: '600' },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 12, color: '#7a8a9a', fontWeight: '600', marginBottom: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  confirmBadge: { backgroundColor: '#27ae60', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  confirmBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde2ea', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: NAVY },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  warningIcon: { fontSize: 13 },
  warningText: { fontSize: 11, color: '#e8820c', flex: 1 },
  selectWrapper: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: '#dde2ea', paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText: { fontSize: 14, color: NAVY },
  selectChevron: { fontSize: 16, color: '#aab0bc' },
  saveButton: { backgroundColor: NAVY, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bottomNav: {flexDirection: 'row',backgroundColor: '#fff',position: 'absolute',bottom: 55,left: 20,right: 20,height: 65,borderRadius: 20,paddingVertical: 8,shadowColor: '#000',shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1,shadowRadius: 10,elevation: 10,borderTopWidth: 0,},
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
});
