export default function BusInfo({ buses }) {
  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Bus Information</h1>
        <p className="bus-subtitle">Details about active bus routes and capacity</p>
      </div>
      {buses.map((bus) => (
        <div key={bus.busNumber} className="bus-card">
          <h2 style={{ margin: '0 0 16px', color: '#007bff' }}>Bus Number: {bus.busNumber}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Route Component:</strong> {bus.route}</div>
            <div>
              <strong>Stops List:</strong> 
              <ul style={{ margin: '8px 0 0', paddingLeft: '24px' }}>
                {bus.stops.map((stop, i) => (
                  <li key={i}>{stop}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
