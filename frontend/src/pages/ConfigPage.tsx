import React, { useState } from 'react'
import { apiClient, Configuration } from '../api/client'

export const ConfigPage: React.FC = () => {
  const [formData, setFormData] = useState<Configuration>({
    machine_id: 'M001',
    material: 'AL-6061',
    tool_diameter: 10.0,
    feed_rate: 1000,
    spindle_speed: 10000,
  })
  const [createdConfig, setCreatedConfig] = useState<Configuration | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const config = await apiClient.createConfig(formData)
      setCreatedConfig(config)
      alert(`Config created with ID: ${config.id}`)
    } catch (error) {
      console.error(error)
      alert('Failed to create config')
    }
  }

  const inputStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  }
  const labelStyle = { fontWeight: 'bold' as const, fontSize: '0.9rem' }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Configuration</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxWidth: '300px',
        }}
      >
        <div style={inputStyle}>
          <label style={labelStyle}>Machine ID</label>
          <input
            placeholder="e.g. M001"
            value={formData.machine_id}
            onChange={(e) =>
              setFormData({ ...formData, machine_id: e.target.value })
            }
          />
        </div>
        <div style={inputStyle}>
          <label style={labelStyle}>Material</label>
          <input
            placeholder="e.g. AL-6061"
            value={formData.material}
            onChange={(e) =>
              setFormData({ ...formData, material: e.target.value })
            }
          />
        </div>
        <div style={inputStyle}>
          <label style={labelStyle}>Tool Diameter (mm)</label>
          <input
            type="number"
            placeholder="10.0"
            value={formData.tool_diameter}
            onChange={(e) =>
              setFormData({
                ...formData,
                tool_diameter: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div style={inputStyle}>
          <label style={labelStyle}>Feed Rate (mm/min)</label>
          <input
            type="number"
            placeholder="1000"
            value={formData.feed_rate}
            onChange={(e) =>
              setFormData({
                ...formData,
                feed_rate: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div style={inputStyle}>
          <label style={labelStyle}>Spindle Speed (RPM)</label>
          <input
            type="number"
            placeholder="10000"
            value={formData.spindle_speed}
            onChange={(e) =>
              setFormData({
                ...formData,
                spindle_speed: parseInt(e.target.value),
              })
            }
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Create Configuration
        </button>
      </form>

      {createdConfig && (
        <div
          style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '10px',
          }}
        >
          <h3>Created Config</h3>
          <pre>{JSON.stringify(createdConfig, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
