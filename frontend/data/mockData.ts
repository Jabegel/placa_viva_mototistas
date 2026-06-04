// ─── POSTOS MOCKADOS ──────────────────────────────────────────────────────────
export const MOCK_STATIONS_BY_CITY: Record<string, Station[]> = {
  brasilia: [
    { id: 'posto-103-sul',   name: 'Posto 103 Sul',   brand: 'Petrobras', neighborhood: 'Asa Sul' },
    { id: 'posto-203-norte', name: 'Posto 203 Norte', brand: 'Petrobras', neighborhood: 'Asa Norte' },
    { id: 'posto-214-sul',   name: 'Posto 214 Sul',   brand: 'Petrobras', neighborhood: 'Asa Sul' },
    { id: 'posto-312-norte', name: 'Posto 312 Norte', brand: 'Shell',     neighborhood: 'Asa Norte' },
    { id: 'posto-sudoeste',  name: 'Posto Sudoeste',  brand: 'Ipiranga',  neighborhood: 'Sudoeste' },
  ],
  taguatinga: [
    { id: 'posto-tag-centro', name: 'Posto Centro Taguatinga', brand: 'Shell',    neighborhood: 'Centro' },
    { id: 'posto-tag-sul',    name: 'Posto Sul Taguatinga',    brand: 'Ipiranga', neighborhood: 'Sul' },
    { id: 'posto-tag-norte',  name: 'Posto Norte Taguatinga',  brand: 'Petrobras',neighborhood: 'Norte' },
  ],
  goiania: [
    { id: 'posto-bueno',      name: 'Posto Setor Bueno',  brand: 'Petrobras', neighborhood: 'Setor Bueno' },
    { id: 'posto-jd-goias',   name: 'Posto Jardim Goiás', brand: 'Shell',     neighborhood: 'Jardim Goiás' },
  ],
  luziania: [
    { id: 'posto-luz-centro', name: 'Posto Luziânia Centro', brand: 'Ipiranga', neighborhood: 'Centro' },
  ],
  abadiania: [
    { id: 'posto-aba-1', name: 'Posto Abadiânia BR', brand: 'Petrobras', neighborhood: 'Centro' },
  ],
};

// ─── CUPONS MOCKADOS POR POSTO ────────────────────────────────────────────────
export const MOCK_COUPONS_BY_STATION: Record<string, Coupon[]> = {
  'posto-103-sul': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 6.07, tag: 'Mais vantajoso que etanol hoje', color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.70, color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Gasolina', fuelSubtype: 'Aditivada',price: 6.20, color: '#2d6a8a' },
  ],
  'posto-203-norte': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 5.99, color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.55, tag: 'Preço especial hoje', color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Diesel',   fuelSubtype: 'S10',      price: 6.89, color: '#7a5c2e' },
  ],
  'posto-214-sul': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 6.12, tag: 'Mais vantajoso que etanol hoje', color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.78, color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Gasolina', fuelSubtype: 'Aditivada',price: 6.35, color: '#2d6a8a' },
  ],
  'posto-312-norte': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 6.03, color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Aditivado',price: 4.68, tag: 'Oferta exclusiva Shell', color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Gasolina', fuelSubtype: 'V-Power',  price: 6.59, color: '#c0392b' },
  ],
  'posto-sudoeste': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 5.95, tag: 'Menor preço da região', color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.49, color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Diesel',   fuelSubtype: 'S500',     price: 6.70, color: '#7a5c2e' },
  ],
  'posto-tag-centro': [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 5.89, color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.42, tag: 'Melhor etanol de Taguatinga', color: '#4a7c3f' },
  ],
  default: [
    { id: 'c1', fuelType: 'Gasolina', fuelSubtype: 'Comum',    price: 6.05, color: '#c8a832' },
    { id: 'c2', fuelType: 'Etanol',   fuelSubtype: 'Comum',    price: 4.65, color: '#4a7c3f' },
    { id: 'c3', fuelType: 'Gasolina', fuelSubtype: 'Aditivada',price: 6.28, color: '#2d6a8a' },
  ],
};

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export type Station = {
  id: string;
  name: string;
  brand: string;
  neighborhood: string;
};

export type Coupon = {
  id: string;
  fuelType: string;
  fuelSubtype: string;
  price: number;
  tag?: string;
  color: string;
};

