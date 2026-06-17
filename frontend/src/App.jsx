import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Habits from './pages/Habits'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import GoogleSuccess from './pages/GoogleSuccess'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* default route → go to habits */}
        <Route path="/" element={<Navigate to="/habits" replace />} />

        {/* public routes — only for non logged in users */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* protected routes — only for logged in users */}
        <Route path="/habits" element={
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        } />
        <Route path="/google/success" element={<GoogleSuccess />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App