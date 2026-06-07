import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfitRouteScreen() {
  // Estado para o que o usuário está digitando
  const [destinationInput, setDestinationInput] = useState('');
  
  // Estado para controlar se o card deve aparecer
  const [routeCalculated, setRouteCalculated] = useState(false);

  // Estado com os dados da rota (Aqui a mágica acontece!)
  const [routeData, setRouteData] = useState({
    origin: 'Ceilândia', // Origem padrão para a demonstração
    destination: '',
    detourDistance: 2.0,
    fuelCostForDetour: 1.50,
    discountAtStation: 8.00,
    netProfit: 6.50,
    stationName: 'Posto Petrobras 214 Sul'
  });

  const handleCalculateRoute = () => {
    const destText = destinationInput.trim();
    
    if (destText.length > 2) {
      // TRUQUE PRO: Converte para minúsculo e REMOVE todos os acentos
      const searchDest = destText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Ponto de partida fixo para a demonstração
      const currentOrigin = 'UCB (Taguatinga Sul)';

      // Cenário 1: Asa Sul / ASBAC / Plano Piloto
      if (searchDest.includes('asbac') || searchDest.includes('asa sul') || searchDest.includes('plano piloto')) {
        setRouteData({
          origin: currentOrigin,
          destination: destText, // Mantém o texto original na tela
          detourDistance: 3.2,
          fuelCostForDetour: 2.40,
          discountAtStation: 15.00,
          netProfit: 12.60, 
          stationName: 'Posto De Combustiveis 214 Sul Petrobras'
        });
      } 
      // Cenário 2: Asa Norte / UnB
      else if (searchDest.includes('asa norte') || searchDest.includes('unb')) {
        setRouteData({
          origin: currentOrigin,
          destination: destText,
          detourDistance: 4.5,
          fuelCostForDetour: 3.30, 
          discountAtStation: 18.00, 
          netProfit: 14.70, 
          stationName: 'Posto Sao Bento 203 Norte Petrobras'
        });
      }
      else if (searchDest.includes('asa norte') || searchDest.includes('unb') || searchDest.includes('lago norte')) {
        setRouteData({
          origin: currentOrigin,
          destination: destText,
          detourDistance: 3.8, // km de desvio para entrar na quadra
          fuelCostForDetour: 2.80, 
          discountAtStation: 16.00, 
          netProfit: 13.20, 
          stationName: 'Posto Sao Bento 203 Norte Petrobras'
        });
      }
      // Cenário 3: Taguatinga / Centro / Praça do Relógio
      // Note que agora as palavras-chave no código estão sem acento: "praca do relogio"
      else if (searchDest.includes('centro') || searchDest.includes('taguatinga') || searchDest.includes('praca do relogio')) {
        setRouteData({
          origin: currentOrigin,
          destination: destText,
          detourDistance: 1.2,
          fuelCostForDetour: 0.90, 
          discountAtStation: 6.00, 
          netProfit: 5.10, 
          stationName: 'Posto Petrolino (Taguatinga - Centro)'
        });
      }
      else {
        setRouteData({
          origin: currentOrigin,
          destination: destText,
          detourDistance: 2.0,
          fuelCostForDetour: 1.50,
          discountAtStation: 8.00,
          netProfit: 6.50,
          stationName: 'Posto Parceiro SmartPetro'
        });
      }
      
      setRouteCalculated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
       <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Image 
              source={require('../assets/icon.png')}
              style={styles.realLogo} 
              resizeMode="contain"
            />
            <Text style={styles.logoText}>PRO</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Rota de Lucro</Text>
            <Text style={styles.headerSubtitle}>Economize no abastecimento</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Qual o seu destino final?</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="place" size={20} color="#1e3a5f" />
            <TextInput
              style={styles.input}
              placeholder="Ex: Plano Piloto"
              value={destinationInput}
              onChangeText={setDestinationInput}
              onSubmitEditing={handleCalculateRoute}
            />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCalculateRoute}>
            <Text style={styles.primaryButtonText}>Calcular Rota</Text>
          </TouchableOpacity>
        </View>

        {/* O card agora usa os dados dinâmicos do estado routeData */}
        {routeCalculated && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="local-gas-station" size={20} color="#1e3a5f" />
              <Text style={styles.stationName}>{routeData.stationName}</Text>
            </View>

            <View style={styles.mathBox}>
              <Text style={styles.mathText}>
                Desviar <Text style={styles.boldText}>{routeData.detourDistance}km</Text> na sua rota de {routeData.origin} para <Text style={styles.boldText}>{routeData.destination}</Text> vai te custar <Text style={styles.expenseText}>R$ {routeData.fuelCostForDetour.toFixed(2).replace('.', ',')}</Text> de combustível.
              </Text>
              
              <Text style={styles.mathText}>
                Mas você vai economizar <Text style={styles.savingText}>R$ {routeData.discountAtStation.toFixed(2).replace('.', ',')}</Text> no abastecimento total.
              </Text>
              
              <View style={styles.profitHighlight}>
                <Text style={styles.profitLabel}>Lucro Real:</Text>
                <Text style={styles.profitValue}>R$ {routeData.netProfit.toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setRouteCalculated(false)}>
                <Text style={styles.secondaryButtonText}>Ignorar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButtonSmall}>
                <Text style={styles.primaryButtonText}>Aceitar Desvio</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// Os estilos continuam intocados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  logoPlaceholder: { alignItems: 'center', marginRight: 15 },
  realLogo: { width: 36, height: 36, borderRadius: 8 },
  logoText: { color: '#1e3a5f', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e3a5f' },
  headerSubtitle: { fontSize: 14, color: '#666' },
  inputContainer: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 15 },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  primaryButton: { backgroundColor: '#1e3a5f', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stationName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  mathBox: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 12, marginBottom: 20 },
  mathText: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 10 },
  boldText: { fontWeight: 'bold', color: '#333' },
  expenseText: { fontWeight: 'bold', color: '#D32F2F' },
  savingText: { fontWeight: 'bold', color: '#388E3C' },
  profitHighlight: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  profitLabel: { fontSize: 16, fontWeight: 'bold', color: '#1e3a5f' },
  profitValue: { fontSize: 20, fontWeight: '900', color: '#388E3C' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  secondaryButton: { flex: 1, height: 45, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  secondaryButtonText: { color: '#1e3a5f', fontSize: 15, fontWeight: 'bold' },
  primaryButtonSmall: { flex: 1, backgroundColor: '#1e3a5f', height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
});