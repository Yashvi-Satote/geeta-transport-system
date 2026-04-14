import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const DEFAULT_CENTER = [29.3909, 76.9655]
const DEFAULT_BUS = [29.3950, 76.9700]
const DEFAULT_STOP = [29.3916, 76.9662]

function MapView({ center = DEFAULT_CENTER, busPosition = DEFAULT_BUS, stopPosition = DEFAULT_STOP }) {
  return (
    <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center}>
        <Popup>Geeta University, Naultha</Popup>
      </Marker>
      <Marker position={busPosition}>
        <Popup>Bus Location</Popup>
      </Marker>
      <Marker position={stopPosition}>
        <Popup>Bus Stop</Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapView
