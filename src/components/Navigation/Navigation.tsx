import React, { useState, useEffect } from 'react';

interface Destination {
  id: string;
  name: string;
  address: string;
  distance: string;
}

const Navigation: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<string>('Searching...');
  const [heading, setHeading] = useState<number>(0);
  const [destinations] = useState<Destination[]>([
    {
      id: '1',
      name: 'BMW Headquarters',
      address: 'Petuelring 130, 80809 München',
      distance: '15.3 km'
    },
    {
      id: '2',
      name: 'BMW Welt',
      address: 'Am Olympiapark 1, 80809 München',
      distance: '15.5 km'
    },
    {
      id: '3',
      name: 'BMW Museum',
      address: 'Am Olympiapark 2, 80809 München',
      distance: '15.4 km'
    }
  ]);

  useEffect(() => {
    // Simulate getting current location
    setTimeout(() => {
      setCurrentLocation('Munich, Germany');
    }, 1500);

    // Simulate compass movement
    const interval = setInterval(() => {
      setHeading(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navigation">
      <div className="map-container">
        <div className="map-content">
          <div className="position-marker" />
        </div>
      </div>

      <div className="navigation-overlay">
        <div className="nav-sidebar">
          <div className="nav-header">
            <h2 className="nav-title">Navigation</h2>
            <div className="current-location">
              <div className="location-dot" />
              <span>{currentLocation}</span>
            </div>
            <input
              type="text"
              className="search-box"
              placeholder="Search destination or address"
            />
          </div>

          <div className="destination-list">
            {destinations.map(destination => (
              <div key={destination.id} className="destination-item">
                <div className="destination-name">{destination.name}</div>
                <div className="destination-address">{destination.address}</div>
                <div className="destination-distance">{destination.distance}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="compass" style={{ transform: `rotate(${heading}deg)` }} />

      <div className="map-controls">
        <button className="map-control-btn" title="Zoom In">+</button>
        <button className="map-control-btn" title="Zoom Out">−</button>
        <button className="map-control-btn" title="Center Map">◎</button>
        <button className="map-control-btn" title="Toggle Traffic">🚗</button>
      </div>
    </div>
  );
};

export default Navigation; 