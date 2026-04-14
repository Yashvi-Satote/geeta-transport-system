import { useState, useEffect } from 'react'

import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import SpeedAnalytics from '../components/SpeedAnalytics'
import BusInfo from '../components/BusInfo'
import StudentList from '../components/StudentList'
import MarkAttendance from '../components/MarkAttendance'
import MergeBus from '../components/MergeBus'
import RegistrationUpload from '../components/RegistrationUpload'

import '../styles/dashboard.css'

export default function BusInchargeDashboard({ onLogout, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('map')

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const renderContent = () => {
    switch(activeTab) {
      case 'map':
        return <MapView />
      case 'speed':
        return <SpeedAnalytics />
      case 'busInfo':
        return <BusInfo />
      case 'students':
        return <StudentList />
      case 'attendance':
        return <MarkAttendance />
      case 'merge':
        return <MergeBus />
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
