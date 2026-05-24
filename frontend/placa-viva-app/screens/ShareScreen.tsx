import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
  Linking,
  Platform,
  Image,
} from 'react-native';

const NAVY = '#1a2e4a';

export default function ShareScreen({ navigation }: any) {
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Oi! Estou usando o Placa Viva pra economizar nos postos. Você cadastra sua placa e já começa a pegar desconto na gasolina! Baixa lá 👉 https://placaviva.com.br',
        title: 'Compartilhe o Placa Viva com seus amigos',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const socials = [
    { icon: '📸', label: 'Instagram', url: 'https://instagram.com/placaviva' },
    { icon: '💼', label: 'LinkedIn',  url: 'https://linkedin.com/company/placaviva' },
    { icon: '🌐', label: 'Site',      url: 'https://placaviva.com.br' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Botão fechar */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Imagem de capa */}
      <View style={styles.heroImage}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600' }}
          style={styles.heroImg}
          resizeMode="cover"
        />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Compartilhe o Placa Viva{'\n'}com seus amigos</Text>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareIcon}>▶</Text>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>

        <Text style={styles.socialLabel}>Conheça nossas redes sociais</Text>

        <View style={styles.socialsRow}>
          {socials.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={styles.socialItem}
              onPress={() => Linking.openURL(s.url)}
              activeOpacity={0.75}
            >
              <Text style={styles.socialIcon}>{s.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🎫', label: 'Cupons',    onPress: () => navigation.navigate('Coupons') },
          { icon: '📍', label: 'Mapa',      onPress: () => {} },
          { icon: '❤️', label: 'Favoritos', onPress: () => {} },
          { icon: '↗️', label: 'Indicar',   onPress: () => {}, active: true },
          { icon: '☰', label: 'Menu',      onPress: () => {} },
        ].map((item: any) => (
          <TouchableOpacity key={item.label} style={styles.navItem} onPress={item.onPress}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  closeButton: {
    position: 'absolute', top: 52, right: 20, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.35)', width: 30, height: 30,
    borderRadius: 15, alignItems: 'center', justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  heroImage: { width: '100%', height: 220, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%' },

  content: { flex: 1, paddingHorizontal: 28, paddingTop: 28, alignItems: 'center' },
  title: {
    fontSize: 20, fontWeight: '800', color: NAVY,
    textAlign: 'center', lineHeight: 28, marginBottom: 28,
  },
  shareButton: {
    backgroundColor: NAVY, borderRadius: 30,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 52, width: '100%', gap: 10, marginBottom: 28,
    shadowColor: NAVY, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  shareIcon: { color: '#fff', fontSize: 14 },
  shareButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  socialLabel: { fontSize: 13, color: '#7a8a9a', marginBottom: 16 },
  socialsRow: { flexDirection: 'row', gap: 20 },
  socialItem: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#f5f6f8', alignItems: 'center', justifyContent: 'center',
  },
  socialIcon: { fontSize: 22 },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
    paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#aab0bc' },
  navLabelActive: { color: NAVY, fontWeight: '700' },
});
