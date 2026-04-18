import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured } from '../firebase'

const AuthContext = createContext(null)

// Modo demo quando Firebase não está configurado
const DEMO_MODE = !isConfigured

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEMO_MODE) {
      // Em modo demo, carrega o usuário do localStorage
      const saved = localStorage.getItem('demo_user')
      if (saved) {
        try { setUser(JSON.parse(saved)) } catch {}
      }
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  async function signInWithGoogle() {
    if (DEMO_MODE) {
      const demo = {
        displayName: 'Estudante Demo',
        email: 'demo@linguaflow.app',
        photoURL: null,
        uid: 'demo-user',
      }
      localStorage.setItem('demo_user', JSON.stringify(demo))
      setUser(demo)
      return
    }
    await signInWithPopup(auth, googleProvider)
  }

  async function signOut() {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_user')
      setUser(null)
      return
    }
    await fbSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, demoMode: DEMO_MODE }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
