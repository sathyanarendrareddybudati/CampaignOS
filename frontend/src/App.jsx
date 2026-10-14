import { useState, useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import Dashboard from './Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  const handleLogin = (newToken) => {
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <>
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
