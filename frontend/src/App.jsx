import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Habits from './pages/Habits'

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/habits" element={<Habits />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;