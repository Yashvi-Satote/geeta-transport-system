import './studentSignup.css'

function Dashboard({ studentName, onLogout }) {
  return (
    <div className="student-signup-page">
      <div className="signup-card dashboard-card">
        <h1 className="signup-title">Welcome, {studentName || 'Student'}</h1>
        <p className="dashboard-text">
          Your transport signup was successful. This is a simulated dashboard for the
          transport tracking system.
        </p>
        <button type="button" className="submit-button" onClick={onLogout}>
          Return to Login
        </button>
      </div>
    </div>
  )
}

export default Dashboard