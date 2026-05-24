# Placa Viva — App React Native (Expo)

## Pré-requisitos
- Node.js instalado (https://nodejs.org)
- App **Expo Go** no celular (Android ou iOS) — baixe na loja

---

## Como rodar

### 1. Instale as dependências (só na primeira vez)
```bash
npm install
```

### 2. Inicie o app
```bash
npx expo start
```

Vai aparecer um QR Code no terminal.

### 3. Abra no celular
- **Android**: Abra o app Expo Go → escaneie o QR Code
- **iPhone**: Abra a câmera → aponte pro QR Code → toque na notificação

> ⚠️ Celular e computador precisam estar na **mesma rede Wi-Fi**

---

## Se o QR Code não funcionar

Tente o modo tunnel:
```bash
npx expo start --tunnel
```

---

## Rodar no emulador (opcional)

### Android (Android Studio)
```bash
npx expo start
# pressione 'a' no terminal
```

### iOS (só Mac com Xcode)
```bash
npx expo start
# pressione 'i' no terminal
```

---

## Estrutura do projeto

```
placa-viva-app/
├── App.tsx                  # Navegação entre telas
├── screens/
│   ├── LoginScreen.tsx      # Tela de login (celular)
│   ├── VerifyCodeScreen.tsx # Verificação OTP (6 dígitos)
│   ├── CitySelectScreen.tsx # Escolha da cidade
│   ├── StationSelectScreen.tsx # Escolha do posto
│   └── CouponsScreen.tsx   # Cupons + Modal de placa
└── package.json
```

## Fluxo das telas
```
Login → Verificar código → Escolher cidade → Escolher posto → Ver cupons
```

---

## Backend (Go)

Fica na pasta `../backend/`. Para rodar:
```bash
cd ../backend
go mod tidy
go run .
# Roda em http://localhost:8080
```

> Se estiver testando no **celular físico**, troque `localhost` pelo IP da sua máquina
> nas telas (ex: `http://192.168.1.100:8080`). Veja seu IP com `ipconfig` (Windows) ou `ifconfig` (Mac/Linux).
