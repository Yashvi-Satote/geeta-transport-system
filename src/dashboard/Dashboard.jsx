import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import Sidebar from './Sidebar.jsx'
import MapView from './MapView.jsx'
import Information from './Information.jsx'
import Analytics from './Analytics.jsx'
import './dashboard.css'

function Dashboard({ onLogout, userDetails = {} }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('dashboard')

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
              <MapView />
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
