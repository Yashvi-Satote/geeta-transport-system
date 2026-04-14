import { useState, useRef } from 'react'

export default function RegistrationUpload() {
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles.map(f => ({ name: f.name, date: new Date().toLocaleDateString() }))])
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="bus-header">
        <h1 className="bus-title">Registration Upload</h1>
        <p className="bus-subtitle">Upload registration PDFs or image proofs</p>
      </div>

      <div className="bus-card">
        <div style={{ padding: '32px', textAlign: 'center', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px' }}>Upload Document</h3>
          <p style={{ color: 'rgba(0,0,0,0.5)', marginBottom: '24px' }}>Accepts .pdf, .jpg, .png</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.png,.jpg,.jpeg" 
            style={{ display: 'none' }} 
            multiple
          />
          <button className="bus-btn" onClick={() => fileInputRef.current.click()}>
            Browse Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bus-card">
          <h3 style={{ margin: '0 0 16px' }}>Uploaded Documents</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {files.map((file, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                <div>
                  <strong>{file.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)', marginTop: '4px' }}>{file.date}</div>
                </div>
                <button 
                  onClick={() => handleDelete(idx)}
                  style={{ background: 'transparent', border: 'none', color: '#dc3545', fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
