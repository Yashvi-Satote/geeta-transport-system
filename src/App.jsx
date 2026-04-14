import { useState } from 'react'
import Signup from './components/Signup.jsx'
import StudentSignup from './student sign up/StudentSignup.jsx'
import TeacherSignup from './teacher-signup/TeacherSignup.jsx'
import BusDriverSignup from './bus-driver-signup/BusDriverSignup.jsx'
import ManagerSignup from './manager-signup/ManagerSignup.jsx'
import Dashboard from './student sign up/Dashboard.jsx'

function App() {
  const [page, setPage] = useState('login')
  const [studentName, setStudentName] = useState('')
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
    setStudentName(data.name || 'User')
    setPage('dashboard')
  }

  const handleBackToLogin = () => {
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
          studentName={studentName}
          onLogout={handleBackToLogin}
        />
      )}
    </>
  )
}

export default App