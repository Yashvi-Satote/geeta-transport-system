import { useContext, useMemo, useEffect } from 'react'
import { DataContext } from '../../shared/DataContext'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Bus colors for different bus markers
const BUS_COLORS = ['#7c83fd', '#34d399', '#f59e0b', '#f87171', '#60a5fa']

function buildColorIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};
        width:16px;height:16px;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,0.5);
      "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function MapBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
    }
  }, [positions, map])
  return null
}

export default function LiveMap() {
  const { buses, driverLocation } = useContext(DataContext)

  // Build bus markers — one per bus  
  // In real system, each bus would have its own location.
  // Here, we simulate: Bus 101 shows the real driver location (if any),
  // Bus 202 gets a slight offset so both appear.
  const busPositions = useMemo(() => {
    if (!driverLocation) return []
    return buses.map((bus, idx) => ({
      busNumber: bus.busNumber,
      route: bus.route,
      lat: driverLocation.lat + idx * 0.002,
      lng: driverLocation.lng + idx * 0.002,
      color: BUS_COLORS[idx % BUS_COLORS.length],
    }))
  }, [buses, driverLocation])

  const defaultCenter = [20.5937, 78.9629] // India center fallback

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">🗺️ Live Fleet Map</h1>
        <p className="mgr-subtitle">
          {driverLocation ? (
            <><span className="mgr-live-dot" />All buses tracked in real-time</>
          ) : (
            'Waiting for driver to start ride...'
          )}
        </p>
      </div>

      <div className="mgr-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '520px', width: '100%' }}>
          {busPositions.length === 0 ? (
            <div style={{
              height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#1a1e28', color: 'rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Live Data Yet</div>
              <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                Bus driver must start a ride to broadcast location
              </div>
            </div>
          ) : (
            <MapContainer
              center={[busPositions[0].lat, busPositions[0].lng]}
              zoom={14}
              style={{ height: '100%', width: '100%', borderRadius: '18px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapBounds positions={busPositions} />
              {busPositions.map(bus => (
                <Marker
                  key={bus.busNumber}
                  position={[bus.lat, bus.lng]}
                  icon={buildColorIcon(bus.color)}
                >
                  <Popup>
                    <strong>Bus {bus.busNumber}</strong><br />
                    {bus.route}<br />
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>
                      {bus.lat.toFixed(5)}, {bus.lng.toFixed(5)}
                    </span>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Legend */}
      {busPositions.length > 0 && (
        <div className="mgr-card" style={{ padding: '18px 28px' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {busPositions.map(bus => (
              <div key={bus.busNumber} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: bus.color, border: '2px solid rgba(255,255,255,0.2)'
                }} />
                <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                  Bus {bus.busNumber}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
                  {bus.route}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
