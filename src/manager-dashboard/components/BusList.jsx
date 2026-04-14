import { useContext } from 'react'
import { DataContext } from '../../shared/DataContext'

export default function BusList() {
  const { buses, students } = useContext(DataContext)

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">🚍 Bus List</h1>
        <p className="mgr-subtitle">Route details and fleet overview</p>
      </div>

      {buses.map((bus, idx) => {
        const busStudents = students.filter(s => s.busNumber === bus.busNumber)
        // Simulated speed values (in real system these come from driver GPS)
        const simulatedSpeeds = [42, 36, 58, 29]
        const currentSpeed = simulatedSpeeds[idx % simulatedSpeeds.length]
        const avgSpeed     = Math.round(currentSpeed * 0.85)

        return (
          <div key={bus.busNumber} className="mgr-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              {/* Left: bus info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                  <span className="mgr-bus-number">Bus {bus.busNumber}</span>
                  <span style={{
                    background: 'rgba(52,211,153,0.15)',
                    color: '#34d399',
                    borderRadius: '100px',
                    padding: '4px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}>● Active</span>
                </div>
                <div className="mgr-bus-route">🛣️ {bus.route}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {bus.stops.map(stop => (
                    <span key={stop} style={{
                      background: 'rgba(124,131,253,0.12)',
                      color: '#7c83fd',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}>{stop}</span>
                  ))}
                </div>
              </div>

              {/* Right: speed metrics */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', background: '#1a1e28', borderRadius: '14px', padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Speed</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c83fd' }}>{currentSpeed}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>km/h</div>
                </div>
                <div style={{ textAlign: 'center', background: '#1a1e28', borderRadius: '14px', padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Avg Speed</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>{avgSpeed}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>km/h</div>
                </div>
                <div style={{ textAlign: 'center', background: '#1a1e28', borderRadius: '14px', padding: '16px 24px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Students</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>{busStudents.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>enrolled</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
