# Placa Viva — Como Rodar

---

## Você vai precisar instalar (só uma vez)

1. **Node.js** → https://nodejs.org (baixe a versão "LTS")
2. **Go** → https://go.dev/dl (baixe a versão mais recente)
3. **App Expo Go** no celular → busque "Expo Go" na App Store ou Google Play

---

## Estrutura do zip

Quando você extrair o zip, vai aparecer assim:

```
placa-viva/
├── backend/     ← API em Go (servidor)
└── frontend/    ← App React Native (Expo)
```

Você vai abrir **dois terminais** ao mesmo tempo.

---

## Terminal 1 — Rodar o Backend (Go)

```bash
cd placa-viva/backend
go mod tidy
go run .
```

Vai aparecer: `Servidor rodando na porta :8080`
**Deixe esse terminal aberto.**

---

## Terminal 2 — Rodar o App (React Native)

```bash
cd placa-viva/frontend
npm install
npx expo start
```

Vai aparecer um **QR Code** no terminal.

---

## Abrir o app no celular

> ⚠️ Celular e computador precisam estar na **mesma rede Wi-Fi**

- **Android**: Abra o Expo Go → toque em "Scan QR code" → escaneie
- **iPhone**: Abra a câmera → aponte pro QR → toque na notificação

O app vai abrir direto no celular.

---

## Se o QR Code não funcionar

Tente o modo tunnel (funciona em qualquer rede, inclusive da faculdade):

```bash
npx expo start --tunnel
```

Na primeira vez ele vai perguntar se quer instalar o `@expo/ngrok`, responda `y`.

---

## Conectar o app ao backend no celular físico

Por padrão o app tenta se conectar em `localhost`, mas no celular físico isso não funciona.

Você precisa trocar pelo **IP da sua máquina** nos arquivos abaixo:

**Como descobrir seu IP:**
- Windows: abra o cmd e digite `ipconfig` → procure "Endereço IPv4" (ex: 192.168.1.100)
- Mac/Linux: abra o terminal e digite `ifconfig` → procure "inet" (ex: 192.168.1.100)

**Onde trocar** (procure por `localhost` nesses arquivos):
- `frontend/screens/LoginScreen.tsx` → linha com `const API_URL`
- `frontend/screens/VerifyCodeScreen.tsx` → linha com `const API_URL`
- `frontend/screens/CouponsScreen.tsx` → linha com `const API_URL`
- `frontend/screens/StationSelectScreen.tsx` → linha com `const API_URL`

Troque `http://localhost:8080` por `http://SEU_IP:8080`

Exemplo: `const API_URL = 'http://192.168.1.100:8080';`

> 💡 **Dica:** Se usar o modo `--tunnel` no Expo, o app se conecta ao backend pelo tunnel automaticamente e você não precisa trocar o IP.

---

## Resumo rápido

| O que | Onde | Comando |
|-------|------|---------|
| Backend | pasta `backend/` | `go run .` |
| Frontend | pasta `frontend/` | `npx expo start` |
| Ver no celular | App Expo Go | Escanear QR |

