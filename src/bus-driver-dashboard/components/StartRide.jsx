import { useState, useEffect, useRef, useContext } from 'react'
import { calculateSpeed, saveToLocalStorage } from '../utils/geoTracker'
import MapTracker from './MapTracker'
import { DataContext } from '../../shared/DataContext'

export default function StartRide() {
  const [isTracking, setIsTracking] = useState(false)
  const [speed, setSpeed] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(null)
  
  const { updateLocation, updateSpeed } = useContext(DataContext)
  const watchIdRef = useRef(null)
  const prevLocationRef = useRef(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="driver-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <h1 className="bus-title" style={{ marginBottom: '24px' }}>
          Bus Driver Controls
        </h1>
        
        <button 
          className={`driver-button ${isTracking ? 'active' : ''}`}
          onClick={handleToggleRide}
        >
          {isTracking ? "Stop Ride" : "Start Ride"}
        </button>
      </div>

      <div className="driver-card speed-display">
        <h3 style={{ margin: '0 0 16px', color: 'var(--text-muted)' }}>Current Speed</h3>
        <div className="speed-value">
          {speed.toFixed(1)} <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>km/h</span>
        </div>
        {isTracking ? (
          <div className={`speed-status ${!isMoving ? 'stopped' : ''}`}>
            {isMoving ? 'Moving' : 'Stopped'}
          </div>
        ) : (
          <div className="speed-status" style={{ color: 'var(--text-muted)' }}>
            Not Recording
          </div>
        )}
      </div>

      <MapTracker isTracking={isTracking} currentLocation={currentLocation} />
    </div>
  )
}
