import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

// Troque pelo IP da sua máquina ao rodar em dispositivo físico
const API_URL = 'http://localhost:8080';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (text: string) => {
    // Remove tudo que não é número
    const cleaned = text.replace(/\D/g, '');
    // Formata: (11) 91234-5678
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const getRawPhone = () => {
    return '+55' + phone.replace(/\D/g, '');
  };

  const handleSendCode = async () => {
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 10 || rawPhone.length > 11) {
      Alert.alert('Atenção', 'Digite um número de celular válido com DDD');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: getRawPhone() }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro', data.error || 'Não foi possível enviar o código');
        return;
      }

      // Navega para a tela de verificação passando o telefone
      navigation.navigate('VerifyCode', { phone: getRawPhone(), maskedPhone: data.phone });
    } catch (error) {
      Alert.alert('Erro', 'Sem conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f6f8" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            {/* Ícone de gráfico de barras simplificado */}
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

        {/* Slogan */}
        <Text style={styles.slogan}>Entre para desbloquear seus descontos</Text>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="Entre com seu celular"
              placeholderTextColor="#aab0bc"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={15}
              returnKeyType="done"
              onSubmitEditing={handleSendCode}
            />
          </View>

          <Text style={styles.hint}>Enviaremos um código pelo WhatsApp</Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Receber código</Text>
            )}
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <Text style={styles.secureIcon}>🔒</Text>
            <Text style={styles.secureText}>Seus dados são protegidos</Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ao continuar, você concorda com nossos{' '}
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Termos de Uso</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> e </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Política de Privacidade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const NAVY = '#1a2e4a';
const NAVY_LIGHT = '#2d4a6e';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f5f6f8',
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    backgroundColor: NAVY,
    borderRadius: 10,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 6,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  logoPlaca: {
    fontSize: 24,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: 4,
    lineHeight: 26,
  },
  logoViva: {
    fontSize: 28,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 6,
    lineHeight: 30,
  },
  logoTagline: {
    fontSize: 11,
    color: '#7a8a9a',
    letterSpacing: 1,
    marginTop: 4,
  },

  // Slogan
  slogan: {
    fontSize: 14,
    color: NAVY,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.2,
  },

  // Formulário
  form: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dde2ea',
    paddingHorizontal: 14,
    width: '100%',
    height: 52,
    marginBottom: 10,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: NAVY,
  },
  hint: {
    fontSize: 12,
    color: '#7a8a9a',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: NAVY,
    borderRadius: 30,
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  secureIcon: {
    fontSize: 13,
    color: '#aab0bc',
  },
  secureText: {
    fontSize: 12,
    color: '#aab0bc',
  },

  // Rodapé
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#7a8a9a',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 11,
    color: NAVY,
    fontWeight: '700',
  },
});
