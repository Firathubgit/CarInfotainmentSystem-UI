import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useIdriveController } from '../../hooks/useIdriveController';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavChange: (app: string) => void;
  activeApp: string;
}

type DriveMode = 'COMFORT' | 'SPORT' | 'ECO' | 'SPORT_PLUS';

const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavChange, activeApp }) => {
  const [speed, setSpeed] = useState<number>(0);
  const [isAccelerating, setIsAccelerating] = useState<boolean>(false);
  const [isBraking, setIsBraking] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [leftTemp, setLeftTemp] = useState(22.0);
  const [rightTemp, setRightTemp] = useState(22.0);
  const [climateMode, setClimateMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const maxSpeed = 260;
  const acceleration = 5;
  const braking = 8;
  const naturalDeceleration = 2;
  const [volume, setVolume] = useState<number>(0.7);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState<boolean>(false);
  const volumeTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const [driveMode, setDriveMode] = useState<DriveMode>('COMFORT');
  const [showModeChange, setShowModeChange] = useState(false);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'media', icon: '🎵', label: 'Media' },
    { id: 'navigation', icon: '🗺️', label: 'Navigation' },
    { id: 'phone', icon: '📱', label: 'Phone' },
    { id: 'vehicle', icon: '🚗', label: 'Vehicle' },
    { id: 'carplay', icon: '', label: 'CarPlay' },
    { id: 'android-auto', icon: '', label: 'Android Auto' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  const handleNavSelect = useCallback((index: number) => {
    const selectedApp = navItems[index].label;
    console.log('Navigation selected:', selectedApp);
    onNavChange(selectedApp);
  }, [navItems, onNavChange]);

  const { selectedIndex, rotateKnob, selectCurrent } = useIdriveController(navItems.length, handleNavSelect);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle speed changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((currentSpeed) => {
        if (isAccelerating && !isBraking) {
          return Math.min(currentSpeed + acceleration, maxSpeed);
        } else if (isBraking) {
          return Math.max(currentSpeed - braking, 0);
        } else {
          return Math.max(currentSpeed - naturalDeceleration, 0);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAccelerating, isBraking]);

  // Generate rev bars
  const renderRevBars = useCallback((side: 'left' | 'right') => {
    const bars = [];
    const totalBars = 12;
    const activeBarCount = Math.floor((speed / maxSpeed) * totalBars);

    for (let i = 0; i < totalBars; i++) {
      bars.push(
        <div
          key={`${side}-${i}`}
          className={`rev-bar ${i < activeBarCount ? 'active' : ''}`}
        />
      );
    }

    return (
      <div className={`rev-bars ${side}`}>
        {side === 'left' ? bars.reverse() : bars}
      </div>
    );
  }, [speed]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const adjustTemperature = (side: 'left' | 'right', delta: number) => {
    const setTemp = side === 'left' ? setLeftTemp : setRightTemp;
    setTemp(prev => {
      const newTemp = Math.round((prev + delta) * 2) / 2; // Round to nearest 0.5
      return Math.min(Math.max(newTemp, 16), 28); // Limit between 16°C and 28°C
    });
  };

  const toggleClimateMode = () => {
    setClimateMode(prev => prev === 'AUTO' ? 'MANUAL' : 'AUTO');
  };

  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    
    // Show volume indicator
    setShowVolumeIndicator(true);
    
    // Clear existing timeout
    if (volumeTimeout.current) {
      clearTimeout(volumeTimeout.current);
    }
    
    // Hide volume indicator after 2 seconds
    volumeTimeout.current = setTimeout(() => {
      setShowVolumeIndicator(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (volumeTimeout.current) {
        clearTimeout(volumeTimeout.current);
      }
    };
  }, []);

  const getModeColors = () => {
    switch(driveMode) {
      case 'SPORT_PLUS':
        return {
          primary: '#ff00ff',
          secondary: '#ff66ff',
          accent: '#cc00cc'
        };
      case 'SPORT':
        return {
          primary: '#ff2d2d',
          secondary: '#ff6b6b',
          accent: '#ff0000'
        };
      case 'ECO':
        return {
          primary: '#4CAF50',
          secondary: '#81c784',
          accent: '#2e7d32'
        };
      case 'COMFORT':
      default:
        return {
          primary: '#2196F3',
          secondary: '#64b5f6',
          accent: '#1976d2'
        };
    }
  };

  const colors = getModeColors();

  const handleModeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1 : -1;
    
    setDriveMode(current => {
      const modes: DriveMode[] = ['COMFORT', 'SPORT', 'SPORT_PLUS', 'ECO'];
      const currentIndex = modes.indexOf(current);
      const newIndex = (currentIndex + direction + modes.length) % modes.length;
      return modes[newIndex];
    });

    // Show mode change animation
    setShowModeChange(true);
    setTimeout(() => setShowModeChange(false), 2000);
  };

  return (
    <div className="main-layout">
      <div className="idrive-displays">
        <div className="digital-cockpit" data-mode={driveMode}>
          <div className="speed-container">
            <div className="rev-bars left">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={`left-${i}`} 
                  className={`rev-bar ${i < speed / 15 ? 'active' : ''}`}
                  style={{
                    transitionDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
            <div className="rev-bars right">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={`right-${i}`} 
                  className={`rev-bar ${i < speed / 15 ? 'active' : ''}`}
                  style={{
                    transitionDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
            <div className="center-section">
              <div className="speed-display">
                <div className="speed-value">{Math.round(speed)}</div>
                <div className="speed-unit">KM/H</div>
              </div>
              <div className="mode-display">
                <div className="mode-value">{driveMode.replace('_', ' ')}</div>
              </div>
            </div>
            <div className="status-boxes">
              <div className="status-box">
                <div className="status-value">62%</div>
                <div className="status-label">BATTERY</div>
              </div>
              <div className="status-box">
                <div className="status-value">283</div>
                <div className="status-label">RANGE KM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-display">
          <div className="side-nav">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                className={`nav-item ${index === selectedIndex ? 'selected' : ''} ${item.label === activeApp ? 'active' : ''}`}
                onClick={() => handleNavSelect(index)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="content-area">
            <div className="top-bar">
              <div className="status-icons">
                <span className="icon">📶</span>
                <span className="icon">🔋</span>
                <span className="time">{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="main-content">
              {children}
            </div>
            <div className="temp-bar">
              <div className="temp-control">
                <button 
                  className="temp-btn" 
                  onClick={() => adjustTemperature('left', -0.5)}
                >
                  −
                </button>
                <div className="temp-value">
                  <span className="temp-number">{leftTemp.toFixed(1)}</span>
                  <span className="temp-unit">°</span>
                </div>
                <button 
                  className="temp-btn" 
                  onClick={() => adjustTemperature('left', 0.5)}
                >
                  +
                </button>
              </div>
              <div className="temp-control">
                <button 
                  className="temp-btn" 
                  onClick={() => adjustTemperature('right', -0.5)}
                >
                  −
                </button>
                <div className="temp-value">
                  <span className="temp-number">{rightTemp.toFixed(1)}</span>
                  <span className="temp-unit">°</span>
                </div>
                <button 
                  className="temp-btn" 
                  onClick={() => adjustTemperature('right', 0.5)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="idrive-control-area">
        <div className="pedal-controls">
          <div
            className="pedal brake"
            onMouseDown={() => setIsBraking(true)}
            onMouseUp={() => setIsBraking(false)}
            onMouseLeave={() => setIsBraking(false)}
          >
            <span className="pedal-label">BRAKE</span>
          </div>
          <div
            className="pedal gas"
            onMouseDown={() => setIsAccelerating(true)}
            onMouseUp={() => setIsAccelerating(false)}
            onMouseLeave={() => setIsAccelerating(false)}
          >
            <span className="pedal-label">GAS</span>
          </div>
        </div>

        <div className="control-section">
          <div className="control-wheels">
            <div className="volume-wheel-container">
              <div 
                className="volume-wheel" 
                onWheel={handleVolumeWheel}
                style={{ 
                  transform: `rotate(${volume * 270}deg)`
                }}
              >
                <div className="volume-indicator-dot"></div>
              </div>
              <div className="volume-instructions">Volume</div>
            </div>

            <div className="mode-wheel-container">
              <div 
                className="mode-wheel"
                onWheel={handleModeWheel}
                style={{
                  '--mode-color': colors.primary,
                  '--mode-glow': colors.accent,
                  '--mode-border': colors.secondary
                } as React.CSSProperties}
              >
                <div className="mode-indicator-dot"></div>
              </div>
              <div 
                className="mode-instructions"
                style={{ color: colors.primary }}
              >
                {driveMode.replace('_', ' ')}
              </div>
            </div>

            <div className="idrive-knob-container">
              <div 
                className="idrive-knob"
                onWheel={(e) => {
                  e.preventDefault();
                  rotateKnob(e.deltaY < 0 ? 'up' : 'down');
                }}
                onClick={selectCurrent}
              >
                <div className="knob-marker" style={{ transform: `rotate(${selectedIndex * (360 / navItems.length)}deg)` }}></div>
              </div>
              <div className="idrive-instructions">Use mouse wheel to navigate, click to select</div>
            </div>
          </div>
        </div>
      </div>

      {showVolumeIndicator && (
        <div className="volume-indicator">
          <div className="volume-icon">🔊</div>
          <div className="volume-level">{Math.round(volume * 100)}%</div>
        </div>
      )}
    </div>
  );
};

export default MainLayout; 