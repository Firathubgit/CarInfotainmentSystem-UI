import React, { useState } from 'react';
import './AndroidAuto.css';

const AndroidAuto: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAndroidAutoActive, setIsAndroidAutoActive] = useState(false);

  const handleTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAndroidAutoActive(true);
      setIsTransitioning(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAndroidAutoActive(false);
      setIsTransitioning(false);
    }, 2000);
  };

  if (isAndroidAutoActive) {
    return (
      <div className={`android-auto-interface ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="android-auto-header">
          <div className="android-status">
            <span className="signal">📶</span>
            <span className="battery">82%</span>
            <span className="time">15:45</span>
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            EXIT ANDROID AUTO
          </button>
        </div>
        <div className="android-auto-grid">
          <div className="android-app">
            <span className="app-icon">📚</span>
            <span className="app-name">Maps</span>
          </div>
          <div className="android-app">
            <span className="app-icon">🎵</span>
            <span className="app-name">YouTube Music</span>
          </div>
          <div className="android-app">
            <span className="app-icon">📱</span>
            <span className="app-name">Phone</span>
          </div>
          <div className="android-app">
            <span className="app-icon">💬</span>
            <span className="app-name">Messages</span>
          </div>
          <div className="android-app">
            <span className="app-icon">🎧</span>
            <span className="app-name">Spotify</span>
          </div>
          <div className="android-app">
            <span className="app-icon">📻</span>
            <span className="app-name">Radio</span>
          </div>
          <div className="android-app">
            <span className="app-icon">⚙️</span>
            <span className="app-name">Settings</span>
          </div>
          <div className="android-app">
            <span className="app-icon">🎮</span>
            <span className="app-name">Apps</span>
          </div>
        </div>
        <div className="android-dock">
          <div className="dock-app">
            <span className="app-icon">📚</span>
          </div>
          <div className="dock-app">
            <span className="app-icon">🎵</span>
          </div>
          <div className="dock-app">
            <span className="app-icon">📱</span>
          </div>
          <div className="dock-app">
            <span className="app-icon">🏠</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`android-auto-connect ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="connect-content">
        <div className="android-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" 
               alt="Android Logo" 
               className="android-icon" />
        </div>
        <h2>Connect to Android Auto</h2>
        <p>Connect your Android phone to get started</p>
        <button className="connect-btn" onClick={handleTransition}>
          Connect to Android Auto
        </button>
        <div className="connection-steps">
          <div className="step">
            <span className="step-number">1</span>
            <span className="step-text">Connect Android phone via USB</span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span className="step-text">Unlock your phone</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-text">Allow Android Auto on your phone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AndroidAuto; 