import { useState } from 'react'
import { AuthProvider, useAuth }     from './auth/AuthContext'
import { DataProvider }              from './shared/DataContext'
import { ThemeProvider }             from './theme/ThemeContext'
import { LanguageProvider }          from './i18n/LanguageContext'
import GlobalControls                from './theme/GlobalControls'

import Login   from './auth/Login'
import Signup  from './auth/Signup'

import BusInchargeDashboard from './bus-incharge-dashboard/pages/Dashboard'
import BusDriverDashboard   from './bus-driver-dashboard/pages/Dashboard'
import ManagerDashboard     from './manager-dashboard/pages/Dashboard'
import Dashboard            from './dashboard/Dashboard'

// -----------------------------------------------------------------------
// Inner router — role-based routing after auth
// -----------------------------------------------------------------------
function AppRouter() {
  const { isLoggedIn, currentUser, logout } = useAuth()
  const [authPage, setAuthPage] = useState('login')

  if (!isLoggedIn) {
    if (authPage === 'signup') {
      return <Signup onNavigateLogin={() => setAuthPage('login')} />
    }
    return <Login onNavigateSignup={() => setAuthPage('signup')} />
  }

  const role = currentUser?.role

  if (role === 'incharge') {
    return <BusInchargeDashboard onLogout={logout} />
  }
  if (role === 'driver') {
    return <BusDriverDashboard onLogout={logout} />
  }
  if (role === 'manager') {
    return <ManagerDashboard onLogout={logout} userDetails={currentUser} />
  }
  return <Dashboard onLogout={logout} userDetails={currentUser} />
}

// -----------------------------------------------------------------------
// Root App — providers stack
// -----------------------------------------------------------------------
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <AppRouter />
            <GlobalControls />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}