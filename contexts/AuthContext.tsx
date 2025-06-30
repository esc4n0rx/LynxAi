"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { signInWithGoogle as googleSignIn, signOut as authSignOut } from '@/lib/auth'
import type { User, AuthContextType } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      await googleSignIn()
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
    }
  }

  const signOut = async () => {
    try {
      await authSignOut()
    } catch (error) {
      console.error('Error in signOut:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}