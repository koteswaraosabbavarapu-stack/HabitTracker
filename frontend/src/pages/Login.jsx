import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/habits')      // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleGoogleLogin = () => {
  // redirects to backend which redirects to Google
  window.location.href = 'http://localhost:5000/api/auth/google'
}

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>

        <button onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </form>
    </div>
  )
}

export default Login