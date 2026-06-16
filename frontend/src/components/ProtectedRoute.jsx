import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  // if not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // if logged in → show the page
  return children
}

export default ProtectedRoute