// ─── TERMOS POR POSTO (mock variado) ─────────────────────────────────────────
export const MOCK_TERMS = `TERMOS E CONDIÇÕES
Cupom Placa Viva

Ao utilizar este cupom, o usuário declara estar ciente e de acordo com os termos e condições abaixo:

1. DO OBJETO DO CUPOM
Este cupom concede ao usuário o preço dinâmico para o produto indicado, conforme valor confirmado na validação online do cupom no momento do atendimento no posto, desde que observadas as condições deste regulamento.

2. DA FORMA DE UTILIZAÇÃO
2.1. O cupom precisa ser apresentado obrigatoriamente antes do início do abastecimento, com antecedência mínima antes de liberar a bomba.
2.2. A não apresentação prévia do cupom implica perda do benefício, não sendo possível aplicação retroativa.

3. DO PREÇO APLICÁVEL (DINÂMICO)
3.1. O valor exibido no cupom é informativo e dinâmico, podendo variar a qualquer momento.
3.2. O preço aplicável será o valor confirmado na validação online do cupom no momento do atendimento, antes do abastecimento.
3.3. Alterações de preço decorrem de fatores externos como variações de mercado, tributos, políticas de fornecedores e condições econômicas.

4. DA VALIDADE
4.1. O cupom é válido exclusivamente para o posto selecionado.
4.2. Não é cumulativo com outras promoções ou descontos.
4.3. Uso único por abastecimento.

5. DA PLACA CADASTRADA
5.1. O desconto é vinculado à placa cadastrada no momento do uso.
5.2. O frentista poderá conferir a placa do veículo antes de aplicar o benefício.`;

export function getCoupons(stationId: string): Coupon[] {
  return MOCK_COUPONS_BY_STATION[stationId] ?? MOCK_COUPONS_BY_STATION['default'];
}

// ─── CIDADES PARA SELEÇÃO ──────────────────────────────────────────────────────
export const MOCK_CITIES = [
  { state: 'Distrito Federal', cities: [
    { id: 'brasilia',   name: 'Brasília',   state: 'DF' },
    { id: 'taguatinga', name: 'Taguatinga', state: 'DF' },
  ]},
  { state: 'Goiás', cities: [
    { id: 'abadiania', name: 'Abadiânia', state: 'GO' },
    { id: 'goiania',   name: 'Goiânia',   state: 'GO' },
    { id: 'luziania',  name: 'Luziânia',  state: 'GO' },
  ]},
];

// ─── TIPOS CAMINHÃO ────────────────────────────────────────────────────────────
export type TruckVehicle = {
  id: string;
  plate: string;
  model: string;          // ex: Volvo FH, Scania R450
  brand: string;
  axles: number;          // eixos: 3, 4, 5, 6
  tankCapacity: number;   // litros
  fuelType: 'diesel-s10' | 'diesel-s500';
  image: string;
};

export type FuelHistory = {
  id: string;
  stationName: string;
  stationBrand: string;
  date: string;           // ISO
  time: string;
  liters: number;
  pricePerLiter: number;
  subtotal: number;
  discount: number;
  total: number;
  fuelType: string;
  paymentMethod: string;
  nfKey?: string;
};

// ─── VEÍCULOS CAMINHÃO MOCK ───────────────────────────────────────────────────
export const MOCK_TRUCK_VEHICLES: TruckVehicle[] = [
  {
    id: 'truck-1',
    plate: 'BRA-2E23',
    model: 'FH 540 Globetrotter',
    brand: 'Volvo',
    axles: 6,
    tankCapacity: 600,
    fuelType: 'diesel-s10',
    image: '🚛',
  },
  {
    id: 'truck-2',
    plate: 'ABC-1D23',
    model: 'R 450 Highline',
    brand: 'Scania',
    axles: 5,
    tankCapacity: 500,
    fuelType: 'diesel-s10',
    image: '🚚',
  },
];

