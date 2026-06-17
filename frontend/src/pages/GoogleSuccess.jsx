import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../api/tokenManager'
import { useAuth } from '../context/AuthContext'

const GoogleSuccess = () => {
  const navigate = useNavigate()
  const { setUserManually } = useAuth()

  useEffect(() => {
    // read token from URL
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const role = params.get('role')
    const id = params.get('id')

    if (token) {
      // store token in memory
      setToken(token)

      // set user in context
      setUserManually({ id, name, email, role })

      // redirect to habits
      navigate('/habits')
    } else {
      navigate('/login')
    }
  }, [])

  return <div>Loading...</div>
}

export default GoogleSuccess