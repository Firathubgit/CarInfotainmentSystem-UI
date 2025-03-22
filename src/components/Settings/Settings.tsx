import React, { useState } from 'react';
import './Settings.css';

interface SystemSettings {
  display: {
    brightness: number;
    theme: 'dark' | 'light';
    accentColor: string;
    clockFormat: '12h' | '24h';
    temperatureUnit: 'C' | 'F';
    language: string;
  };
  sound: {
    masterVolume: number;
    navigation: number;
    media: number;
    calls: number;
    notifications: number;
    systemSounds: boolean;
  };
  connectivity: {
    bluetooth: boolean;
    wifi: boolean;
    mobileData: boolean;
    hotspot: boolean;
  };
  privacy: {
    locationServices: boolean;
    dataSharingBMW: boolean;
    crashReporting: boolean;
    analytics: boolean;
  };
}

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'display' | 'sound' | 'connectivity' | 'privacy' | 'about'>('display');
  const [settings, setSettings] = useState<SystemSettings>({
    display: {
      brightness: 80,
      theme: 'dark',
      accentColor: '#007AFF',
      clockFormat: '24h',
      temperatureUnit: 'C',
      language: 'English'
    },
    sound: {
      masterVolume: 70,
      navigation: 80,
      media: 75,
      calls: 85,
      notifications: 60,
      systemSounds: true
    },
    connectivity: {
      bluetooth: true,
      wifi: true,
      mobileData: false,
      hotspot: false
    },
    privacy: {
      locationServices: true,
      dataSharingBMW: true,
      crashReporting: true,
      analytics: false
    }
  });

  const handleBrightnessChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      display: { ...prev.display, brightness: value }
    }));
  };

  const handleVolumeChange = (type: keyof SystemSettings['sound'], value: number) => {
    setSettings(prev => ({
      ...prev,
      sound: { ...prev.sound, [type]: value }
    }));
  };

  const handleToggle = (section: keyof SystemSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [setting]: value }
    }));
  };

  const renderDisplaySettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Display Settings</h3>
        <div className="setting-group">
          <div className="setting-item">
            <span>Screen Brightness</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.display.brightness}
                onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              />
              <span>{settings.display.brightness}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>Theme</span>
            <div className="theme-selector">
              <button
                className={`theme-btn ${settings.display.theme === 'dark' ? 'active' : ''}`}
                onClick={() => setSettings(prev => ({
                  ...prev,
                  display: { ...prev.display, theme: 'dark' }
                }))}
              >
                Dark
              </button>
              <button
                className={`theme-btn ${settings.display.theme === 'light' ? 'active' : ''}`}
                onClick={() => setSettings(prev => ({
                  ...prev,
                  display: { ...prev.display, theme: 'light' }
                }))}
              >
                Light
              </button>
            </div>
          </div>

          <div className="setting-item">
            <span>Accent Color</span>
            <div className="color-picker">
              {['#007AFF', '#FF2D55', '#5856D6', '#FF9500', '#4CD964'].map(color => (
                <button
                  key={color}
                  className={`color-btn ${settings.display.accentColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    display: { ...prev.display, accentColor: color }
                  }))}
                />
              ))}
            </div>
          </div>

          <div className="setting-item">
            <span>Clock Format</span>
            <select
              value={settings.display.clockFormat}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                display: { ...prev.display, clockFormat: e.target.value as '12h' | '24h' }
              }))}
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>

          <div className="setting-item">
            <span>Temperature Unit</span>
            <div className="unit-selector">
              <button
                className={`unit-btn ${settings.display.temperatureUnit === 'C' ? 'active' : ''}`}
                onClick={() => setSettings(prev => ({
                  ...prev,
                  display: { ...prev.display, temperatureUnit: 'C' }
                }))}
              >
                °C
              </button>
              <button
                className={`unit-btn ${settings.display.temperatureUnit === 'F' ? 'active' : ''}`}
                onClick={() => setSettings(prev => ({
                  ...prev,
                  display: { ...prev.display, temperatureUnit: 'F' }
                }))}
              >
                °F
              </button>
            </div>
          </div>

          <div className="setting-item">
            <span>Language</span>
            <select
              value={settings.display.language}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                display: { ...prev.display, language: e.target.value }
              }))}
            >
              <option value="English">English</option>
              <option value="Deutsch">Deutsch</option>
              <option value="Français">Français</option>
              <option value="Español">Español</option>
              <option value="Italiano">Italiano</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSoundSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Sound Settings</h3>
        <div className="setting-group">
          <div className="setting-item">
            <span>Master Volume</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sound.masterVolume}
                onChange={(e) => handleVolumeChange('masterVolume', parseInt(e.target.value))}
              />
              <span>{settings.sound.masterVolume}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>Navigation</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sound.navigation}
                onChange={(e) => handleVolumeChange('navigation', parseInt(e.target.value))}
              />
              <span>{settings.sound.navigation}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>Media</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sound.media}
                onChange={(e) => handleVolumeChange('media', parseInt(e.target.value))}
              />
              <span>{settings.sound.media}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>Calls</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sound.calls}
                onChange={(e) => handleVolumeChange('calls', parseInt(e.target.value))}
              />
              <span>{settings.sound.calls}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>Notifications</span>
            <div className="slider-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sound.notifications}
                onChange={(e) => handleVolumeChange('notifications', parseInt(e.target.value))}
              />
              <span>{settings.sound.notifications}%</span>
            </div>
          </div>

          <div className="setting-item">
            <span>System Sounds</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.sound.systemSounds}
                onChange={(e) => handleToggle('sound', 'systemSounds', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectivitySettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Connectivity</h3>
        <div className="setting-group">
          <div className="setting-item">
            <span>Bluetooth</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.connectivity.bluetooth}
                onChange={(e) => handleToggle('connectivity', 'bluetooth', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Wi-Fi</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.connectivity.wifi}
                onChange={(e) => handleToggle('connectivity', 'wifi', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Mobile Data</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.connectivity.mobileData}
                onChange={(e) => handleToggle('connectivity', 'mobileData', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Personal Hotspot</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.connectivity.hotspot}
                onChange={(e) => handleToggle('connectivity', 'hotspot', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Privacy & Security</h3>
        <div className="setting-group">
          <div className="setting-item">
            <span>Location Services</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.privacy.locationServices}
                onChange={(e) => handleToggle('privacy', 'locationServices', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Share Data with BMW</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.privacy.dataSharingBMW}
                onChange={(e) => handleToggle('privacy', 'dataSharingBMW', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Crash Reporting</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.privacy.crashReporting}
                onChange={(e) => handleToggle('privacy', 'crashReporting', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Analytics</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.privacy.analytics}
                onChange={(e) => handleToggle('privacy', 'analytics', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="settings-content">
      <div className="settings-section about-section">
        <h3>About System</h3>
        <div className="about-info">
          <div className="info-item">
            <span>Software Version</span>
            <span>2024.1.1</span>
          </div>
          <div className="info-item">
            <span>OS Build</span>
            <span>Firat OS 9.0</span>
          </div>
          <div className="info-item">
            <span>Hardware Version</span>
            <span>Rev. 2.3</span>
          </div>
          <div className="info-item">
            <span>Serial Number</span>
            <span>Firat2024-XXXX-XXXX</span>
          </div>
          <div className="info-item">
            <span>Legal Information</span>
            <button className="text-btn">View</button>
          </div>
          <div className="info-item">
            <span>Reset to Factory Settings</span>
            <button className="danger-btn">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button
          className={`sidebar-btn ${activeSection === 'display' ? 'active' : ''}`}
          onClick={() => setActiveSection('display')}
        >
          Display
        </button>
        <button
          className={`sidebar-btn ${activeSection === 'sound' ? 'active' : ''}`}
          onClick={() => setActiveSection('sound')}
        >
          Sound
        </button>
        <button
          className={`sidebar-btn ${activeSection === 'connectivity' ? 'active' : ''}`}
          onClick={() => setActiveSection('connectivity')}
        >
          Connectivity
        </button>
        <button
          className={`sidebar-btn ${activeSection === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveSection('privacy')}
        >
          Privacy
        </button>
        <button
          className={`sidebar-btn ${activeSection === 'about' ? 'active' : ''}`}
          onClick={() => setActiveSection('about')}
        >
          About
        </button>
      </div>

      {activeSection === 'display' && renderDisplaySettings()}
      {activeSection === 'sound' && renderSoundSettings()}
      {activeSection === 'connectivity' && renderConnectivitySettings()}
      {activeSection === 'privacy' && renderPrivacySettings()}
      {activeSection === 'about' && renderAboutSection()}
    </div>
  );
};

export default Settings; 