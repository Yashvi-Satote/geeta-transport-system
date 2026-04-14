import { useState, useEffect } from 'react'

// Reusing Sidebar from bus-incharge-dashboard
import Sidebar from '../../bus-incharge-dashboard/components/Sidebar'

// Importing Driver Specific components
import StartRide from '../components/StartRide'

// Placeholders for unused reused sidebar options
function Placeholder({ title }) {
  return (
    <div className="driver-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
      <h2 style={{ color: 'rgba(0,0,0,0.5)', margin: 0 }}>{title} Placeholder</h2>
      <p style={{ color: 'rgba(0,0,0,0.4)', marginTop: '12px' }}>
        This page relies on data managed by the Bus Incharge.
      </p>
    </div>
  )
}

import '../styles/dashboard.css'
// Need to also load incharge CSS for the sidebar layout
import '../../bus-incharge-dashboard/styles/dashboard.css'

export default function BusDriverDashboard({ onLogout, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('map') // "map" is default ID for Dashboard from Sidebar

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <StartRide />
      case 'speed':
        return <Placeholder title="Speed Analytics" />
      case 'busInfo':
        return <Placeholder title="Bus Information" />
      case 'students':
        return <Placeholder title="Student List" />
      case 'merge':
        return <Placeholder title="Merge Bus" />
      case 'upload':
        return <Placeholder title="Registration Upload" />
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
