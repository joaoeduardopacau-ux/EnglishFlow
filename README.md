# EnglishFlow

App de treino de inglês com visual minimalista (preto, roxo, branco), responsivo para desktop e celular.

## Funcionalidades

- 🔐 **Login com Google** (Firebase Auth — com fallback em modo demo/localStorage)
- 🎯 **Foco de estudo** — escolha uma gramática (presente, passado, futuro, perguntas…) e um tema (comida, viagem, trabalho…) e toda a prática se adapta
- 📚 **Dicionário** — 500+ palavras organizadas por nível e categoria
- 🗂️ **Flashcards** — cartões viráveis com áudio e exemplos
- 🎮 **Jogos** — múltipla escolha, combinar pares, completar frase, tradução rápida
- 🎧 **Listening** — ouça a frase e escolha / digite (Web Speech API)
- 🎤 **Speaking** — leia em voz alta e receba feedback (Speech Recognition)
- 🧩 **Montar Frase** — veja em português e monte a frase em inglês usando o banco de palavras

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. (Opcional) Configurar Firebase

Copie `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Para pegar as credenciais:
1. Acesse https://console.firebase.google.com
2. Crie um projeto
3. Em **Authentication → Sign-in method**, ative **Google**
4. Em **Project settings → Your apps → Web**, copie o `firebaseConfig`

> Sem `.env`, o app roda em **modo demo** (login fake, dados salvos em localStorage).

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Abra http://localhost:5173

### 4. Build de produção

```bash
npm run build
npm run preview
```

## Stack

- **React 18** + Vite
- **Tailwind CSS** (tema customizado preto/roxo)
- **Firebase Auth** (Google Sign-In) — opcional
- **Web Speech API** (síntese + reconhecimento de voz, sem dependência externa)
- **React Router v6** + Lucide icons

## Estrutura

```
src/
├── components/   Layout, BottomNav, StageSelector, AchievementToasts
├── contexts/     Auth, Progress, Stage, Focus, Theme
├── data/         dictionary.js, sentences.js
├── hooks/        useSpeech (TTS), useSpeechRecognition
├── pages/        Login, Home, Learn, Flashcards, Games, Listening,
│                 SentenceBuilder, Speaking, Dictionary, Achievements
├── utils/        sentenceGenerator, phonetic
├── App.jsx       Rotas protegidas
└── firebase.js   Config opcional
```

## Deploy

O projeto está configurado para deploy em Vercel (`vercel.json`), Netlify (`netlify.toml`) ou qualquer host estático via Hostinger/Apache (`public/.htaccess`).
