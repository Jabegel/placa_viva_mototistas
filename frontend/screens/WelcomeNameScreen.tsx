import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useUser } from '../context/UserContext';

const NAVY = '#1a2e4a';

export default function WelcomeNameScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const { setUser } = useUser();

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUser({ name: trimmed });
    navigation.replace('CitySelect');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 8 }]} />
              <View style={[styles.bar, { height: 14 }]} />
              <View style={[styles.bar, { height: 10 }]} />
            </View>
          </View>
          <Text style={styles.logoPlaca}>PLACA</Text>
          <Text style={styles.logoViva}>VIVA</Text>
          <Text style={styles.logoTagline}>sua placa vale mais</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.title}>Olá! Como você{'\n'}quer ser chamado?</Text>
          <Text style={styles.subtitle}>
            Usaremos esse nome para personalizar{'\n'}sua experiência no app.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Seu nome ou apelido"
            placeholderTextColor="#aab0bc"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            maxLength={40}
          />

          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!name.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoIcon: {
    backgroundColor: NAVY, borderRadius: 10, width: 52, height: 52,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 6, backgroundColor: '#fff', borderRadius: 2 },
  logoPlaca: { fontSize: 24, fontWeight: '800', color: NAVY, letterSpacing: 4, lineHeight: 26 },
  logoViva: { fontSize: 28, fontWeight: '900', color: NAVY, letterSpacing: 6, lineHeight: 30 },
  logoTagline: { fontSize: 11, color: '#7a8a9a', letterSpacing: 1, marginTop: 4 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 20,
    padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: {
    fontSize: 22, fontWeight: '800', color: NAVY,
    textAlign: 'center', lineHeight: 30, marginBottom: 10,
  },
  subtitle: {
    fontSize: 13, color: '#7a8a9a', textAlign: 'center',
    lineHeight: 20, marginBottom: 24,
  },
  input: {
    width: '100%', backgroundColor: '#f5f6f8', borderRadius: 10,
    borderWidth: 1.5, borderColor: '#dde2ea',
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 16, color: NAVY, marginBottom: 20, textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: NAVY, borderRadius: 30, width: '100%',
    height: 52, alignItems: 'center', justifyContent: 'center',
    shadowColor: NAVY, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
