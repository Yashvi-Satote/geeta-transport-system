import { useState, useContext } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useLanguage } from '../../i18n/LanguageContext'
import { DataContext } from '../../shared/DataContext'

// Reusing Sidebar and shared dashboard components
import Sidebar from '../../bus-incharge-dashboard/components/Sidebar'
import MergeBus from '../../bus-incharge-dashboard/components/MergeBus'
import '../styles/dashboard.css'
import '../../bus-incharge-dashboard/styles/dashboard.css'
import StartRide from '../components/StartRide'

function DriverAttendanceView({ assignedBusNumber }) {
  const { students } = useContext(DataContext)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const filteredStudents = assignedBusNumber
    ? students.filter((student) => student.busNumber === assignedBusNumber)
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
      <div className="bus-header">
        <h1 className="bus-title">Attendance View</h1>
        <p className="bus-subtitle">View attendance records for your assigned bus.</p>
      </div>

      <div className="bus-card">
        <h3 style={{ margin: '0 0 16px' }}>Select Date</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bus-input"
          style={{ maxWidth: '200px' }}
        />
      </div>

      <div className="bus-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Attendance Summary</h3>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem' }}>
            <span>Total: {filteredStudents.length}</span>
            <span style={{ color: 'var(--primary)' }}>Present: {presentCount}</span>
            <span style={{ color: '#dc3545' }}>Absent: {absentCount}</span>
            {unmarkedCount > 0 && <span style={{ color: 'var(--text-muted)' }}>Unmarked: {unmarkedCount}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {attendanceData.map(student => (
            <div key={student.id} className="attendance-item" style={{
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
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bus Stop: {student.stop}</span>
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

function DriverBusInfo({ assignedBusNumber }) {
  const { buses } = useContext(DataContext)
  const bus = buses.find((bus) => bus.busNumber === assignedBusNumber)

  if (!bus) {
    return (
      <div className="bus-card">
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
          No bus assigned or no shared bus data is available.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Bus Information</h1>
        <p className="bus-subtitle">Shared route data for your assigned bus.</p>
      </div>
      <div className="bus-card">
        <h2 style={{ margin: '0 0 16px', color: 'var(--secondary)' }}>Bus Number: {bus.busNumber}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div><strong>Route:</strong> {bus.route}</div>
          <div>
            <strong>Stops:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: '24px' }}>
              {bus.stops.map((stop, index) => (
                <li key={index}>{stop}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function DriverStudentList({ assignedBusNumber }) {
  const { students } = useContext(DataContext)
  const filteredStudents = assignedBusNumber
    ? students.filter((student) => student.busNumber === assignedBusNumber)
    : students

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Student List</h1>
        <p className="bus-subtitle">Shared student assignments for your assigned bus.</p>
      </div>

      <div className="bus-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="student-list-item">
              <div>
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>{student.name}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bus Stop: {student.stop}</span>
              </div>
              <div style={{ background: 'rgba(0, 123, 255, 0.1)', color: 'var(--secondary)', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' }}>
                Bus {student.busNumber}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No students are assigned to your bus yet.
          </div>
        )}
      </div>
    </div>
  )
}

function Placeholder({ title }) {
  return (
    <div className="driver-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-muted)', margin: 0 }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>
        Shared data is managed in the global DataContext.
      </p>
    </div>
  )
}

export default function BusDriverDashboard({ onLogout }) {
  const { t } = useLanguage()
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('map')
  const assignedBusNumber = currentUser?.busNumber || ''

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <StartRide />
      case 'speed':
        return <DriverSpeedAnalytics assignedBusNumber={assignedBusNumber} />
      case 'busInfo':
        return <DriverBusInfo assignedBusNumber={assignedBusNumber} />
      case 'students':
        return <DriverStudentList assignedBusNumber={assignedBusNumber} />
      case 'attendance':
        return <DriverAttendanceView assignedBusNumber={assignedBusNumber} />
      case 'merge':
        return <MergeBus />
      case 'upload':
        return <Placeholder title={t('registrationUpload')} />
      default:
        return <StartRide />
    }
  }

  return (
    <div className="driver-page bus-incharge-page">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="driver-main bus-main-content">
        <div className="driver-content-wrapper bus-container">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
