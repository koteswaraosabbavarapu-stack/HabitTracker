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
      console.log('trying silent refresh...')
      const res = await api.post('/auth/refresh')
      console.log('refresh response:', res.data)

      setToken(res.data.accessToken)

      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${res.data.accessToken}` }
      })
      console.log('user response:', userRes.data)
      setUser(userRes.data.user)

    } catch (err) {
      console.log('silent refresh failed:', err.message)  // ← what error?
      clearToken()
      setUser(null)
    } finally {
      console.log('setting loading false')
      setLoading(false)   // ← this MUST run no matter what
    }
  }

  silentRefresh()
}, [])

  const setUserManually = (userData) => {
  setUser(userData)
  }

 
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
    <AuthContext.Provider value={{ user, login, register, logout,setUserManually }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)