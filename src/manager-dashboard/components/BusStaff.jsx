import { useContext } from 'react'
import { DataContext } from '../../shared/DataContext'

// Dummy staff names per bus (in a real system these come from auth/signup)
const STAFF_DATA = {
  '101': { driver: 'Ramesh Kumar',   incharge: 'Sunita Sharma' },
  '202': { driver: 'Ajay Patil',     incharge: 'Meena Joshi'  },
}

export default function BusStaff() {
  const { buses, students } = useContext(DataContext)

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">👥 Bus Staff</h1>
        <p className="mgr-subtitle">Drivers, Incharges and student counts per bus</p>
      </div>

      <div className="mgr-staff-grid">
        {buses.map(bus => {
          const staff        = STAFF_DATA[bus.busNumber] || { driver: 'N/A', incharge: 'N/A' }
          const totalStudents = students.filter(s => s.busNumber === bus.busNumber).length

          return (
            <div key={bus.busNumber} className="mgr-staff-card">
              <div className="mgr-staff-bus-badge">Bus {bus.busNumber}</div>

              <div className="mgr-staff-row">
                <span className="mgr-staff-label">🛣️ Route</span>
                <span className="mgr-staff-value" style={{ maxWidth: '55%', textAlign: 'right', fontSize: '0.85rem' }}>
                  {bus.route}
                </span>
              </div>
              <div className="mgr-staff-row">
                <span className="mgr-staff-label">🚗 Driver</span>
                <span className="mgr-staff-value">{staff.driver}</span>
              </div>
              <div className="mgr-staff-row">
                <span className="mgr-staff-label">📋 Incharge</span>
                <span className="mgr-staff-value">{staff.incharge}</span>
              </div>
              <div className="mgr-staff-row">
                <span className="mgr-staff-label">🎒 Students Today</span>
                <span className="mgr-staff-value" style={{ color: '#7c83fd' }}>{totalStudents}</span>
              </div>
              <div className="mgr-staff-row">
                <span className="mgr-staff-label">🚏 Stops</span>
                <span className="mgr-staff-value">{bus.stops.length} stops</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
