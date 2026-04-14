import { useState, useContext } from 'react'
import { DataContext } from '../../shared/DataContext'

export default function AttendanceView() {
  const { buses, students } = useContext(DataContext)
  const [selectedBus, setSelectedBus] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const filteredStudents = selectedBus
    ? students.filter((student) => student.busNumber === selectedBus)
    : students

  const attendanceData = filteredStudents.map(student => {
    const attendance = student.attendance?.find(a => a.date === selectedDate)
    return {
      ...student,
      isPresent: attendance ? attendance.isPresent : null // null means not marked
    }
  })

  const presentCount = attendanceData.filter(s => s.isPresent === true).length
  const absentCount = attendanceData.filter(s => s.isPresent === false).length
  const unmarkedCount = attendanceData.filter(s => s.isPresent === null).length

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">Attendance Overview</h1>
        <p className="mgr-subtitle">Monitor student attendance across all buses</p>
      </div>

      <div className="mgr-card">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Select Bus</label>
            <select
              className="mgr-select"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
            >
              <option value="">All Buses</option>
              {buses.map(bus => (
                <option key={bus.busNumber} value={bus.busNumber}>Bus {bus.busNumber}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mgr-input"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div className="mgr-stat-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>{filteredStudents.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Students</div>
          </div>
          <div className="mgr-stat-card" style={{ background: 'rgba(0, 123, 255, 0.1)', border: '1px solid rgba(0, 123, 255, 0.2)', borderRadius: '12px', padding: '16px', flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{presentCount}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Present</div>
          </div>
          <div className="mgr-stat-card" style={{ background: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)', borderRadius: '12px', padding: '16px', flex: 1 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc3545' }}>{absentCount}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Absent</div>
          </div>
          {unmarkedCount > 0 && (
            <div className="mgr-stat-card" style={{ background: 'rgba(108, 117, 125, 0.1)', border: '1px solid rgba(108, 117, 125, 0.2)', borderRadius: '12px', padding: '16px', flex: 1 }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-muted)' }}>{unmarkedCount}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not Marked</div>
            </div>
          )}
        </div>
      </div>

      <div className="mgr-card">
        <h3 style={{ margin: '0 0 20px' }}>Student Attendance</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {attendanceData.map(student => (
            <div key={student.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: student.isPresent === true ? 'rgba(0, 123, 255, 0.05)' :
                         student.isPresent === false ? 'rgba(220, 53, 69, 0.05)' : 'var(--bg-card)'
            }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px' }}>{student.name}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Bus {student.busNumber} • Stop: {student.stop}
                </span>
              </div>
              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                background: student.isPresent === true ? 'var(--primary)' :
                           student.isPresent === false ? '#dc3545' : 'var(--text-muted)',
                color: 'white'
              }}>
                {student.isPresent === true ? 'Present' :
                 student.isPresent === false ? 'Absent' : 'Not Marked'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}