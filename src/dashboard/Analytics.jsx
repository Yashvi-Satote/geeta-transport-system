function Analytics() {
  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="analytics-title">Bus Speed Analytics</h1>
        <p className="analytics-subtitle">Real-time speed monitoring and historical data</p>
      </div>
      <div className="analytics-cards">
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-icon">⚡</span>
            <h3 className="analytics-card-title">Current Speed</h3>
          </div>
          <div className="analytics-card-content">
            <div className="speed-value">45 km/h</div>
            <div className="speed-status">Normal</div>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-card-header">
            <span className="analytics-card-icon">📈</span>
            <h3 className="analytics-card-title">Average Speed</h3>
          </div>
          <div className="analytics-card-content">
            <div className="speed-value">38 km/h</div>
            <div className="speed-status">Last 24 hours</div>
          </div>
        </div>
      </div>
      <div className="analytics-placeholder">
        <div className="placeholder-content">
          <span className="placeholder-icon">📊</span>
          <h3>Graph Placeholder</h3>
          <p>Speed chart will be displayed here</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
