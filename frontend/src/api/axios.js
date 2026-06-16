import axios from 'axios'
import { getToken } from './tokenManager'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,    // sends refreshToken cookie automatically
})

// ─── Request Interceptor ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken()    // get token from memory

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config    // must return config!
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,    // if success — just return response

  async (error) => {
    const originalRequest = error.config

    // if 401 (token expired) and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true    // mark so we don't retry infinitely

      try {
        // try to get new access token using refresh token cookie
        const res = await api.post('/auth/refresh')
        const newToken = res.data.accessToken

        // update token in memory
        setToken(newToken)

        // update the failed request's header with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // retry the original request
        return api(originalRequest)

      } catch (refreshError) {
        // refresh token also expired → force logout
        clearToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api