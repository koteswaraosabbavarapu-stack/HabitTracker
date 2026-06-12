import { createContext, useState, useContext } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // ─── Register ──────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    return res.data
  }

  // ─── Login ─────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    return res.data
  }

  // ─── Logout ────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    setAccessToken(null)
    // cookie is cleared by backend
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// custom hook — easy to use anywhere
export const useAuth = () => useContext(AuthContext)