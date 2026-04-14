function Information({ userDetails }) {
  const details = {
    name: userDetails?.name || 'User',
    role: userDetails?.role || 'Student',
    busNumber: userDetails?.busNumber || 'N/A',
    routeName: userDetails?.routeName || 'N/A',
    busStop: userDetails?.busStop || 'N/A',
  }

  return (
    <div className="information-page">
      <div className="info-header">
        <h1 className="info-title">User Information</h1>
        <p className="info-subtitle">Your account details and bus information</p>
      </div>
      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon">👤</span>
            <h3 className="info-card-title">Personal Details</h3>
          </div>
          <div className="info-card-content">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{details.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{details.role}</span>
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon">🚌</span>
            <h3 className="info-card-title">Bus Details</h3>
          </div>
          <div className="info-card-content">
            <div className="info-item">
              <span className="info-label">Bus Number:</span>
              <span className="info-value">{details.busNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Route Name:</span>
              <span className="info-value">{details.routeName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Bus Stop:</span>
              <span className="info-value">{details.busStop}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Information
