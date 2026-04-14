export default function MapView() {
  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Live Route Overview</h1>
        <p className="bus-subtitle">Current map view of assigned buses</p>
      </div>
      <div className="bus-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="map-frame">
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0 }}>📍 Interactive Map Placeholder</p>
            <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.5)', marginTop: '8px' }}>Google Maps or Leaflet renders here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
