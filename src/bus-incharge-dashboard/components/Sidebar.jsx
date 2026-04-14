import { useLanguage } from '../../i18n/LanguageContext'

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const { t } = useLanguage()

  const tabs = [
    { id: 'map',     label: t('liveMap')             },
    { id: 'speed',   label: t('speedAnalytics')      },
    { id: 'busInfo', label: t('busInformation')      },
    { id: 'students',label: t('studentList')         },
    { id: 'attendance', label: 'Mark Attendance'     },
    { id: 'merge',   label: t('mergeBus')            },
    { id: 'upload',  label: t('registrationUpload')  },
  ]

  return (
    <aside className="bus-sidebar">
      <div className="bus-sidebar-logo">Bus Incharge</div>
      <nav>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bus-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button className="bus-nav-button logout" onClick={onLogout}>
        {t('logout')}
      </button>
    </aside>
  )
}

