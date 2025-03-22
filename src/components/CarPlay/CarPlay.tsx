import React, { useState } from 'react';
import './CarPlay.css';

const CarPlay: React.FC = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCarPlayActive, setIsCarPlayActive] = useState(false);

  const handleTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsCarPlayActive(true);
      setIsTransitioning(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsCarPlayActive(false);
      setIsTransitioning(false);
    }, 2000);
  };

  if (isCarPlayActive) {
    return (
      <div className={`carplay-interface ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="carplay-header">
          <div className="carplay-status">
            <span className="signal">📶</span>
            <span className="battery">82%</span>
            <span className="time">15:45</span>
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            EXIT CARPLAY
          </button>
        </div>
        <div className="carplay-grid">
          <div className="carplay-app">
            <span className="app-icon">📚</span>
            <span className="app-name">Maps</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">🎵</span>
            <span className="app-name">YouTube Music</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">📱</span>
            <span className="app-name">Phone</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">💬</span>
            <span className="app-name">Messages</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">🎧</span>
            <span className="app-name">Spotify</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">📻</span>
            <span className="app-name">Radio</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">⚙️</span>
            <span className="app-name">Settings</span>
          </div>
          <div className="carplay-app">
            <span className="app-icon">🎮</span>
            <span className="app-name">Apps</span>
          </div>
        </div>
        <div className="carplay-dock">
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
    <div className={`carplay-connect ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="connect-content">
        <div className="apple-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
               alt="Apple Logo" 
               className="apple-icon" />
        </div>
        <h2>Connect to CarPlay</h2>
        <p>Connect your iPhone to get started</p>
        <button className="connect-btn" onClick={handleTransition}>
          Connect to CarPlay
        </button>
        <div className="connection-steps">
          <div className="step">
            <span className="step-number">1</span>
            <span className="step-text">Connect iPhone via USB or Wireless</span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span className="step-text">Unlock your iPhone</span>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <span className="step-text">Allow CarPlay on your iPhone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarPlay; 