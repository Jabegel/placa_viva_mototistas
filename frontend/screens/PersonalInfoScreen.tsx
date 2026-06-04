import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { Icon, MenuBottomNav, PV } from '../components/PlacaVivaUI';

export default function PersonalInfoScreen({ navigation }: any) {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    name: user.name || 'Cicrano de Tal',
    phone: '+55 1...',
    email: '',
    birthDate: 'dd/mm/aaaa',
    gender: 'Masculino',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setUser({ name: form.name });
    setSaving(false);
    Alert.alert('✓', 'Informações salvas!');
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header branco com seta + título */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Informações Pessoais</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar com botão editar embaixo */}
        <View style={s.avatarSection}>
          <View style={s.avatarCircle}>
            <Text style={{ fontSize: 36, opacity: 0.4 }}>👤</Text>
            <View style={s.editBadge}>
              <Icon name="pencil-outline" size={11} color={PV.gray} />
            </View>
          </View>
          <TouchableOpacity><Text style={s.editLabel}>Editar Imagem</Text></TouchableOpacity>
        </View>

        {/* Nome */}
        <View style={s.field}>
          <Text style={s.label}>Nome Completo</Text>
          <TextInput style={s.input} value={form.name} onChangeText={v => set('name', v)}
            placeholderTextColor="#bbb" />
        </View>

        {/* Celular */}
        <View style={s.field}>
          <Text style={s.label}>Número de Celular</Text>
          <View style={s.phoneRow}>
            <View style={s.flagBox}><Text style={s.flagText}>🇧🇷 +55</Text></View>
            <TextInput style={[s.input, { flex: 1 }]} value={form.phone}
              onChangeText={v => set('phone', v)} keyboardType="phone-pad"
              placeholderTextColor="#bbb" />
          </View>
        </View>

        {/* E-mail */}
        <View style={s.field}>
          <View style={s.labelRow}>
            <Text style={s.label}>E-mail</Text>
            <TouchableOpacity style={s.confirmBadge}>
              <Text style={s.confirmBadgeText}>Confirmar seu e-mail</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={s.input} value={form.email}
            onChangeText={v => set('email', v)}
            keyboardType="email-address" autoCapitalize="none"
            placeholder="Digite seu email" placeholderTextColor="#bbb" />
          <View style={s.warnRow}>
            <Icon name="warning-outline" size={14} color={PV.gray} />
            <Text style={s.warnText}>Adicione um e-mail de recuperação (nacional)</Text>
          </View>
        </View>

        {/* Data nascimento */}
        <View style={s.field}>
          <Text style={s.label}>Data de Nascimento</Text>
          <TextInput style={s.input} value={form.birthDate}
            onChangeText={v => set('birthDate', v)}
            placeholder="dd/mm/aaaa" keyboardType="numeric" placeholderTextColor="#bbb" />
        </View>

        {/* Sexo */}
        <View style={s.field}>
          <Text style={s.label}>Sexo</Text>
          <View style={s.select}>
            <Text style={s.selectText}>{form.gender}</Text>
            <Text style={s.selectChev}>⌄</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[s.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave} disabled={saving}
        >
          <Text style={s.saveBtnText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>

      <MenuBottomNav navigation={navigation} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: PV.border },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: PV.navy, fontWeight: '700' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: PV.navy },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 82, height: 82, borderRadius: 41, backgroundColor: '#e0e4ea', alignItems: 'center', justifyContent: 'center', marginBottom: 6, position: 'relative' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: PV.navy, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  editLabel: { fontSize: 13, color: '#2980b9', fontWeight: '600' },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: PV.gray, fontWeight: '600', marginBottom: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  confirmBadge: { backgroundColor: '#27ae60', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  confirmBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, color: PV.navy },
  phoneRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  flagBox: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 10, paddingVertical: 12 },
  flagText: { fontSize: 13, color: PV.navy },
  warnRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  warnIcon: { fontSize: 13 },
  warnText: { fontSize: 11, color: '#e8820c', flex: 1 },
  select: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1.5, borderColor: PV.border, paddingHorizontal: 13, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' },
  selectText: { fontSize: 14, color: PV.navy },
  selectChev: { fontSize: 16, color: PV.grayLight },
  saveBtn: { backgroundColor: PV.navy, borderRadius: 30, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 6, shadowColor: PV.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
