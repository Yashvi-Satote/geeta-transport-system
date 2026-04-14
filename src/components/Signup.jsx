import React, { useEffect } from 'react'

function Signup({ onStudentClick, onTeacherClick, onBusInchargeClick, isDarkMode, setIsDarkMode }) {
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)

    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  return (
    <div className="container">
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <h1 className="title">Geeta Transport Login</h1>

      <div className="content">
        <p className="question">What are you signing in as?</p>

        <div className="button-group">
          <button className="role-button" onClick={onStudentClick}>
            Student
          </button>
          <button className="role-button" onClick={onTeacherClick}>Teacher</button>
          <button className="role-button" onClick={onBusInchargeClick}>Bus Incharge</button>
          <button className="role-button">Bus Driver</button>
          <button className="role-button">Manager</button>
        </div>
      </div>
    </div>
  )
}

export default Signup