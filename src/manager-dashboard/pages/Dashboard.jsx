import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import LiveMap from '../components/LiveMap'
import BusList from '../components/BusList'
import MergeRoutes from '../components/MergeRoutes'
import BusStaff from '../components/BusStaff'
import AttendanceView from '../components/AttendanceView'
import ManagerInfo from '../components/ManagerInfo'
import '../styles/dashboard.css'

export default function ManagerDashboard({ onLogout, userDetails }) {
  const [activeTab, setActiveTab] = useState('map')

  const renderContent = () => {
    switch (activeTab) {
      case 'map':   return <LiveMap />
      case 'buses': return <BusList />
      case 'merge': return <MergeRoutes />
      case 'staff': return <BusStaff />
      case 'attendance': return <AttendanceView />
      case 'info':  return <ManagerInfo userDetails={userDetails} />
      default:      return <LiveMap />
    }
  }

  return (
    <div className="manager-page">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <main className="mgr-main">
        <div className="mgr-container">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
