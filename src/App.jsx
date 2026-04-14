import { useState } from 'react'
import Signup from './components/Signup.jsx'
import StudentSignup from './student sign up/StudentSignup.jsx'
import TeacherSignup from './teacher-signup/TeacherSignup.jsx'
import BusDriverSignup from './bus-driver-signup/BusDriverSignup.jsx'
import ManagerSignup from './manager-signup/ManagerSignup.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import BusInchargeDashboard from './bus-incharge-dashboard/pages/Dashboard.jsx'
import BusDriverDashboard from './bus-driver-dashboard/pages/Dashboard.jsx'

function App() {
  const [page, setPage] = useState('login')
  const [userDetails, setUserDetails] = useState({
    name: '',
    role: '',
    busNumber: '',
    routeName: '',
    busStop: '',
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [role, setRole] = useState('')

  const handleStudentClick = () => {
    setPage('studentSignup')
  }

  const handleTeacherClick = () => {
    setRole('Teacher')
    setPage('teacherSignup')
  }

  const handleBusInchargeClick = () => {
    setRole('Bus Incharge')
    setPage('teacherSignup')
  }

  const handleBusDriverClick = () => {
    setRole('Bus Driver')
    setPage('busDriverSignup')
  }

  const handleManagerClick = () => {
    setRole('Manager')
    setPage('managerSignup')
  }

  const handleSignupComplete = (data) => {
    const userData = {
      name: data.name || 'User',
      role: data.role || role || 'Student',
      busNumber: data.busNumber || 'N/A',
      routeName: data.routeName || 'N/A',
      busStop: data.busStop || 'N/A',
    }
    setUserDetails(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    if (userData.role === 'Bus Incharge') {
      setPage('busInchargeDashboard')
    } else if (userData.role === 'Bus Driver') {
      setPage('busDriverDashboard')
    } else {
      setPage('dashboard')
    }
  }

  const handleBackToLogin = () => {
    setUserDetails({
      name: '',
      role: '',
      busNumber: '',
      routeName: '',
      busStop: '',
    })
    setRole('')
    setPage('login')
  }

  return (
    <>
      {page === 'login' && (
        <Signup
          onStudentClick={handleStudentClick}
          onTeacherClick={handleTeacherClick}
          onBusInchargeClick={handleBusInchargeClick}
          onBusDriverClick={handleBusDriverClick}
          onManagerClick={handleManagerClick}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      {page === 'studentSignup' && (
        <StudentSignup
          onSignupComplete={handleSignupComplete}
          onBack={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'teacherSignup' && (
        <TeacherSignup
          role={role}
          onSignupComplete={handleSignupComplete}
          onBack={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'busDriverSignup' && (
        <BusDriverSignup
          onSignupComplete={handleSignupComplete}
          onBack={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'managerSignup' && (
        <ManagerSignup
          onSignupComplete={handleSignupComplete}
          onBack={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard
          onLogout={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'busInchargeDashboard' && (
        <BusInchargeDashboard
          onLogout={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
      {page === 'busDriverDashboard' && (
        <BusDriverDashboard
          onLogout={handleBackToLogin}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  )
}

export default App