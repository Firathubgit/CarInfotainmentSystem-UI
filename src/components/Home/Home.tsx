import React, { useState, useCallback } from 'react';
import Profile from '../Profile/Profile';
import './Home.css';

interface RecentTrack {
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

interface FavoriteDestination {
  name: string;
  distance: string;
  eta: string;
  traffic: 'low' | 'medium' | 'high';
}

interface Widget {
  id: string;
  type: 'profile' | 'weather' | 'vehicle' | 'music' | 'navigation' | 'phone';
  position: number;
}

interface HomeProps {
  onNavigate: (app: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'profile', type: 'profile', position: 0 },
    { id: 'weather', type: 'weather', position: 1 },
    { id: 'vehicle', type: 'vehicle', position: 2 },
    { id: 'music', type: 'music', position: 3 },
    { id: 'navigation', type: 'navigation', position: 4 },
    { id: 'phone', type: 'phone', position: 5 }
  ]);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);

  const currentProfile = {
    name: "John's Profile",
    image: "👤",
    lastUsed: "Today at 8:30 AM"
  };

  const recentTracks: RecentTrack[] = [
    {
      title: "Can't Feel My Face",
      artist: "The Weeknd",
      albumArt: "🎵",
      duration: "3:35"
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumArt: "🎵",
      duration: "3:20"
    }
  ];

  const favoriteDestinations: FavoriteDestination[] = [
    {
      name: "Home",
      distance: "12.5 km",
      eta: "15 min",
      traffic: "low"
    },
    {
      name: "Work",
      distance: "28.3 km",
      eta: "35 min",
      traffic: "medium"
    }
  ];

  const vehicleStatus = {
    fuelLevel: "62%",
    range: "283 km",
    outsideTemp: "21°C",
    tirePressure: "OK",
    oilLevel: "OK",
    nextService: "8,500 km"
  };

  const handleDragStart = (widget: Widget) => {
    setDraggedWidget(widget);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetWidget: Widget) => {
    if (!draggedWidget) return;

    const newWidgets = widgets.map(w => {
      if (w.id === draggedWidget.id) {
        return { ...w, position: targetWidget.position };
      }
      if (w.id === targetWidget.id) {
        return { ...w, position: draggedWidget.position };
      }
      return w;
    });

    setWidgets(newWidgets.sort((a, b) => a.position - b.position));
    setDraggedWidget(null);
  };

  const handleNavigate = useCallback((app: string) => {
    onNavigate(app);
  }, [onNavigate]);

  if (showProfile) {
    return (
      <Profile
        currentProfile={currentProfile}
        onBack={() => setShowProfile(false)}
      />
    );
  }

  return (
    <div className="home-container">
      <div className="top-section">
        <div 
          className="profile-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'profile')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'profile')!)}
          onClick={() => setShowProfile(true)}
        >
          <div className="profile-icon">{currentProfile.image}</div>
          <div className="profile-info">
            <h3>{currentProfile.name}</h3>
            <p>Last used: {currentProfile.lastUsed}</p>
          </div>
        </div>
        <div 
          className="weather-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'weather')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'weather')!)}
        >
          <div className="weather-icon">🌤️</div>
          <div className="weather-info">
            <h3>{vehicleStatus.outsideTemp}</h3>
            <p>Partly Cloudy</p>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div 
          className="vehicle-status-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'vehicle')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'vehicle')!)}
        >
          <h3>Vehicle Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon">⛽</div>
              <div className="status-details">
                <span className="status-value">{vehicleStatus.fuelLevel}</span>
                <span className="status-label">Fuel Level</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">🛣️</div>
              <div className="status-details">
                <span className="status-value">{vehicleStatus.range}</span>
                <span className="status-label">Range</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">🔧</div>
              <div className="status-details">
                <span className="status-value">{vehicleStatus.nextService}</span>
                <span className="status-label">Next Service</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">🚗</div>
              <div className="status-details">
                <span className="status-value">{vehicleStatus.tirePressure}</span>
                <span className="status-label">Tire Pressure</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="recent-tracks-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'music')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'music')!)}
        >
          <h3>Recently Played</h3>
          <div className="tracks-list">
            {recentTracks.map((track, index) => (
              <div 
                key={index} 
                className="track-item"
                onClick={() => handleNavigate('media')}
              >
                <div className="track-art">{track.albumArt}</div>
                <div className="track-info">
                  <span className="track-title">{track.title}</span>
                  <span className="track-artist">{track.artist}</span>
                </div>
                <span className="track-duration">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="favorite-destinations-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'navigation')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'navigation')!)}
        >
          <h3>Quick Navigation</h3>
          <div className="destinations-list">
            {favoriteDestinations.map((dest, index) => (
              <div 
                key={index} 
                className="destination-item"
                onClick={() => handleNavigate('navigation')}
              >
                <div className="destination-icon">📍</div>
                <div className="destination-info">
                  <span className="destination-name">{dest.name}</span>
                  <div className="destination-details">
                    <span className="destination-distance">{dest.distance}</span>
                    <span className="destination-eta">ETA: {dest.eta}</span>
                    <span className={`traffic-indicator ${dest.traffic}`}>
                      {dest.traffic === 'low' ? '🟢' : dest.traffic === 'medium' ? '🟡' : '🔴'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="phone-integration-card"
          draggable
          onDragStart={() => handleDragStart(widgets.find(w => w.type === 'phone')!)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(widgets.find(w => w.type === 'phone')!)}
        >
          <h3>Phone Integration</h3>
          <div className="integration-options">
            <div 
              className="integration-option carplay"
              onClick={() => handleNavigate('carplay')}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
                alt="CarPlay" 
                className="integration-icon"
              />
              <span>CarPlay</span>
            </div>
            <div 
              className="integration-option android-auto"
              onClick={() => handleNavigate('android-auto')}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" 
                alt="Android Auto" 
                className="integration-icon"
              />
              <span>Android Auto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 