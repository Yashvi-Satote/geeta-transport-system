import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getStoredLocations } from '../utils/geoTracker'

// Fix generic Leaflet icon missing issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center map on new location dynamically
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function MapFixer() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

export default function MapTracker({ isTracking, currentLocation }) {
  const [routeHistory, setRouteHistory] = useState([]);

  // Load offline data on start
  useEffect(() => {
    const offlineData = getStoredLocations();
    setRouteHistory(offlineData);
  }, []);

  // Update history in real-time
  useEffect(() => {
    if (currentLocation) {
      setRouteHistory(prev => {
        const now = Date.now();
        // 30 minutes limit
        const limitTimestamp = now - 30 * 60 * 1000;
        
        let newHistory = [...prev, currentLocation];
        
        // Remove points older than 30 mins
        newHistory = newHistory.filter(loc => loc.timestamp >= limitTimestamp);
        
        // Cap maximum points for performance
        if (newHistory.length > 200) {
          newHistory = newHistory.slice(newHistory.length - 200);
        }
        
        return newHistory;
      });
    }
  }, [currentLocation]);

  // Derive polyline points
  const polylinePositions = useMemo(() => {
    return routeHistory.map(loc => [loc.lat, loc.lng]);
  }, [routeHistory]);

  const currentCenter = currentLocation 
    ? [currentLocation.lat, currentLocation.lng] 
    : routeHistory.length > 0 
      ? [routeHistory[routeHistory.length-1].lat, routeHistory[routeHistory.length-1].lng]
      : [29.3909, 76.9690]; // Geeta University fallback

  return (
    <div className="driver-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="map-frame" style={{ height: '400px', width: '100%', position: 'relative' }}>
        <MapContainer 
          center={currentCenter} 
          zoom={16} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFixer />
          
          {/* Auto-pan map as current location updates */}
          {isTracking && <MapUpdater center={currentCenter} />}
          
          {/* Route history Polyline */}
          {polylinePositions.length > 1 && (
            <Polyline 
              positions={polylinePositions} 
              color="#0066cc" 
              weight={6} 
              opacity={0.8}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Current point marker */}
          <Marker position={currentCenter}>
            <Popup>
              {isTracking ? "Live Location" : "Last Known Location"}<br/>
              Lat: {currentCenter[0].toFixed(5)}, Lng: {currentCenter[1].toFixed(5)}
            </Popup>
          </Marker>

          {!isTracking && routeHistory.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              background: 'var(--bg-card)',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}>
              Map Offline - Start Ride to Track
            </div>
          )}
        </MapContainer>
      </div>
    </div>
  )
}
