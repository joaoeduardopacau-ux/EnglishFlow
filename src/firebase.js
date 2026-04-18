import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(firebaseConfig.apiKey)

// Diagnóstico temporário: mostra no console se as env vars chegaram certinho
// (sem expor o valor completo da apiKey). Remover depois que login estiver ok.
if (typeof window !== 'undefined') {
  const mask = (v) => (v ? `${v.slice(0, 6)}…${v.slice(-4)} (len ${v.length})` : '❌ VAZIO')
  // eslint-disable-next-line no-console
  console.log('[Firebase config]', {
    isConfigured,
    apiKey: mask(firebaseConfig.apiKey),
    authDomain: firebaseConfig.authDomain || '❌ VAZIO',
    projectId: firebaseConfig.projectId || '❌ VAZIO',
    storageBucket: firebaseConfig.storageBucket || '❌ VAZIO',
    messagingSenderId: firebaseConfig.messagingSenderId || '❌ VAZIO',
    appId: mask(firebaseConfig.appId),
  })
}

let app = null
let auth = null
let googleProvider = null
let db = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  db = getFirestore(app)
}

export { auth, googleProvider, db }
