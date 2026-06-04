import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView,
  Modal, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

// ─── TOKENS DE COR OFICIAIS ───────────────────────────────────────────────────
export const PV = {
  navy:      '#1a2e4a',
  navyLight: '#2d4a6e',
  orange:    '#e8820c',
  gold:      '#c8a832',
  green:     '#4a7c3f',
  blue:      '#2d6a8a',
  white:     '#ffffff',
  offWhite:  '#f5f6f8',
  border:    '#dde2ea',
  gray:      '#7a8a9a',
  grayLight: '#aab0bc',
  red:       '#e74c3c',
  greenOk:   '#27ae60',
};

// ─── ÍCONE HELPER ─────────────────────────────────────────────────────────────
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export function Icon({
  name, size = 22, color = PV.navy,
}: { name: IoniconsName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── LOGO (barras SVG) ────────────────────────────────────────────────────────
export function LogoIcon({
  size = 28, bg = PV.navy, barColor = '#fff',
}: { size?: number; bg?: string; barColor?: string }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: 7,
      backgroundColor: bg,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
        <View style={{ width: size * 0.13, height: size * 0.28, backgroundColor: barColor, borderRadius: 1 }} />
        <View style={{ width: size * 0.13, height: size * 0.46, backgroundColor: barColor, borderRadius: 1 }} />
        <View style={{ width: size * 0.13, height: size * 0.34, backgroundColor: barColor, borderRadius: 1 }} />
      </View>
    </View>
  );
}

// ─── LOGO COMPLETO ────────────────────────────────────────────────────────────
export function PVLogo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const textColor = light ? '#fff' : PV.navy;
  const sz = size === 'lg' ? { icon: 40, text: 18 }
           : size === 'sm' ? { icon: 22, text: 13 }
           :                 { icon: 28, text: 15 };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <LogoIcon size={sz.icon} bg={light ? 'rgba(255,255,255,0.2)' : PV.navy} />
      <Text style={{ fontSize: sz.text, fontWeight: '800', color: textColor, letterSpacing: 1 }}>
        PLACA <Text style={{ fontWeight: '900', letterSpacing: 3 }}>VIVA</Text>
      </Text>
    </View>
  );
}

