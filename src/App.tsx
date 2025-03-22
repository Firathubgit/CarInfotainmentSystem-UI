import React, { useState } from 'react';
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
  const [activeApp, setActiveApp] = useState('home');

  const handleNavChange = (app: string) => {
    setActiveApp(app);
  };

  const apps = {
    home: {
      title: 'Home',
      content: <Home onNavigate={handleNavChange} />
    },
    media: {
      title: 'Media',
      content: <Media />
    },
    navigation: {
      title: 'Navigation',
      content: <Navigation />
    },
    phone: {
      title: 'Phone',
      content: <Phone />
    },
    vehicle: {
      title: 'Vehicle',
      content: <Vehicle />
    },
    settings: {
      title: 'Settings',
      content: <Settings />
    },
    carplay: {
      title: 'CarPlay',
      content: <CarPlay />
    },
    'android-auto': {
      title: 'Android Auto',
      content: <AndroidAuto />
    }
  };

  return (
    <MainLayout onNavChange={handleNavChange} activeApp={activeApp}>
      {apps[activeApp as keyof typeof apps].content}
    </MainLayout>
  );
};

export default App;
