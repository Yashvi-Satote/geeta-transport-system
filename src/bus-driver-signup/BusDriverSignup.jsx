import { useState, useEffect } from 'react'
import './busDriverSignup.css'

function BusDriverSignup({ onSignupComplete, onBack, isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    language: '',
    busNumber: '',
    routeName: '',
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSignupComplete({ name: formData.name || 'Bus Driver' })
  }

  return (
    <div className="bus-driver-signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Bus Driver Sign Up</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <span className="input-icon">🆔</span>
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-row">
            <span className="input-icon">🌐</span>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              className="language-select"
            >
              <option value="">Select Preferred Language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>

          <div className="input-row">
            <span className="input-icon">🚌</span>
            <input
              type="text"
              name="busNumber"
              placeholder="Bus Number"
              value={formData.busNumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-row">
            <span className="input-icon">🗺️</span>
            <input
              type="text"
              name="routeName"
              placeholder="Route Name"
              value={formData.routeName}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <button type="button" className="back-button" onClick={onBack}>
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default BusDriverSignup
