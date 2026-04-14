export default function SpeedAnalytics() {
  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Speed Analytics</h1>
        <p className="bus-subtitle">Track and monitor fleet speeds in real-time</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="bus-card" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: '0 0 8px' }}>Current Speed</h3>
          <div className="speed-metric">45 km/h</div>
          <p style={{ margin: '8px 0 0', color: 'rgba(0,0,0,0.5)' }}>Safe operating speed</p>
        </div>
        <div className="bus-card" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: '0 0 8px' }}>Average Speed</h3>
          <div className="speed-metric">38 km/h</div>
          <p style={{ margin: '8px 0 0', color: 'rgba(0,0,0,0.5)' }}>Over the last 7 days</p>
        </div>
      </div>
      <div className="bus-card">
        <h3 style={{ margin: '0 0 16px' }}>Speed History Chart</h3>
        <div style={{ height: '300px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(0,0,0,0.1)' }}>
          <p style={{ color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>[ Chart.js Line Graph Placeholder ]</p>
        </div>
      </div>
    </div>
  )
}
