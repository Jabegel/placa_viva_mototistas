import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Platform, Share, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, TruckBottomNav, PV } from '../components/PlacaVivaUI';
import type { FuelHistory } from '../data/mockData';

const MOCK_ITEM: FuelHistory = {
  id: 'h1',
  stationName: 'Posto de Combustíveis 214 Sul Petrobras',
  stationBrand: 'Petrobras',
  date: '2026-04-12', time: '14:30',
  liters: 40, pricePerLiter: 7.38,
  subtotal: 295.20, discount: 10.40, total: 284.80,
  fuelType: 'Diesel S-10 Pro', paymentMethod: 'PIX',
  nfKey: '43260414203526000168650010000012341234567890',
};

const R = (n: number) => 'R$ ' + n.toFixed(2).replace('.', ',');
const fmtDate = (iso: string) => { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}`; };

export default function TruckReceiptScreen({ route, navigation }: any) {
  const item: FuelHistory = route?.params?.item ?? MOCK_ITEM;

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `Nota Fiscal — Placa Viva PRO\n\n` +
          `Posto: ${item.stationName}\n` +
          `Data: ${fmtDate(item.date)} ${item.time}\n` +
          `Combustível: ${item.fuelType}\n` +
          `Litros: ${item.liters}L\n` +
          `Subtotal: ${R(item.subtotal)}\n` +
          `Desconto aplicado: -${R(item.discount)}\n` +
          `Valor total: ${R(item.total)}\n` +
          `Pagamento: ${item.paymentMethod}` +
          (item.nfKey ? `\n\nChave NF-e: ${item.nfKey}` : ''),
        title: 'Nota Fiscal Placa Viva',
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerLogoRow}>
          <Text style={s.headerLogo}>PLACA VIVA</Text>
          <View style={s.proBadge}><Text style={s.proText}>PRO</Text></View>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Nota fiscal */}
        <View style={s.receiptCard}>

          {/* Posto + data */}
          <View style={s.receiptTop}>
            <View style={s.stationIconBox}>
              <Icon name="flash-outline" size={22} color={PV.gray} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.stationName}>{item.stationName}</Text>
              <Text style={s.stationDate}>
                Data: {fmtDate(item.date)} {item.time}
              </Text>
            </View>
          </View>

          <View style={s.divider} />

          <Text style={s.receiptTitle}>Nota Fiscal Simplificada</Text>
          <Text style={s.receiptSub}>{item.fuelType} · Combustível abastecido</Text>

          <View style={s.divider} />

          {/* Itens */}
          {[
            { label: `${item.liters}L @ R$ ${item.pricePerLiter.toFixed(2).replace('.', ',')}/L`, value: R(item.liters * item.pricePerLiter) },
            { label: 'Subtotal', value: R(item.subtotal) },
          ].map(row => (
            <View key={row.label} style={s.lineRow}>
              <Text style={s.lineLabel}>{row.label}</Text>
              <Text style={s.lineValue}>{row.value}</Text>
            </View>
          ))}

          <View style={s.lineRow}>
            <Text style={s.lineLabelGreen}>Desconto aplicado</Text>
            <Text style={s.lineValueGreen}>- {R(item.discount)}</Text>
          </View>

          <View style={s.dividerDashed} />

          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Valor total</Text>
            <Text style={s.totalValue}>{R(item.total)}</Text>
          </View>

          <View style={s.divider} />

          <View style={s.paymentRow}>
            <Text style={s.paymentLabel}>Pagamento</Text>
            <Text style={s.paymentMethod}>{item.paymentMethod}</Text>
          </View>

          {item.nfKey && (
            <>
              <View style={s.divider} />
              <Text style={s.nfLabel}>Chave NF-e</Text>
              <Text style={s.nfKey}>{item.nfKey}</Text>
            </>
          )}
        </View>

        {/* Botão baixar/compartilhar */}
        <TouchableOpacity style={s.downloadBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={s.downloadBtnText}>
            {item.nfKey ? '📥 Baixar NF' : '📤 Compartilhar comprovante'}
          </Text>
        </TouchableOpacity>

        {/* Destaque de economia */}
        <View style={s.savingsBox}>
          <Text style={s.savingsLabel}>💰 Você economizou neste abastecimento</Text>
          <Text style={s.savingsValue}>{R(item.discount)}</Text>
          <Text style={s.savingsNote}>Desconto Placa Viva PRO aplicado automaticamente</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <TruckBottomNav active="history" navigation={navigation} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PV.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: PV.border,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 20, color: PV.navy, fontWeight: '700' },
  headerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLogo: { fontSize: 15, fontWeight: '800', color: PV.navy, letterSpacing: 1 },
  proBadge: { backgroundColor: '#e8820c', borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  proText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  receiptCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: PV.border,
  },
  receiptTop: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  stationIconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: PV.offWhite, alignItems: 'center', justifyContent: 'center',
  },
  stationName: { fontSize: 12, fontWeight: '700', color: PV.navy, lineHeight: 17, marginBottom: 3 },
  stationDate: { fontSize: 11, color: PV.gray },
  divider: { height: 1, backgroundColor: '#f0f2f5', marginVertical: 12 },
  dividerDashed: { height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: PV.border, marginVertical: 10 },
  receiptTitle: { fontSize: 15, fontWeight: '800', color: PV.navy, marginBottom: 3 },
  receiptSub: { fontSize: 11, color: PV.gray },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  lineLabel: { fontSize: 13, color: '#555' },
  lineValue: { fontSize: 13, color: PV.navy, fontWeight: '600' },
  lineLabelGreen: { fontSize: 13, color: PV.gray },
  lineValueGreen: { fontSize: 13, color: '#27ae60', fontWeight: '700' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: PV.navy },
  totalValue: { fontSize: 20, fontWeight: '900', color: PV.navy },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { fontSize: 13, color: PV.gray },
  paymentMethod: { fontSize: 14, fontWeight: '700', color: PV.navy },
  nfLabel: { fontSize: 11, color: PV.gray, marginBottom: 4 },
  nfKey: {
    fontSize: 10, color: PV.grayLight, lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  downloadBtn: {
    backgroundColor: PV.navy, borderRadius: 28, height: 52,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  downloadBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  savingsBox: {
    backgroundColor: '#e8f5e9', borderRadius: 14,
    padding: 16, alignItems: 'center',
  },
  savingsLabel: { fontSize: 12, color: '#388e3c', marginBottom: 6 },
  savingsValue: { fontSize: 30, fontWeight: '900', color: '#27ae60', marginBottom: 4 },
  savingsNote: { fontSize: 11, color: '#388e3c', textAlign: 'center' },
});
