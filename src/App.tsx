import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import CarPlay from './components/CarPlay/CarPlay';
import AndroidAuto from './components/AndroidAuto/AndroidAuto';
import Media from './components/Media/Media';
import Navigation from './components/Navigation/Navigation';
import Home from './components/Home/Home';
import Phone from './components/Phone/Phone';
import Settings from './components/Settings/Settings';
import Vehicle from './components/Vehicle/Vehicle';
import './App.css';

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState('Home');
  const [volume, setVolume] = useState(50);

  const getActiveComponent = () => {
    // Convert to match the exact case of navItems labels
    const appName = activeApp.charAt(0).toUpperCase() + activeApp.slice(1).toLowerCase();
    
    switch (appName) {
      case 'Home':
        return <Home onNavigate={setActiveApp} />;
      case 'Carplay':
        return <CarPlay />;
      case 'Android auto':
        return <AndroidAuto />;
      case 'Media':
        return <Media key="media" volume={volume} onVolumeChange={handleVolumeChange} />;
      case 'Navigation':
        return <Navigation />;
      case 'Phone':
        return <Phone />;
      case 'Settings':
        return <Settings />;
      case 'Vehicle':
        return <Vehicle />;
      default:
        return <Home onNavigate={setActiveApp} />;
    }
  };

  // Persist active app in localStorage
  useEffect(() => {
    const savedApp = localStorage.getItem('activeApp');
    if (savedApp) {
      setActiveApp(savedApp);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeApp', activeApp);
  }, [activeApp]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout onNavChange={setActiveApp} activeApp={activeApp}>
              {getActiveComponent()}
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
