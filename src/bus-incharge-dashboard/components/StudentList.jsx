import { useState } from 'react'

export default function StudentList({ students, buses }) {
  const [selectedBus, setSelectedBus] = useState(buses[0]?.busNumber || '')

  const filteredStudents = students.filter(s => s.busNumber === selectedBus)

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Student List</h1>
        <p className="bus-subtitle">View and manage students assigned to buses</p>
      </div>
      <div className="bus-card">
        <h3 style={{ margin: '0 0 16px' }}>Filter by Bus</h3>
        <select 
          className="bus-select"
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
        >
          {buses.map(bus => (
            <option key={bus.busNumber} value={bus.busNumber}>Bus {bus.busNumber}</option>
          ))}
        </select>
      </div>

      <div className="bus-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredStudents.length > 0 ? (
          <div>
            {filteredStudents.map(student => (
              <div key={student.id} className="student-list-item">
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{student.name}</strong>
                  <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.9rem' }}>Bus Stop: {student.stop}</span>
                </div>
                <div style={{ background: 'rgba(0,123,255,0.1)', color: '#007bff', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
                  Bus {student.busNumber}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(0,0,0,0.5)' }}>
            No students found for this bus.
          </div>
        )}
      </div>
    </div>
  )
}
