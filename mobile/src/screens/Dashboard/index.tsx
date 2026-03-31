import React from 'react';
import { View, Text } from 'react-native';

export default function Dashboard({ route }: any) {
  const { user } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Bem-vindo, {user.name}!</Text>
      <Text>Perfil: {user.type}</Text>
    </View>
  );
}
