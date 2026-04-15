import { useState, useEffect, useRef, useContext } from 'react'
import { calculateSpeed, saveToLocalStorage, syncStoredDataToServer, clearStoredLocations } from '../utils/geoTracker'
import SharedMap from '../../shared/components/SharedMap'
import { DataContext } from '../../shared/DataContext'

export default function StartRide() {
  const [isTracking, setIsTracking] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(null)
  
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const { updateLocation, updateSpeed } = useContext(DataContext)
  const watchIdRef = useRef(null)
  const prevLocationRef = useRef(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Synchronization effect
  useEffect(() => {
    if (isOnline && !isSyncing) {
      const sync = async () => {
        setIsSyncing(true)
        try {
          const success = await syncStoredDataToServer()
          if (success) {
            clearStoredLocations()
          }
        } catch (error) {
          console.error("Sync failed:", error)
        } finally {
          setIsSyncing(false)
        }
      }
      sync()
    }
  }, [isOnline])

  const handleToggleRide = () => {
    if (isTracking) {
      // Stop tracking
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      setIsTracking(false)
      setSpeed(0)
      updateSpeed(0)
      setCurrentLocation(null)
      prevLocationRef.current = null
    } else {
      // Start tracking
      if (!navigatortoGeolocationExists()) {
        alert("Geolocation is not supported by your browser.")
        return
      }

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp || Date.now()
          }

          setCurrentLocation(newLoc)
          saveToLocalStorage(newLoc)
          updateLocation(newLoc)   // push to global context → Manager LiveMap

          if (prevLocationRef.current) {
            const currentSpeed = calculateSpeed(prevLocationRef.current, newLoc)
            setSpeed(currentSpeed)
            updateSpeed(currentSpeed)
          } else {
            updateSpeed(0)
          }

          prevLocationRef.current = newLoc
        },
        (error) => {
          console.error("Error watching location: ", error)
          alert("Unable to access location. Please check your permissions.")
          // if denied, stop tracking
          setIsTracking(false)
          if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        }
      )

      watchIdRef.current = id
      setIsTracking(true)
    }
  }

  const navigatortoGeolocationExists = () => {
    return 'geolocation' in navigator
  }

  const isMoving = speed > 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {/* Controls Overlay */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        zIndex: 1100, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        width: '300px',
        pointerEvents: 'none'
      }}>
        {/* Driver Stats */}
        <div style={{ 
          background: 'var(--bg-surface)', 
          padding: '20px', 
          borderRadius: '16px', 
          boxShadow: 'var(--shadow)', 
          border: '1px solid var(--border)',
          pointerEvents: 'auto'
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Speed Telemetry</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>{speed.toFixed(1)}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>km/h</span>
          </div>
          <div style={{ 
            marginTop: '12px',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            textAlign: 'center',
            background: isTracking ? (isMoving ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)') : 'rgba(0,0,0,0.05)',
            color: isTracking ? (isMoving ? '#00cc00' : '#ff9900') : 'var(--text-muted)',
            border: '1px solid currentColor'
          }}>
            {isTracking ? (isMoving ? '• TRACKING ACTIVE' : '• IDLE (ACTIVE)') : '• READY TO START'}
          </div>

          <div style={{ 
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: isOnline ? '#22c55e' : '#ef4444'
          }}>
            <span style={{ fontSize: '1rem' }}>{isOnline ? '🌐' : '🚫'}</span>
            {isOnline ? (isSyncing ? 'Synchronizing Data...' : 'Connected (Live)') : 'Offline Mode (Local Storage)'}
          </div>
        </div>

        {/* Action Toggle */}
        <div style={{ pointerEvents: 'auto' }}>
          <button 
            className={`driver-button ${isTracking ? 'active' : ''}`}
            onClick={handleToggleRide}
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '1.1rem', 
              fontWeight: 700,
              borderRadius: '16px',
              boxShadow: 'var(--shadow)',
              height: 'auto'
            }}
          >
            {isTracking ? "⏹ Stop Ride" : "▶ Start Ride"}
          </button>
        </div>
      </div>

      {/* Map filling all space */}
      <div style={{ flex: 1, width: '100%' }}>
        <SharedMap mode="single" isTracking={isTracking} />
      </div>
    </div>
  )
}
