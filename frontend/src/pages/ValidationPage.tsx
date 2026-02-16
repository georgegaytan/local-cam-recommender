import React, { useState } from 'react'
import { apiClient, ValidationResult } from '../api/client'

export const ValidationPage: React.FC = () => {
  const [configId, setConfigId] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidate = async () => {
    try {
      const res = await apiClient.validateConfig(configId)
      setResult(res)
    } catch (error) {
      console.error(error)
      alert('Failed to validate')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Validate Configuration</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            Configuration ID (UUID)
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              placeholder="Enter Config ID..."
              value={configId}
              onChange={(e) => setConfigId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button onClick={handleValidate}>Validate</button>
          </div>
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: result.is_valid ? '1px solid green' : '1px solid red',
          }}
        >
          <h3 style={{ color: result.is_valid ? 'green' : 'red' }}>
            {result.is_valid ? 'VALID' : 'INVALID'}
          </h3>
          <p>Hash: {result.validation_hash}</p>
          {result.warnings.length > 0 && (
            <div>
              <h4>Warnings:</h4>
              <ul>
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