// ─── HISTÓRICO MOCK ───────────────────────────────────────────────────────────
export const MOCK_FUEL_HISTORY: FuelHistory[] = [
  // Maio 2026 (05)
  {
    id: 'h_may1',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-05-24',
    time: '18:15',
    liters: 50,
    pricePerLiter: 7.30,
    subtotal: 365.00,
    discount: 15.00,
    total: 350.00,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
    nfKey: '43260524203526000168650010000012371234567893',
  },
  {
    id: 'h_may2',
    stationName: 'Posto São Bento 203 Norte Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-05-18',
    time: '10:45',
    liters: 55,
    pricePerLiter: 7.25,
    subtotal: 398.75,
    discount: 16.50,
    total: 382.25,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'Débito',
  },
  {
    id: 'h_may3',
    stationName: 'Posto Jarjour 206 Norte',
    stationBrand: 'Ipiranga',
    date: '2026-05-04',
    time: '14:20',
    liters: 48,
    pricePerLiter: 7.10,
    subtotal: 340.80,
    discount: 12.00,
    total: 328.80,
    fuelType: 'Diesel S-500 Pro',
    paymentMethod: 'PIX',
  },
  // Abril 2026 (04)
  {
    id: 'h1',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-04-12',
    time: '14:30',
    liters: 40,
    pricePerLiter: 7.38,
    subtotal: 295.20,
    discount: 10.40,
    total: 284.80,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
    nfKey: '43260414203526000168650010000012341234567890',
  },
  {
    id: 'h2',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-04-08',
    time: '09:15',
    liters: 35,
    pricePerLiter: 7.12,
    subtotal: 249.20,
    discount: 7.70,
    total: 241.50,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'Débito',
    nfKey: '43260414203526000168650010000012351234567891',
  },
  // Março 2026 (03)
  {
    id: 'h3',
    stationName: 'Posto São Bento 203 Norte Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-03-29',
    time: '07:40',
    liters: 55,
    pricePerLiter: 7.25,
    subtotal: 398.75,
    discount: 14.20,
    total: 384.55,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
  },
  {
    id: 'h4',
    stationName: 'Posto Jarjour 206 Norte',
    stationBrand: 'Ipiranga',
    date: '2026-03-21',
    time: '16:00',
    liters: 48,
    pricePerLiter: 7.10,
    subtotal: 340.80,
    discount: 9.60,
    total: 331.20,
    fuelType: 'Diesel S-500 Pro',
    paymentMethod: 'Dinheiro',
  },
  {
    id: 'h5',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-03-15',
    time: '11:20',
    liters: 60,
    pricePerLiter: 7.30,
    subtotal: 438.00,
    discount: 18.00,
    total: 420.00,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
    nfKey: '43260414203526000168650010000012361234567892',
  },
  // Fevereiro 2026 (02)
  {
    id: 'h_feb1',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-02-22',
    time: '16:10',
    liters: 42,
    pricePerLiter: 7.20,
    subtotal: 302.40,
    discount: 10.50,
    total: 291.90,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
  },
  {
    id: 'h_feb2',
    stationName: 'Posto Jarjour 206 Norte',
    stationBrand: 'Ipiranga',
    date: '2026-02-10',
    time: '08:30',
    liters: 38,
    pricePerLiter: 7.10,
    subtotal: 269.80,
    discount: 7.60,
    total: 262.20,
    fuelType: 'Diesel S-500 Pro',
    paymentMethod: 'Débito',
  },
  // Janeiro 2026 (01)
  {
    id: 'h_jan1',
    stationName: 'Posto de Combustíveis 214 Sul Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-01-28',
    time: '11:45',
    liters: 50,
    pricePerLiter: 7.15,
    subtotal: 357.50,
    discount: 12.50,
    total: 345.00,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
  },
  {
    id: 'h_jan2',
    stationName: 'Posto São Bento 203 Norte Petrobras',
    stationBrand: 'Petrobras',
    date: '2026-01-15',
    time: '09:00',
    liters: 45,
    pricePerLiter: 7.10,
    subtotal: 319.50,
    discount: 9.00,
    total: 310.50,
    fuelType: 'Diesel S-10 Pro',
    paymentMethod: 'PIX',
  },
];

// ─── POSTOS PRO (com diesel e info de rota) ───────────────────────────────────
export type TruckStation = {
  id: string;
  name: string;
  brand: string;
  neighborhood: string;
  distance: number;       // km
  dieselS10Price: number;
  dieselS500Price?: number;
  discount: number;
  estimatedSavings: number;
  hasParking: boolean;    // estacionamento para caminhão
  hasTruckLane: boolean;  // pista exclusiva
};

export const MOCK_TRUCK_STATIONS: TruckStation[] = [
  {
    id: 'ts-1',
    name: 'Posto de Combustíveis 214 Sul Petrobras',
    brand: 'Petrobras',
    neighborhood: 'Asa Sul',
    distance: 1.2,
    dieselS10Price: 6.39,
    dieselS500Price: 6.10,
    discount: 0.20,
    estimatedSavings: 10.00,
    hasParking: true,
    hasTruckLane: true,
  },
  {
    id: 'ts-2',
    name: 'Posto São Bento 203 Norte Petrobras',
    brand: 'Petrobras',
    neighborhood: 'Asa Norte',
    distance: 4.5,
    dieselS10Price: 6.44,
    dieselS500Price: 6.15,
    discount: 0.25,
    estimatedSavings: 15.00,
    hasParking: true,
    hasTruckLane: false,
  },
  {
    id: 'ts-3',
    name: 'Posto Jarjour 206 Norte',
    brand: 'Ipiranga',
    neighborhood: 'Asa Norte',
    distance: 4.6,
    dieselS10Price: 6.35,
    discount: 0.25,
    estimatedSavings: 15.00,
    hasParking: false,
    hasTruckLane: false,
  },
];

// helper de economia acumulada no mês
export function getMonthlyStats(history: FuelHistory[]) {
  const total = history.reduce((acc, h) => acc + h.total, 0);
  const savings = history.reduce((acc, h) => acc + h.discount, 0);
  const liters = history.reduce((acc, h) => acc + h.liters, 0);
  return { total, savings, liters };
}
