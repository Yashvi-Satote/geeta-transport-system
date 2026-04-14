import { useLanguage } from '../i18n/LanguageContext'
import './sidebar.css'

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const { t } = useLanguage()

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: '🗺️' },
    { id: 'analytics', label: t('speedAnalytics'), icon: '📊' },
    { id: 'information', label: t('information'), icon: '👤' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Geeta Transport</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-item logout" onClick={onLogout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">{t('logout')}</span>
        </button>
      </div>
    </aside>
  )
}
