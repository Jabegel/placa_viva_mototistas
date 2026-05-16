# Placa Viva Pro ⛽🚀

Este repositório contém o código-fonte do projeto **Placa Viva Pro**, uma solução inteligente para motoristas profissionais gerenciarem economia de combustível e benefícios. O projeto é composto por um aplicativo móvel (React Native) e um servidor de API (Go).

## 📋 Sumário
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Backend (Go)](#configuração-do-backend-go)
3. [Configuração do Frontend (React Native)](#configuração-do-frontend-react-native)
4. [Conexão entre App e Servidor](#conexão-entre-app-e-servidor)
5. [Configuração do Emulador Android](#configuração-do-emulador-android)
6. [Executando em Dispositivo Físico](#executando-em-dispositivo-físico)
7. [Fluxo do Aplicativo](#fluxo-do-aplicativo)

---

## 🛠 Pré-requisitos
Certifique-se de ter as seguintes ferramentas e ambientes configurados em sua máquina de desenvolvimento:

*   **Node.js** (versão 18.x ou superior) e **npm** (ou **Yarn**)
    *   Recomendado usar `nvm` (Node Version Manager) para gerenciar versões do Node.js.
*   **Go** (versão 1.22 ou superior)
    *   Verifique a instalação com `go version`.
*   **Java Development Kit (JDK)** (versão 11 ou superior)
    *   Verifique a instalação com `java -version` e `javac -version`.
*   **Android Studio** (versão mais recente)
    *   Com o **SDK do Android** configurado (API 33 ou superior).
    *   Variáveis de ambiente `ANDROID_HOME` e `PATH` configuradas corretamente.
*   **Git** (para clonar o repositório)
*   **Editor de Código**: Visual Studio Code é altamente recomendado com extensões para React Native e Go.

---

## 🖥 Configuração do Backend (Go)
O backend é desenvolvido em Go e responsável pela API que serve o aplicativo móvel. Ele gerencia a autenticação, dados de postos, cupons e outras lógicas de negócio.

1.  **Navegue até o diretório do backend:**
    ```bash
    cd placa_viva_pro_completo/backend
    ```

2.  **Instale as dependências do Go:**
    ```bash
    go mod tidy
    ```
    *Este comando baixará todas as dependências listadas no `go.mod`.*

3.  **Execute o servidor backend:**
    ```bash
    go run cmd/server/main.go
    ```
    O servidor deve iniciar na porta `8080` por padrão. Você verá uma mensagem indicando que o servidor está rodando e pronto para receber requisições.

---

## 📱 Configuração do Frontend (React Native)
O frontend é um aplicativo móvel desenvolvido com React Native, com foco em alta fidelidade ao design do Figma.

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd placa_viva_pro_completo/mobile
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do React Native (Metro Bundler):**
    ```bash
    npm start
    ```
    Isso iniciará o Metro Bundler em um novo terminal. Mantenha este terminal aberto, pois ele é essencial para o funcionamento do aplicativo.

---

## 🔗 Conexão entre App e Servidor
Para que o aplicativo React Native (rodando no emulador ou dispositivo físico) consiga se comunicar com o backend Go (rodando em sua máquina de desenvolvimento), você precisa configurar o endereço IP correto.

1.  **Descubra o IP da sua máquina na rede local:**
    *   **Linux/macOS:** Abra o terminal e digite `ifconfig` ou `ip addr`. Procure pelo seu endereço IP local (geralmente começa com `192.168.` ou `10.`).
    *   **Windows:** Abra o Prompt de Comando e digite `ipconfig`. Procure pelo seu endereço IPv4.

2.  **Atualize o arquivo `api.ts` no frontend:**
    Abra o arquivo `placa_viva_pro_completo/mobile/src/services/api.ts` e substitua `YOUR_LOCAL_IP` pelo endereço IP da sua máquina:

    ```typescript
    // mobile/src/services/api.ts
    import axios from 'axios';

    const api = axios.create({
      baseURL: 'http://SEU_IP_AQUI:8080', // <-- **MUDE AQUI PARA O SEU IP LOCAL**
    } );

    export default api;
    ```

3.  **Reinicie o Metro Bundler** (feche o terminal onde ele está rodando e execute `npm start` novamente) para que a alteração no `api.ts` seja aplicada.

---

## 🤖 Configuração do Emulador Android
Para rodar o aplicativo em um emulador Android:

1.  **Abra o Android Studio.**

2.  **Configure um AVD (Android Virtual Device) específico:**
    *   Vá em `Tools > Device Manager` (ou `AVD Manager` em versões mais antigas).
    *   Clique em `Create device`.
    *   Selecione a categoria **Phone**.
    *   Escolha o hardware **Pixel 7**.
    *   Clique em `Next`.
    *   Na tela de System Image, selecione a imagem do sistema **API 33 (Tiramisu)**. Se não estiver instalada, clique em `Download`.
    *   Clique em `Next` e finalize a criação do AVD.

3.  **Inicie o emulador:**
    *   No `Device Manager`, clique no botão de `Play` (triângulo verde) ao lado do seu AVD `Pixel 7 API 33`.
    *   Aguarde o emulador iniciar completamente.

4.  **Execute o aplicativo no emulador:**
    *   Com o Metro Bundler (`npm start`) rodando em um terminal, abra **outro terminal** no diretório `placa_viva_pro_completo/mobile`.
    *   Execute o comando:
        ```bash
        npm run android
        # ou yarn android
        ```
    *   O aplicativo será instalado e iniciado automaticamente no emulador.

---

## 📱 Executando em Dispositivo Físico (Android)
Para rodar o aplicativo em um celular Android físico:

1.  **Habilite o Modo Desenvolvedor e Depuração USB** no seu dispositivo Android.
    *   Vá em `Configurações > Sobre o telefone` e toque várias vezes em `Número da versão` até o Modo Desenvolvedor ser ativado.
    *   Em `Configurações > Sistema > Opções do desenvolvedor`, ative a `Depuração USB`.

2.  **Conecte o celular ao computador** via cabo USB.

3.  **Verifique a conexão:**
    *   No terminal, execute `adb devices`. Seu dispositivo deve aparecer na lista.

4.  **Execute o aplicativo no dispositivo:**
    *   Com o Metro Bundler (`npm start`) rodando em um terminal, abra **outro terminal** no diretório `placa_viva_pro_completo/mobile`.
    *   Execute o comando:
        ```bash
        npm run android
        # ou yarn android
        ```
    *   O aplicativo será instalado e iniciado automaticamente no seu celular.

---

## 🔄 Fluxo do Aplicativo
O fluxo de navegação atual do aplicativo é o seguinte:

1.  **Login**: O motorista insere seu número de telefone para autenticação.
2.  **Registro (condicional)**: Se o número for novo, o motorista é guiado pelas telas de `RegisterUser` (informações pessoais) e `RegisterVehicle` (dados do veículo).
3.  **Seleção de Local**: Após login/registro, o motorista escolhe a `SelectCity` (cidade) e, em seguida, a `SelectStation` (posto de combustível).
4.  **Detalhes do Posto (`StationDetail`)**: Exibe os cupons disponíveis para o posto selecionado, a recomendação inteligente de qual combustível compensa mais e os preços.
    *   **Modal de Cadastro de Placa**: Se o motorista tentar ativar um cupom sem ter uma placa cadastrada, um modal (`RegisterPlateModal`) será exibido solicitando o cadastro da placa.
5.  **Dashboard**: Resumo de economias, último abastecimento e viagens recentes.

---

*Desenvolvido com foco na melhor experiência para o motorista.*
