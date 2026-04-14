import { useState, useContext } from 'react'
import { DataContext } from '../../shared/DataContext'

export default function MergeBus() {
  const { buses, mergeStudents } = useContext(DataContext)
  
  const [sourceBus, setSourceBus] = useState('')
  const [targetBus, setTargetBus] = useState('')
  const [stop, setStop] = useState('')
  const [type, setType] = useState('temporary')
  const [message, setMessage] = useState('')

  // Derive stops based on selected source bus
  const selectedSourceBus = buses.find(b => b.busNumber === sourceBus)
  const availableStops = selectedSourceBus ? selectedSourceBus.stops : []

  const handleMerge = () => {
    if (!sourceBus || !targetBus || !stop) {
      setMessage('Please fill in all fields.')
      return
    }
    if (sourceBus === targetBus) {
      setMessage('Source and Target bus cannot be the same.')
      return
    }

    // Call global handler
    mergeStudents(sourceBus, targetBus, stop, type)
    
    setMessage(`Successfully assigned students from Bus ${sourceBus} (${stop}) to Bus ${targetBus} (${type}).`)
    // Reset selection after giving user feedback
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Merge Students</h1>
        <p className="bus-subtitle">Temporarily or permanently reassign students across buses</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="bus-card">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Source Bus</label>
          <select className="bus-select" value={sourceBus} onChange={e => {
              setSourceBus(e.target.value)
              setStop('') // reset stop on bus change
            }}>
            <option value="">Select a Bus</option>
            {buses.map(b => <option key={b.busNumber} value={b.busNumber}>Bus {b.busNumber}</option>)}
          </select>
        </div>

        {sourceBus && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Bus Stop</label>
            <select className="bus-select" value={stop} onChange={e => setStop(e.target.value)}>
              <option value="">Select a Stop</option>
              {availableStops.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Target Bus</label>
          <select className="bus-select" value={targetBus} onChange={e => setTargetBus(e.target.value)}>
            <option value="">Select a Bus</option>
            {buses.map(b => (
              <option key={b.busNumber} value={b.busNumber} disabled={b.busNumber === sourceBus}>
                Bus {b.busNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Merge Type</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="mergeType" 
                value="temporary" 
                checked={type === 'temporary'} 
                onChange={() => setType('temporary')} 
              />
              Temporary (12 Hours)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="mergeType" 
                value="permanent" 
                checked={type === 'permanent'} 
                onChange={() => setType('permanent')} 
              />
              Permanent Reassign
            </label>
          </div>
        </div>

        <button className="bus-btn" style={{ marginTop: '16px' }} onClick={handleMerge}>
          Merge Students
        </button>

      </div>
    </div>
  )
}
