import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import Sidebar from './Sidebar.jsx'
import MapView from './MapView.jsx'
import Information from './Information.jsx'
import Analytics from './Analytics.jsx'
import './dashboard.css'

const DEFAULT_CENTER = [29.3909, 76.9655]
const DEFAULT_STOP = [29.3916, 76.9662]
const DEFAULT_BUS = [29.3950, 76.9700]

function Dashboard({ onLogout, userDetails = {} }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isTracking, setIsTracking] = useState(false)
  const [busPosition, setBusPosition] = useState(DEFAULT_BUS)

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
    onLogout()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="map-header">
              <div>
                <p className="map-title">{t('liveRouteOverview')}</p>
                <p className="map-text">{t('mapDescription')}</p>
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
