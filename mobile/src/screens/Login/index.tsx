import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../services/api';

export default function Login({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.length < 10) {
      Alert.alert('Erro', 'Por favor, insira um número válido com DDD.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { phone });
      const user = response.data;
      navigation.navigate('Dashboard', { user });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o Backend em Go está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PLACA VIVA PRO</Text>
      <Text style={styles.subtitle}>Entre para economizar mais na sua jornada</Text>

      <TextInput
        style={styles.input}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar com WhatsApp'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F5F5F5' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#1A3A5A', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, fontSize: 18, marginBottom: 20, borderWidth: 1, borderColor: '#DDD' },
  button: { backgroundColor: '#1A3A5A', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
