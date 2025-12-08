import React, { createContext, useContext, useEffect, useState } from 'react'
import pb, { loginUser, logoutUser, signUpUser, getCurrentUser } from '../services/pocketbaseService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  useEffect(() => {
    // subscribe to auth store changes
    const onChange = () => {
      setUser(getCurrentUser())
    }
    try {
      pb.authStore.onChange(onChange)
    } catch (err) {
      // fallback: no-op
    }
    // cleanup: no explicit unsubscribe API, but we can ignore
    return () => {
      try { pb.authStore.onChange(() => {}) } catch (e) {}
    }
  }, [])

  const login = async (email, password) => {
    const res = await loginUser(email, password)
    setUser(getCurrentUser())
    return res
  }

  const signup = async (opts) => {
    const res = await signUpUser(opts)
    setUser(getCurrentUser())
    return res
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
