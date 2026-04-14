export default function ManagerInfo({ userDetails }) {
  const fields = [
    { key: 'Full Name',    val: userDetails?.name    || 'N/A' },
    { key: 'Role',         val: 'Manager'                     },
    { key: 'Bus Number',   val: userDetails?.busNumber || 'N/A' },
    { key: 'Route',        val: userDetails?.routeName || 'N/A' },
    { key: 'Bus Stop',     val: userDetails?.busStop   || 'N/A' },
    { key: 'Access Level', val: 'Full System Access'           },
  ]

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">👤 Manager Info</h1>
        <p className="mgr-subtitle">Your profile and system access details</p>
      </div>

      {/* Avatar section */}
      <div className="mgr-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c83fd, #6a55f8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', flexShrink: 0,
        }}>
          👤
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8eaf6', marginBottom: '6px' }}>
            {userDetails?.name || 'Manager'}
          </div>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c83fd, #6a55f8)',
            color: '#fff', fontSize: '0.85rem', fontWeight: 700,
            borderRadius: '100px', padding: '4px 14px',
          }}>
            System Manager
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="mgr-info-grid">
        {fields.map(f => (
          <div key={f.key} className="mgr-info-field">
            <div className="mgr-info-key">{f.key}</div>
            <div className="mgr-info-val">{f.val}</div>
          </div>
        ))}
      </div>

      {/* System stats */}
      <div className="mgr-card" style={{ marginTop: '8px' }}>
        <div className="mgr-card-title">System Status</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Dashboards', val: '3', color: '#7c83fd' },
            { label: 'Active Buses', val: '2',  color: '#34d399' },
            { label: 'Context API', val: '✓ Live', color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, minWidth: 120, background: '#1a1e28', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.val}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
