import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../api/tokenManager'
import { useAuth } from '../context/AuthContext'

const GoogleSuccess = () => {
  const navigate = useNavigate()
  const { setUserManually } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const role = params.get('role')
    const id = params.get('id')
    const error = params.get('error')

    // handle error from backend
    if (error) {
      setError('Google login failed. Please try again.')
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    // handle success
    if (token) {
      setToken(token)
      setUserManually({ id, name, email, role })
      navigate('/habits')
    } else {
      navigate('/login')
    }
  }, [])

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p>Completing Google login...</p>
    </div>
  )
}

export default GoogleSuccess