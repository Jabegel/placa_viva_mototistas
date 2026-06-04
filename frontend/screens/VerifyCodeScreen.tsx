import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '../context/UserContext';

const API_URL = 'http://192.168.0.5:8080';
const NAVY = '#1a2e4a';

export default function VerifyCodeScreen({ route, navigation }: any) {
  const { phone, maskedPhone } = route.params;
  const { setUser } = useUser();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Avança para o próximo campo
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-verifica quando todos os campos preenchidos
    if (text && index === 5) {
      const fullCode = [...newCode].join('');
      if (fullCode.length === 6) verifyCode(fullCode);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (fullCode?: string) => {
    const codeToVerify = fullCode || code.join('');
    if (codeToVerify.length < 6) {
      Alert.alert('Atenção', 'Digite o código completo de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: codeToVerify }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro', data.error || 'Código inválido');
        setCode(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
        return;
      }

      // Salva token e navega para home
      // Em produção: salvar no AsyncStorage ou SecureStore
      console.log('Token:', data.token);
      // Salva telefone no contexto global (nome vem do perfil depois)
      setUser({ phone, name: data.name || phone });
      navigation.replace('WelcomeName');
    } catch (error) {
      Alert.alert('Erro', 'Sem conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    try {
      await fetch(`${API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      Alert.alert('Sucesso', 'Novo código enviado!');
    } catch {
      Alert.alert('Erro', 'Não foi possível reenviar o código');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verifique seu WhatsApp</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de 6 dígitos para{'\n'}
            <Text style={styles.phone}>{maskedPhone || phone}</Text>
          </Text>

          {/* Campos OTP */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { if (ref) inputs.current[index] = ref; }}
                style={[styles.otpInput, digit ? styles.otpFilled : null]}
                value={digit}
                onChangeText={text => handleCodeChange(text.slice(-1), index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => verifyCode()}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirmar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={resendCode} disabled={countdown > 0}>
            <Text style={[styles.resend, countdown > 0 && styles.resendDisabled]}>
              {countdown > 0
                ? `Reenviar código em ${countdown}s`
                : 'Reenviar código'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  container: { flex: 1, paddingHorizontal: 32 },
  back: { marginTop: 16, marginBottom: 32 },
  backText: { color: NAVY, fontSize: 14, fontWeight: '600' },
  content: { alignItems: 'center' },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7a8a9a',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  phone: { color: NAVY, fontWeight: '700' },
  otpContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 36,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#dde2ea',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: NAVY,
  },
  otpFilled: {
    borderColor: NAVY,
    backgroundColor: '#eef2f8',
  },
  button: {
    backgroundColor: NAVY,
    borderRadius: 30,
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resend: { fontSize: 13, color: NAVY, fontWeight: '600' },
  resendDisabled: { color: '#aab0bc' },
});
