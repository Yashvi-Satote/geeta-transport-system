import { useAuth } from '../auth/AuthContext'
import SharedMap from '../shared/components/SharedMap'

export default function MapView() {
  const { currentUser } = useAuth()
  const assignedBusNumber = currentUser?.busNumber || ''

  return (
    <SharedMap mode="single" assignedBusNumber={assignedBusNumber} />
  )
}
