import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Habits from './pages/Habits'
import GoogleSuccess from './pages/GoogleSuccess'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/habits" replace />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        <Route path="/habits" element={
          <ProtectedRoute><Habits /></ProtectedRoute>
        } />

        {/* Google callback page — no guard needed */}
        <Route path="/auth/google/success" element={<GoogleSuccess />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App