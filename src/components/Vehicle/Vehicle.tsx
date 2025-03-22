import React from 'react';
import './Vehicle.css';

const Vehicle: React.FC = () => {
  return (
    <div className="vehicle-container">
      <div className="vehicle-header">
        <h2>Vehicle Status</h2>
      </div>
      <div className="status-grid">
        <div className="status-card">
          <div className="status-content">
            <div className="status-icon">
              <img src="/icons/fuel.svg" alt="Fuel" />
            </div>
            <div className="status-info">
              <div className="status-value">62%</div>
              <div className="status-label">Fuel Level</div>
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-content">
            <div className="status-icon">
              <img src="/icons/range.svg" alt="Range" />
            </div>
            <div className="status-info">
              <div className="status-value">283 km</div>
              <div className="status-label">Range</div>
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-content">
            <div className="status-icon">
              <img src="/icons/temperature.svg" alt="Temperature" />
            </div>
            <div className="status-info">
              <div className="status-value">21°C</div>
              <div className="status-label">Outside Temp</div>
            </div>
          </div>
        </div>

        <div className="status-card">
          <div className="status-content">
            <div className="status-icon">
              <img src="/icons/system.svg" alt="System" />
            </div>
            <div className="status-info">
              <div className="status-value">OK</div>
              <div className="status-label">System Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Additional Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Oil Level</span>
            <span className="detail-value">Optimal</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tire Pressure</span>
            <span className="detail-value">All Normal</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Next Service</span>
            <span className="detail-value">8,500 km</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Battery Health</span>
            <span className="detail-value">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicle; 