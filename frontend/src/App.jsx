import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Dashboard from './Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const navigate = useNavigate()

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    navigate('/overview', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={token ? <Navigate to="/overview" replace /> : <AuthPage onLogin={handleLogin} />} 
      />
      <Route 
        path="/*" 
        element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  )
}

export default App
