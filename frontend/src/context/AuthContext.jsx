import { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'
import { setToken, clearToken } from '../api/tokenManager'   // ← add this

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const res = await api.post('/auth/refresh')

        setToken(res.data.accessToken)    // ← store in tokenManager

        const userRes = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${res.data.accessToken}` }
        })
        setUser(userRes.data.user)

      } catch (err) {
        clearToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    silentRefresh()
  }, [])

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    setToken(res.data.accessToken)    // ← store in tokenManager
    setUser(res.data.user)
    return res.data
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.accessToken)    // ← store in tokenManager
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await api.post('/auth/logout')
    clearToken()                      // ← clear from tokenManager
    setUser(null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)