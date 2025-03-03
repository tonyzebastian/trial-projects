import React, { useState } from 'react';

export function GradientForm() {
  const [formData, setFormData] = useState({
    color1: '#000000',
    color2: '#ffffff',
    gradientType: 'linear',
    noiseType: 'random',
    noiseOpacity: 0.3
  });

  const handleSubmit = () => {
    console.log('Sending message to plugin:', formData);
    parent.postMessage({
      pluginMessage: {
        type: 'apply-gradient',
        ...formData
      }
    }, '*');
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'noiseOpacity' ? parseFloat(value) : value
    }));
  };

  return (
    <div>
      <h2>Gradient Noise Generator</h2>

      <div className="form-group">
        <label htmlFor="gradientType">Gradient Type</label>
        <select id="gradientType" value={formData.gradientType} onChange={handleChange}>
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="color1">Color 1</label>
        <input type="color" id="color1" value={formData.color1} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="color2">Color 2</label>
        <input type="color" id="color2" value={formData.color2} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="noiseType">Noise Type</label>
        <select id="noiseType" value={formData.noiseType} onChange={handleChange}>
          <option value="random">Random</option>
          <option value="speckled">Speckled</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="noiseOpacity">Noise Opacity</label>
        <input
          type="range"
          id="noiseOpacity"
          min="0"
          max="1"
          step="0.1"
          value={formData.noiseOpacity}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit}>Apply Gradient</button>
    </div>
  );
}