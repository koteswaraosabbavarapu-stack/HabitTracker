import { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(true)  // ← new

  // ─── Silent refresh on page load ─────────────────────
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        // call refresh endpoint
        // browser automatically sends refreshToken cookie
        const res = await api.post('/auth/refresh')

        setAccessToken(res.data.accessToken)

        // also get user info
        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${res.data.accessToken}` }
        })
        setUser(userRes.data.user)

      } catch (err) {
        // refresh token expired or doesn't exist
        // user needs to login
        setUser(null)
        setAccessToken(null)
      } finally {
        setLoading(false)   // done checking
      }
    }

    silentRefresh()
  }, [])

  // ─── Register ─────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    return res.data
  }

  // ─── Login ────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    setAccessToken(res.data.accessToken)
    return res.data
  }

  // ─── Logout ───────────────────────────────────────────
  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    setAccessToken(null)
  }

  // show nothing while checking auth status
  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)