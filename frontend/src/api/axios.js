import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,    // ← sends cookies automatically (refresh token)
})

export default api