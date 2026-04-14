import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import MapView from './MapView.jsx'
import Information from './Information.jsx'
import Analytics from './Analytics.jsx'
import './dashboard.css'

const DEFAULT_CENTER = [29.3909, 76.9655]
const DEFAULT_STOP = [29.3916, 76.9662]
const DEFAULT_BUS = [29.3950, 76.9700]

function Dashboard({ onLogout, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isTracking, setIsTracking] = useState(false)
  const [busPosition, setBusPosition] = useState(DEFAULT_BUS)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    setUserDetails(storedUser)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode)
    return () => {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (!isTracking) return undefined

    const animation = setInterval(() => {
      setBusPosition((current) => ({
        lat: current.lat + 0.00008,
        lng: current.lng + 0.00012,
      }))
    }, 1200)

    return () => clearInterval(animation)
  }, [isTracking])

  const handleLogout = () => {
    localStorage.removeItem('user')
    onLogout()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="map-header">
              <div>
                <p className="map-title">Live route overview</p>
                <p className="map-text">This view shows the current bus position and nearest stop.</p>
              </div>
            </div>
            <div className="map-frame">
              <MapView center={DEFAULT_CENTER} busPosition={busPosition} stopPosition={DEFAULT_STOP} />
            </div>
          </div>
        )
      case 'analytics':
        return <Analytics />
      case 'information':
        return <Information userDetails={userDetails} />
      default:
        return null
    }
  }

  return (
    <div className="dashboard-page">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}

export default Dashboard
