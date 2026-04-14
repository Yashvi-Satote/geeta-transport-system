import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../shared/DataContext'

export default function MarkAttendance() {
  const { buses, students, updateAttendance } = useContext(DataContext)
  const [selectedBus, setSelectedBus] = useState('')
  const [attendance, setAttendance] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (buses.length > 0 && !selectedBus) {
      setSelectedBus(buses[0].busNumber)
    }
  }, [buses, selectedBus])

  useEffect(() => {
    // Reset attendance when bus changes
    if (selectedBus) {
      const busStudents = students.filter(s => s.busNumber === selectedBus)
      const initialAttendance = {}
      busStudents.forEach(student => {
        // Check if student already has attendance for today
        const today = new Date().toISOString().split('T')[0]
        const existingAttendance = student.attendance?.find(a => a.date === today)
        initialAttendance[student.id] = existingAttendance ? existingAttendance.isPresent : false
      })
      setAttendance(initialAttendance)
      setSaved(false)
    }
  }, [selectedBus, students])

  const filteredStudents = students.filter(s => s.busNumber === selectedBus)

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }))
    setSaved(false)
  }

  const markAllPresent = () => {
    const newAttendance = {}
    filteredStudents.forEach(student => {
      newAttendance[student.id] = true
    })
    setAttendance(newAttendance)
    setSaved(false)
  }

  const markAllAbsent = () => {
    const newAttendance = {}
    filteredStudents.forEach(student => {
      newAttendance[student.id] = false
    })
    setAttendance(newAttendance)
    setSaved(false)
  }

  const saveAttendance = () => {
    updateAttendance(selectedBus, attendance)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = Object.values(attendance).length - presentCount

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Mark Attendance</h1>
        <p className="bus-subtitle">Mark daily attendance for students on selected bus</p>
      </div>

      <div className="bus-card">
        <h3 style={{ margin: '0 0 16px' }}>Select Bus</h3>
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

      {selectedBus && (
        <>
          <div className="bus-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Attendance Summary</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem' }}>
                <span>Total: {filteredStudents.length}</span>
                <span style={{ color: 'var(--primary)' }}>Present: {presentCount}</span>
                <span style={{ color: '#dc3545' }}>Absent: {absentCount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button className="bus-btn" onClick={markAllPresent} style={{ background: 'var(--primary)' }}>
                Mark All Present
              </button>
              <button className="bus-btn" onClick={markAllAbsent} style={{ background: '#dc3545' }}>
                Mark All Absent
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredStudents.map(student => (
                <div key={student.id} className="attendance-item" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: attendance[student.id] ? 'rgba(0, 123, 255, 0.05)' : 'var(--bg-card)'
                }}>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>{student.name}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bus Stop: {student.stop}</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={attendance[student.id] || false}
                      onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>
                      {attendance[student.id] ? 'Present' : 'Absent'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bus-card">
            <button
              className="bus-btn"
              onClick={saveAttendance}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            >
              {saved ? '✓ Attendance Saved!' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}