// ─── HEADERS ─────────────────────────────────────────────────────────────────
export function NavyHeader({ onBack, right }: { onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={hStyles.navy}>
      {onBack
        ? <TouchableOpacity onPress={onBack} style={hStyles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="arrow-back-outline" size={22} color="#fff" />
          </TouchableOpacity>
        : <View style={{ width: 32 }} />}
      <PVLogo light />
      <View style={{ width: 32 }}>{right}</View>
    </View>
  );
}

export function WhiteHeader({ onBack, right }: { onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={hStyles.white}>
      {onBack
        ? <TouchableOpacity onPress={onBack} style={hStyles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="arrow-back-outline" size={22} color={PV.navy} />
          </TouchableOpacity>
        : <View style={{ width: 32 }} />}
      <PVLogo />
      <View style={{ width: 32 }}>{right}</View>
    </View>
  );
}

export function UserNavyHeader({ onBack, userName, navigation }: {
  onBack?: () => void; userName?: string; navigation?: any;
}) {
  return (
    <View style={[hStyles.navy, { paddingVertical: 10 }]}>
      {onBack
        ? <TouchableOpacity onPress={onBack} style={hStyles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="arrow-back-outline" size={22} color="#fff" />
          </TouchableOpacity>
        : <View style={{ width: 32 }} />}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <LogoIcon size={24} bg="rgba(255,255,255,0.15)" />
        <View>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>
            {(userName || 'USUÁRIO').toUpperCase()}
          </Text>
          <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
            SOBRENOME SOBRENOME
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation?.navigate('Profile')}
        style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name="person-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export function ProHeader({ subtitle, onHelp, navigation }: { subtitle: string; onHelp?: () => void; navigation?: any }) {
  return (
    <View style={hStyles.pro}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {navigation && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Coupons')} 
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="home-outline" size={22} color={PV.navy} />
          </TouchableOpacity>
        )}
        <LogoIcon size={34} />
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={hStyles.proLogo}>PLACA VIVA</Text>
            <View style={hStyles.proBadge}><Text style={hStyles.proText}>PRO</Text></View>
          </View>
          <Text style={hStyles.proSub}>{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity style={hStyles.helpBtn} onPress={onHelp}>
        <Icon name="help-circle-outline" size={20} color={PV.gray} />
      </TouchableOpacity>
    </View>
  );
}

const hStyles = StyleSheet.create({
  navy: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PV.navy, paddingHorizontal: 18, paddingVertical: 14,
  },
  white: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: PV.border,
  },
  pro: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: PV.border,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  proLogo: { fontSize: 15, fontWeight: '800', color: PV.navy, letterSpacing: 1 },
  proBadge: { backgroundColor: PV.orange, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  proText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  proSub: { fontSize: 11, color: PV.gray, marginTop: 2 },
  helpBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: PV.border, alignItems: 'center', justifyContent: 'center' },
});

// ─── BOTTOM NAV PRINCIPAL ─────────────────────────────────────────────────────
type NavTab = 'coupons' | 'map' | 'lifestyle' | 'share' | 'menu';

export function BottomNav({
  active, navigation, hasLifestyleNotif = false,
}: { active: NavTab; navigation: any; hasLifestyleNotif?: boolean }) {
  const [mapModal, setMapModal] = useState(false);

  const openWaze = () => {
    setMapModal(false);
    Linking.openURL('waze://?navigate=yes').catch(() => Linking.openURL('https://waze.com'));
  };

  const openMaps = () => {
    setMapModal(false);
    Linking.openURL('https://maps.google.com');
  };

  const tabs: { id: NavTab; label: string; icon: IoniconsName; iconActive: IoniconsName; screen: string }[] = [
    { id: 'coupons',   label: 'Cupons',    icon: 'ticket-outline',       iconActive: 'ticket',           screen: 'Coupons' },
    { id: 'map',       label: 'Mapa',      icon: 'location-outline',     iconActive: 'location',         screen: '' },
    { id: 'lifestyle', label: 'LifeStyle', icon: 'heart-outline',        iconActive: 'heart',            screen: 'Lifestyle' },
    { id: 'share',     label: 'Indicar',   icon: 'share-social-outline', iconActive: 'share-social',     screen: 'Share' },
    { id: 'menu',      label: 'Menu',      icon: 'menu-outline',         iconActive: 'menu',             screen: 'Profile' },
  ];

  return (
    <>
      <View style={navStyles.container}>
        {tabs.map(tab => {
          const isActive = active === tab.id;

          // Pill especial para LifeStyle ativo
          if (tab.id === 'lifestyle' && isActive) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={navStyles.lifestylePill}
                onPress={() => navigation.navigate(tab.screen)}
              >
                <Icon name="heart" size={14} color="#fff" />
                <Text style={navStyles.lifestylePillText}>LifeStyle</Text>
              </TouchableOpacity>
            );
          }

          // Botão Mapa — abre modal de navegação
          if (tab.id === 'map') {
            return (
              <TouchableOpacity
                key={tab.id}
                style={navStyles.item}
                onPress={() => setMapModal(true)}
              >
                <Icon
                  name={isActive ? tab.iconActive : tab.icon}
                  size={22}
                  color={isActive ? PV.navy : PV.grayLight}
                />
                <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              style={navStyles.item}
              onPress={() => tab.screen && navigation.navigate(tab.screen)}
            >
              <View style={{ position: 'relative' }}>
                <Icon
                  name={isActive ? tab.iconActive : tab.icon}
                  size={22}
                  color={isActive ? PV.navy : PV.grayLight}
                />
                {tab.id === 'lifestyle' && hasLifestyleNotif && (
                  <View style={navStyles.notifDot} />
                )}
              </View>
              <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Modal escolha de navegação ── */}
      <Modal visible={mapModal} transparent animationType="slide" onRequestClose={() => setMapModal(false)}>
        <TouchableOpacity
          style={mapModalStyles.overlay}
          activeOpacity={1}
          onPress={() => setMapModal(false)}
        >
          <View style={mapModalStyles.sheet}>
            <View style={mapModalStyles.handle} />
            <Text style={mapModalStyles.title}>Navegar até o posto</Text>
            <Text style={mapModalStyles.sub}>Escolha o aplicativo de navegação</Text>

            <TouchableOpacity style={mapModalStyles.wazeBtn} onPress={openWaze}>
              <View style={{ flex: 1 }}>
                <Text style={mapModalStyles.btnLabel}>Waze</Text>
                <Text style={mapModalStyles.btnSub}>Trânsito em tempo real</Text>
              </View>
              <Icon name="chevron-forward-outline" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={mapModalStyles.mapsBtn} onPress={openMaps}>
              <View style={{ flex: 1 }}>
                <Text style={mapModalStyles.mapsBtnLabel}>Google Maps</Text>
                <Text style={mapModalStyles.mapsBtnSub}>Rotas e Street View</Text>
              </View>
              <Icon name="chevron-forward-outline" size={18} color={PV.navy} />
            </TouchableOpacity>

            <TouchableOpacity style={mapModalStyles.cancelBtn} onPress={() => setMapModal(false)}>
              <Text style={mapModalStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ─── BOTTOM NAV PERFIL (pill "Menu" ativo) ────────────────────────────────────
export function MenuBottomNav({ navigation }: { navigation: any }) {
  return (
    <View style={navStyles.container}>
      {([
        { id: 'coupons',   label: 'Cupons',    icon: 'ticket-outline'       as IoniconsName, screen: 'Coupons' },
        { id: 'map',       label: 'Mapa',      icon: 'location-outline'     as IoniconsName, screen: '' },
        { id: 'lifestyle', label: 'LifeStyle', icon: 'heart-outline'        as IoniconsName, screen: 'Lifestyle' },
        { id: 'share',     label: 'Indicar',   icon: 'share-social-outline' as IoniconsName, screen: 'Share' },
      ] as { id: string; label: string; icon: IoniconsName; screen: string }[]).map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={navStyles.item}
          onPress={() => tab.screen && navigation.navigate(tab.screen)}
        >
          <Icon name={tab.icon} size={22} color={PV.grayLight} />
          <Text style={navStyles.label}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
      <View style={navStyles.menuPill}>
        <Icon name="menu" size={14} color="#fff" />
        <Text style={navStyles.menuPillText}>Menu</Text>
      </View>
    </View>
  );
}

// ─── BOTTOM NAV PRO (4 abas) ──────────────────────────────────────────────────
type TruckTab = 'coupons' | 'stations' | 'history' | 'benefits';

export function TruckBottomNav({ active, navigation }: { active: TruckTab; navigation: any }) {
  const tabs: { id: TruckTab; label: string; icon: IoniconsName; iconActive: IoniconsName; screen: string }[] = [
    { id: 'coupons',  label: 'Cupons',    icon: 'ticket-outline',     iconActive: 'ticket',        screen: 'TruckCoupons' },
    { id: 'stations', label: 'Postos',    icon: 'location-outline',   iconActive: 'location',      screen: 'TruckStations' },
    { id: 'history',  label: 'Histórico', icon: 'document-text-outline', iconActive: 'document-text', screen: 'TruckHistory' },
    { id: 'benefits', label: 'Pontos',    icon: 'star-outline',        iconActive: 'star',          screen: 'TruckBenefits' },
  ];

  return (
    <View style={navStyles.container}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={navStyles.item}
            onPress={() => navigation.navigate(tab.screen)}
          >
            <Icon
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? PV.navy : PV.grayLight}
            />
            <Text style={[navStyles.label, isActive && navStyles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const navStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: PV.border,
    paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, color: PV.grayLight },
  labelActive: { color: PV.navy, fontWeight: '700' },
  notifDot: {
    position: 'absolute', top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: PV.red, borderWidth: 1.5, borderColor: '#fff',
  },
  lifestylePill: {
    flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PV.navy, borderRadius: 20,
    marginHorizontal: 4, paddingVertical: 6, gap: 4,
  },
  lifestylePillText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  menuPill: {
    flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PV.navy, borderRadius: 20,
    marginHorizontal: 4, paddingVertical: 6, gap: 4,
  },
  menuPillText: { fontSize: 11, color: '#fff', fontWeight: '700' },
});

const mapModalStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#dde2ea', alignSelf: 'center', marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: '800', color: PV.navy, textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 13, color: PV.gray, textAlign: 'center', marginBottom: 20 },
  wazeBtn: {
    backgroundColor: '#00c0e8', borderRadius: 16,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    marginBottom: 10, gap: 14,
  },
  brandLogo: { width: 0, height: 0 }, // unused, kept for safety
  btnLabel: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  mapsBtn: {
    backgroundColor: '#fff', borderRadius: 16,
    borderWidth: 1.5, borderColor: PV.border,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    marginBottom: 14, gap: 14,
  },
  mapsBtnLabel: { fontSize: 15, fontWeight: '700', color: PV.navy },
  mapsBtnSub: { fontSize: 11, color: PV.gray, marginTop: 1 },
  cancelBtn: {
    alignItems: 'center', paddingVertical: 12,
  },
  cancelText: { fontSize: 14, color: PV.gray, fontWeight: '600' },
});

// ─── FILTRO CHIPS ─────────────────────────────────────────────────────────────
export function FilterChips({
  options, value, onChange,
}: { options: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <View style={filterStyles.bar}>
      <Text style={filterStyles.prefix}>Filtro Ativo:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(o => (
          <TouchableOpacity
            key={o.id}
            style={[filterStyles.chip, value === o.id && filterStyles.chipActive]}
            onPress={() => onChange(o.id)}
          >
            <Text style={[filterStyles.chipText, value === o.id && filterStyles.chipTextActive]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const filterStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: PV.border, gap: 8,
  },
  prefix: { fontSize: 11, color: PV.gray, fontWeight: '600', flexShrink: 0 },
  chip: { backgroundColor: PV.offWhite, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginRight: 6 },
  chipActive: { backgroundColor: PV.navy },
  chipText: { fontSize: 12, color: PV.gray, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});

// ─── INTERACTIVE FILTER ───────────────────────────────────────────────────────
export type FilterType = 'combustivel' | 'veiculo' | 'cidade';

export function InteractiveFilter({
  selectedType,
  selectedValue,
  onChange,
}: {
  selectedType: FilterType;
  selectedValue: string;
  onChange: (type: FilterType, value: string) => void;
}) {
  const { vehicles } = useUser();

  const categories: { id: FilterType; label: string; icon: IoniconsName }[] = [
    { id: 'combustivel', label: 'Combustível', icon: 'beaker-outline' },
    { id: 'veiculo',     label: 'Veículo',     icon: 'car-outline' },
    { id: 'cidade',      label: 'Cidade',      icon: 'map-outline' },
  ];

  const optionsMap: Record<FilterType, { id: string; label: string }[]> = {
    combustivel: [
      { id: 'all',         label: 'Todos' },
      { id: 'diesel-s10',  label: 'Diesel S-10' },
      { id: 'diesel-s500', label: 'Diesel S-500' },
      { id: 'gasolina',    label: 'Gasolina' },
      { id: 'etanol',      label: 'Etanol' },
    ],
    veiculo: [
      { id: 'all',         label: 'Todos' },
      ...vehicles.map(v => ({
        id: v.id,
        label: v.model ? `${v.model} (${v.plate})` : v.plate
      })),
    ],
    cidade: [
      { id: 'all',         label: 'Todos' },
      { id: 'brasilia',    label: 'Brasília' },
      { id: 'taguatinga',  label: 'Taguatinga' },
      { id: 'goiania',     label: 'Goiânia' },
      { id: 'luziania',    label: 'Luziânia' },
    ],
  };

  const handleCategoryPress = (type: FilterType) => {
    const options = optionsMap[type];
    const firstOption = options.length > 0 ? options[0].id : '';
    onChange(type, firstOption);
  };

  return (
    <View style={intFilterStyles.container}>
      <View style={intFilterStyles.categoryRow}>
        {categories.map(cat => {
          const isActive = selectedType === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[intFilterStyles.catButton, isActive && intFilterStyles.catButtonActive]}
              onPress={() => handleCategoryPress(cat.id)}
            >
              <Icon name={cat.icon} size={14} color={isActive ? '#fff' : PV.navy} />
              <Text style={[intFilterStyles.catLabel, isActive && intFilterStyles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={intFilterStyles.chipsRow}>
        <Text style={intFilterStyles.prefix}>Opção:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {optionsMap[selectedType].map(opt => {
            const isActive = selectedValue === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[intFilterStyles.chip, isActive && intFilterStyles.chipActive]}
                onPress={() => onChange(selectedType, opt.id)}
              >
                <Text style={[intFilterStyles.chipText, isActive && intFilterStyles.chipTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const intFilterStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: PV.border,
    paddingVertical: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  catButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: PV.offWhite,
    gap: 5,
  },
  catButtonActive: {
    backgroundColor: PV.navy,
  },
  catLabel: {
    fontSize: 12,
    color: PV.navy,
    fontWeight: '600',
  },
  catLabelActive: {
    color: '#fff',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  prefix: {
    fontSize: 11,
    color: PV.gray,
    fontWeight: '600',
    flexShrink: 0,
  },
  chip: {
    backgroundColor: PV.offWhite,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: PV.orange,
  },
  chipText: {
    fontSize: 12,
    color: PV.gray,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
});

// ─── CARD DE ESTAÇÃO PRO ──────────────────────────────────────────────────────
export function StationProCard({ station, fuelFilter, onDescontos, onNavigate, savings = 0 }: {
  station: any; fuelFilter: string; onDescontos: () => void; onNavigate: () => void; savings?: number;
}) {
  const price = fuelFilter === 'diesel-s500' && station.dieselS500Price
    ? station.dieselS500Price : station.dieselS10Price;
  const fuelLabel = fuelFilter === 'diesel-s500' ? 'Diesel S-500 PRO' : 'Diesel S-10 PRO';

  return (
    <View style={stCardStyles.card}>
      {savings > 0 && (
        <View style={stCardStyles.savingsBadge}>
          <Icon name="wallet-outline" size={14} color="#27ae60" />
          <Text style={stCardStyles.savingsBadgeText}>
            Você economizou <Text style={{ fontWeight: '800' }}>R$ {savings.toFixed(2).replace('.', ',')}</Text> neste posto
          </Text>
        </View>
      )}

      <View style={stCardStyles.top}>
        <View style={stCardStyles.iconBox}>
          <Icon name="flash-outline" size={22} color={PV.orange} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={stCardStyles.name}>{station.name}</Text>
          <View style={stCardStyles.badgesRow}>
            {station.hasParking && (
              <View style={stCardStyles.badge}>
                <Icon name="car-outline" size={10} color={PV.gray} />
                <Text style={stCardStyles.badgeText}> Estac. caminhão</Text>
              </View>
            )}
            {station.hasTruckLane && (
              <View style={[stCardStyles.badge, stCardStyles.badgeGreen]}>
                <Icon name="bus-outline" size={10} color="#27ae60" />
                <Text style={[stCardStyles.badgeText, { color: '#27ae60' }]}> Pista exclusiva</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={stCardStyles.row}>
        <Icon name="location-outline" size={13} color={PV.gray} />
        <Text style={stCardStyles.rowText}>
          {' '}{station.distance} km · {station.neighborhood}
        </Text>
      </View>
      <View style={stCardStyles.priceRow}>
        <Text style={stCardStyles.priceLabel}>{fuelLabel}:</Text>
        <Text style={stCardStyles.price}>R$ {price.toFixed(2).replace('.', ',')}/L</Text>
      </View>
      <View style={stCardStyles.savingsBox}>
        <Icon name="cash-outline" size={13} color="#856404" />
        <Text style={stCardStyles.savingsText}>
          {' '}Desconto: R$ {station.discount.toFixed(2).replace('.', ',')}/L
          {'  '}·{'  '}
          Economia est.: R$ {station.estimatedSavings.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      <View style={stCardStyles.actions}>
        <TouchableOpacity style={stCardStyles.btnPrimary} onPress={onDescontos}>
          <Text style={stCardStyles.btnPrimaryText}>Ver Descontos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stCardStyles.btnSecondary} onPress={onNavigate}>
          <Icon name="navigate-outline" size={15} color={PV.navy} />
          <Text style={stCardStyles.btnSecondaryText}> Navegar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stCardStyles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: PV.border },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    gap: 6,
  },
  savingsBadgeText: {
    fontSize: 11,
    color: '#27ae60',
  },
  top: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: PV.offWhite, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13, fontWeight: '700', color: PV.navy, lineHeight: 18, marginBottom: 4 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: PV.offWhite, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  badgeGreen: { backgroundColor: '#e8f5e9' },
  badgeText: { fontSize: 10, color: PV.gray, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  rowText: { fontSize: 11, color: PV.gray },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  priceLabel: { fontSize: 12, color: PV.gray },
  price: { fontSize: 15, fontWeight: '800', color: '#7a5c2e' },
  savingsBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 12 },
  savingsText: { fontSize: 11, color: '#856404', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8 },
  btnPrimary: { flex: 1, backgroundColor: PV.navy, borderRadius: 22, height: 38, alignItems: 'center', justifyContent: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PV.offWhite, borderRadius: 22, height: 38, borderWidth: 1, borderColor: PV.border },
  btnSecondaryText: { fontSize: 13, color: PV.navy, fontWeight: '600' },
});

// ─── CARD DA PLACA ────────────────────────────────────────────────────────────
export function PlateCard({ plate, style }: { plate: string; style?: any }) {
  return (
    <View style={[plateStyles.card, style]}>
      <View style={plateStyles.header}>
        <LogoIcon size={16} />
        <Text style={plateStyles.headerText}>PLACA VIVA</Text>
      </View>
      <Text style={plateStyles.number}>{plate || 'ABC-1D23'}</Text>
    </View>
  );
}

const plateStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 2.5, borderColor: PV.navy,
    paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center',
    alignSelf: 'center', minWidth: 200,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
  headerText: { fontSize: 10, fontWeight: '800', color: PV.navy, letterSpacing: 1 },
  number: {
    fontSize: 30, fontWeight: '900', color: PV.navy, letterSpacing: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
