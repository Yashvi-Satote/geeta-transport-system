import { useState, useContext } from 'react'
import { DataContext } from '../../shared/DataContext'

export default function MergeRoutes() {
  const { buses, mergeStudents } = useContext(DataContext)

  const [sourceBus, setSourceBus]   = useState('')
  const [targetBus, setTargetBus]   = useState('')
  const [selectedStops, setSelectedStops] = useState([])
  const [message, setMessage]       = useState(null)

  const sourceBusData = buses.find(b => b.busNumber === sourceBus)
  const availableStops = sourceBusData ? sourceBusData.stops : []

  const toggleStop = (stop) => {
    setSelectedStops(prev =>
      prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]
    )
  }

  const executemerge = (type) => {
    if (!sourceBus || !targetBus) {
      setMessage({ type: 'error', text: 'Please select both Source and Target bus.' }); return
    }
    if (sourceBus === targetBus) {
      setMessage({ type: 'error', text: 'Source and Target cannot be the same bus.' }); return
    }
    if (selectedStops.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one stop.' }); return
    }

    selectedStops.forEach(stop => mergeStudents(sourceBus, targetBus, stop, type))

    const label = type === 'temporary' ? 'Temporary (12h)' : 'Permanent'
    setMessage({
      type: 'success',
      text: `✅ [${label}] Reassigned stops [${selectedStops.join(', ')}] from Bus ${sourceBus} → Bus ${targetBus}.`
    })
    setSelectedStops([])
    setTimeout(() => setMessage(null), 6000)
  }

  return (
    <div>
      <div className="mgr-header">
        <h1 className="mgr-title">🔀 Merge Routes</h1>
        <p className="mgr-subtitle">Reassign student stops across buses — temporary or permanent</p>
      </div>

      {message && (
        <div className={`mgr-alert ${message.type === 'success' ? 'mgr-alert-success' : 'mgr-alert-error'}`}>
          {message.text}
        </div>
      )}

      <div className="mgr-card">
        {/* Source / Target selects */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="mgr-label">Source Bus</label>
            <select className="mgr-select" value={sourceBus} onChange={e => { setSourceBus(e.target.value); setSelectedStops([]) }}>
              <option value="">— Select Source —</option>
              {buses.map(b => <option key={b.busNumber} value={b.busNumber}>Bus {b.busNumber} ({b.route})</option>)}
            </select>
          </div>
          <div>
            <label className="mgr-label">Target Bus</label>
            <select className="mgr-select" value={targetBus} onChange={e => setTargetBus(e.target.value)}>
              <option value="">— Select Target —</option>
              {buses.map(b => (
                <option key={b.busNumber} value={b.busNumber} disabled={b.busNumber === sourceBus}>
                  Bus {b.busNumber} ({b.route})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Multi-stop selector */}
        {availableStops.length > 0 && (
          <div>
            <label className="mgr-label">Select Stops to Move</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {availableStops.map(stop => {
                const selected = selectedStops.includes(stop)
                return (
                  <button
                    key={stop}
                    onClick={() => toggleStop(stop)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border: selected ? '2px solid #7c83fd' : '2px solid rgba(255,255,255,0.12)',
                      background: selected ? 'rgba(124,131,253,0.2)' : '#1a1e28',
                      color: selected ? '#7c83fd' : 'rgba(255,255,255,0.6)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {selected ? '✓ ' : ''}{stop}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mgr-btn-row">
          <button className="mgr-btn mgr-btn-primary" onClick={() => executemerge('temporary')}>
            ⏱ Temporary Merge (12h)
          </button>
          <button className="mgr-btn mgr-btn-danger" onClick={() => executemerge('permanent')}>
            🔒 Permanent Reassign
          </button>
        </div>
      </div>
    </div>
  )
}
