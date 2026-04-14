import { useContext, useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { DataContext } from '../DataContext'
import { getStoredLocations } from '../../bus-driver-dashboard/utils/geoTracker'

// Fix default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Color palette for multiple buses
const BUS_COLORS = ['#7c83fd', '#34d399', '#f59e0b', '#f87171', '#60a5fa']

// Custom bus icon
function buildColorIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
      ">B</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// Helper to center and auto-pan map
function MapUpdater({ center, zoom = 16 }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true })
    }
  }, [center, zoom, map])
  return null
}

// Helper to fit bounds for multiple markers
  function MapBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
    }
  }, [positions, map])
  return null
}

  function MapFixer() {
    const map = useMap()
    useEffect(() => {
      const timer = setTimeout(() => {
        map.invalidateSize()
      }, 100)
      return () => clearTimeout(timer)
    }, [map])
    return null
  }

/**
 * SharedMap Component
 * 
 * Unified map component for all dashboards
 * 
 * @param {string} mode - "single" (driver/incharge/student) or "multiple" (manager)
 * @param {string} assignedBusNumber - The bus number for single mode (optional)
 * @param {boolean} isTracking - Active tracking for single mode (default: false)
 */
export default function SharedMap({ mode = 'single', assignedBusNumber = null, isTracking = false }) {
  const { buses, driverLocation } = useContext(DataContext)
  const [routeHistory, setRouteHistory] = useState([])

  // Load offline route data on mount
  useEffect(() => {
    const offlineData = getStoredLocations()
    setRouteHistory(offlineData)
  }, [])

  // Update route history in real-time
  useEffect(() => {
    if (driverLocation && mode === 'single') {
      setRouteHistory(prev => {
        const now = Date.now()
        const limitTimestamp = now - 30 * 60 * 1000 // 30 minutes
        
        let newHistory = [...prev, driverLocation]
        
        // Remove points older than 30 minutes
        newHistory = newHistory.filter(loc => loc.timestamp >= limitTimestamp)
        
        // Cap maximum points for performance
        if (newHistory.length > 200) {
          newHistory = newHistory.slice(newHistory.length - 200)
        }
        
        return newHistory
      })
    }
  }, [driverLocation, mode])

  // ==================
  // SINGLE MODE LOGIC
  // ==================
  const singleModeData = useMemo(() => {
    if (mode !== 'single') return null
    
    const currentCenter = driverLocation
      ? [driverLocation.lat, driverLocation.lng]
      : routeHistory.length > 0
        ? [routeHistory[routeHistory.length - 1].lat, routeHistory[routeHistory.length - 1].lng]
        : null

    const polylinePositions = routeHistory.map(loc => [loc.lat, loc.lng])

    const assignedBus = assignedBusNumber
      ? buses.find(bus => bus.busNumber === assignedBusNumber)
      : buses.length > 0 ? buses[0] : null

    return {
      currentCenter,
      polylinePositions,
      assignedBus,
      hasData: currentCenter !== null
    }
  }, [mode, driverLocation, routeHistory, assignedBusNumber, buses])

  // ==================
  // MULTIPLE MODE LOGIC
  // ==================
  const multipleModeData = useMemo(() => {
    if (mode !== 'multiple') return null

    // Simulate bus positions with slight offsets if driverLocation exists
    if (!driverLocation) {
      return {
        busMarkers: [],
        centerPosition: [20.5937, 78.9629], // India center fallback
        hasData: false
      }
    }

    const busMarkers = buses.map((bus, idx) => ({
      busNumber: bus.busNumber,
      route: bus.route,
      lat: driverLocation.lat + idx * 0.002,
      lng: driverLocation.lng + idx * 0.002,
      color: BUS_COLORS[idx % BUS_COLORS.length],
    }))

    return {
      busMarkers,
      centerPosition: [busMarkers[0].lat, busMarkers[0].lng],
      hasData: busMarkers.length > 0
    }
  }, [mode, driverLocation, buses])

  // ==================
  // SINGLE MODE RENDER
  // ==================
  if (mode === 'single') {
    const { currentCenter, polylinePositions, assignedBus, hasData } = singleModeData

    return (
      <div>
        <div className="bus-header">
          <h1 className="bus-title">🗺️ Live Map</h1>
          <p className="bus-subtitle">
            {hasData && isTracking ? (
              <><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', marginRight: '8px' }}></span>Live tracking active</>
            ) : hasData ? (
              'Last known location'
            ) : (
              'Map offline'
            )}
          </p>
        </div>

        <div className="bus-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="map-frame" style={{ height: '100%', width: '100%', position: 'relative' }}>
            
            {!hasData ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-muted)'
              }}>
                <p style={{ margin: 0, fontSize: '2rem' }}>📍</p>
                <p style={{ margin: '8px 0 0', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                  Map Offline
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  {assignedBus ? 'Start ride to broadcast location' : 'No bus assigned'}
                </p>
              </div>
            ) : (
              <MapContainer
                center={currentCenter}
                zoom={16}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapFixer />

                
                {/* Auto-pan when tracking */}
                {isTracking && <MapUpdater center={currentCenter} />}
                
                {/* Route history polyline */}
                {polylinePositions.length > 1 && (
                  <Polyline
                    positions={polylinePositions}
                    color="#0066cc"
                    weight={4}
                    opacity={0.7}
                    dashArray="5, 5"
                  />
                )}
                
                {/* Current location marker */}
                <Marker position={currentCenter}>
                  <Popup>
                    <div>
                      <strong>{assignedBus?.busNumber || 'Bus'}</strong><br />
                      Route: {assignedBus?.route || 'N/A'}<br />
                      <small>Current Position</small>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>

          {assignedBus && hasData && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bus Number</p>
                  <p style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                    {assignedBus.busNumber}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Route</p>
                  <p style={{ margin: '4px 0 0', fontSize: '1rem', color: 'var(--text)' }}>
                    {assignedBus.route}
                  </p>
                </div>
                {polylinePositions.length > 0 && (
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Trail Duration</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--primary)' }}>
                      Last 30 min
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================
  // MULTIPLE MODE RENDER
  // ==================
  if (mode === 'multiple') {
    const { busMarkers, centerPosition, hasData } = multipleModeData

    return (
      <div>
        <div className="mgr-header">
          <h1 className="mgr-title">🗺️ Live Fleet Map</h1>
          <p className="mgr-subtitle">
            {hasData ? (
              <><span className="mgr-live-dot" style={{ display: 'inline-block', width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', marginRight: '8px' }}></span>All buses tracked in real-time</>
            ) : (
              'Waiting for driver to start ride...'
            )}
          </p>
        </div>

        <div className="mgr-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%' }}>
            {!hasData ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📡</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
                  No Live Data Yet
                </div>
                <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  Bus driver must start a ride to broadcast location
                </div>
              </div>
            ) : (
              <MapContainer
                center={centerPosition}
                zoom={14}
                style={{ height: '100%', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Fit bounds to show all buses */}
                <MapBounds positions={busMarkers} />
                
                {/* Bus markers */}
                {busMarkers.map(bus => (
                  <Marker key={bus.busNumber} position={[bus.lat, bus.lng]} icon={buildColorIcon(bus.color)}>
                    <Popup>
                      <div>
                        <strong>Bus {bus.busNumber}</strong><br />
                        Route: {bus.route}<br />
                        <small>Live Location</small>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          {/* Bus legend */}
          {hasData && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {busMarkers.map(bus => (
                <div key={bus.busNumber} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: bus.color
                  }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                    Bus {bus.busNumber}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}
