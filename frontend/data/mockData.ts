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
    { id: 'c4', fuelType: 'GNV',      fuelSubtype: '',          price: 3.99, tag: 'Economia de até 40%', color: '#5e4a8a' },
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
