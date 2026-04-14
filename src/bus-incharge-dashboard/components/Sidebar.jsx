export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const tabs = [
    { id: 'map', label: 'Dashboard (Map view)' },
    { id: 'speed', label: 'Speed Analytics' },
    { id: 'busInfo', label: 'Bus Information' },
    { id: 'students', label: 'Student List' },
    { id: 'merge', label: 'Merge Bus' },
    { id: 'upload', label: 'Registration Upload' },
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
        Logout
      </button>
    </aside>
  )
}
