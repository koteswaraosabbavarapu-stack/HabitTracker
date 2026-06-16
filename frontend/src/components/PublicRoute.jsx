import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicRoute = ({ children }) => {
  const { user } = useAuth()

  // if already logged in → redirect to habits
  if (user) {
    return <Navigate to="/habits" replace />
  }

  // if not logged in → show login/register page
  return children
}

export default PublicRoute