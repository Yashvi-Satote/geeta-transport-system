import { useState, useEffect } from 'react'

import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import SpeedAnalytics from '../components/SpeedAnalytics'
import BusInfo from '../components/BusInfo'
import StudentList from '../components/StudentList'
import MergeBus from '../components/MergeBus'
import RegistrationUpload from '../components/RegistrationUpload'

import { initialData } from '../data/dummyData'
import '../styles/dashboard.css'

export default function BusInchargeDashboard({ onLogout, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('map')
  const [buses, setBuses] = useState(initialData.buses)
  const [students, setStudents] = useState(initialData.students)

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const handleMerge = (sourceBusNumber, targetBusNumber, stop, type) => {
    // In a real application, you'd send this to the backend
    // Here we update our dummy state
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.busNumber === sourceBusNumber && student.stop === stop) {
          return { ...student, busNumber: targetBusNumber }
        }
        return student
      })
    )
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'map':
        return <MapView />
      case 'speed':
        return <SpeedAnalytics />
      case 'busInfo':
        return <BusInfo buses={buses} />
      case 'students':
        return <StudentList students={students} buses={buses} />
      case 'merge':
        return <MergeBus buses={buses} students={students} onMerge={handleMerge} />
      case 'upload':
        return <RegistrationUpload />
      default:
        return <MapView />
    }
  }

  return (
    <div className="bus-incharge-page">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="bus-main-content">
        <div className="bus-container">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
