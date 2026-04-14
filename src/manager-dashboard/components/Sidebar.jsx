import { useLanguage } from '../../i18n/LanguageContext'

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const { t } = useLanguage()

  const tabs = [
    { id: 'map',    label: t('liveMap'),     icon: '🗺️' },
    { id: 'buses',  label: t('busList'),     icon: '🚍' },
    { id: 'merge',  label: t('mergeRoutes'), icon: '🔀' },
    { id: 'staff',  label: t('busStaff'),    icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'info',   label: t('managerInfo'), icon: '👤' },
  ]

  return (
    <aside className="mgr-sidebar">
      <div className="mgr-sidebar-brand">🚌 TransportMgr</div>
      <div className="mgr-sidebar-subtitle">Control Center</div>

      <div className="mgr-nav-section">{t('dashboard')}</div>

      <nav>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`mgr-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mgr-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <button className="mgr-nav-btn mgr-logout-btn" onClick={onLogout}>
        <span className="mgr-icon">🚪</span>
        {t('logout')}
      </button>
    </aside>
  )
}

