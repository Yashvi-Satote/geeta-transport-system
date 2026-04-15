import './studentSignup.css'
import SharedMap from '../../shared/components/SharedMap'

function Dashboard({ studentName, onLogout }) {
  return (
    <div className="student-signup-page">
      <div className="student-dashboard">
        <div className="student-header">
          <h1 className="signup-title">Welcome, {studentName || 'Student'}</h1>
          <button type="button" className="submit-button logout-btn" onClick={onLogout}>
            Return to Login
          </button>
        </div>
        <div className="student-map-container">
          <SharedMap mode="single" />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
