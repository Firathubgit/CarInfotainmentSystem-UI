import React, { useState } from 'react';
import './Phone.css';

interface Device {
  id: string;
  name: string;
  type: 'ios' | 'android';
  model: string;
  connected: boolean;
  permissions: {
    bluetooth: boolean;
    contacts: boolean;
    calls: boolean;
    messages: boolean;
  };
}

interface RecentCall {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  deviceId: string;
}

const Phone: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'iphone13',
      name: "John's iPhone 13 Pro",
      type: 'ios',
      model: 'iPhone 13 Pro',
      connected: false,
      permissions: {
        bluetooth: false,
        contacts: false,
        calls: false,
        messages: false
      }
    },
    {
      id: 'iphone12',
      name: "Sarah's iPhone 12",
      type: 'ios',
      model: 'iPhone 12',
      connected: false,
      permissions: {
        bluetooth: false,
        contacts: false,
        calls: false,
        messages: false
      }
    },
    {
      id: 's23',
      name: "Mike's Galaxy S23",
      type: 'android',
      model: 'Samsung Galaxy S23',
      connected: false,
      permissions: {
        bluetooth: false,
        contacts: false,
        calls: false,
        messages: false
      }
    },
    {
      id: 'pixel7',
      name: "Emma's Pixel 7",
      type: 'android',
      model: 'Google Pixel 7',
      connected: false,
      permissions: {
        bluetooth: false,
        contacts: false,
        calls: false,
        messages: false
      }
    }
  ]);

  const [recentCalls] = useState<RecentCall[]>([
    {
      id: '1',
      name: 'Alex Thompson',
      number: '+1 (555) 123-4567',
      type: 'incoming',
      time: '10:30 AM',
      deviceId: 'iphone13'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      number: '+1 (555) 234-5678',
      type: 'outgoing',
      time: 'Yesterday',
      deviceId: 'iphone13'
    },
    {
      id: '3',
      name: 'David Wilson',
      number: '+1 (555) 345-6789',
      type: 'missed',
      time: '2 days ago',
      deviceId: 's23'
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setShowPermissions(true);
  };

  const handlePermissionToggle = (deviceId: string, permission: keyof Device['permissions']) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          permissions: {
            ...device.permissions,
            [permission]: !device.permissions[permission]
          }
        };
      }
      return device;
    }));
  };

  const handleConnect = (deviceId: string) => {
    setDevices(devices.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          connected: true
        };
      }
      return device;
    }));
    setShowPermissions(false);
  };

  const renderDeviceList = () => (
    <div className="device-list">
      <div className="device-section">
        <h3>iOS Devices</h3>
        <div className="devices">
          {devices.filter(device => device.type === 'ios').map(device => (
            <div 
              key={device.id} 
              className={`device-card ${device.connected ? 'connected' : ''}`}
              onClick={() => handleDeviceSelect(device.id)}
            >
              <div className="device-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 3C17.0747 3 17.6346 3.09325 18.1572 3.27385C18.6798 3.45445 19.1564 3.71892 19.5686 4.05752C19.9808 4.39612 20.3213 4.80092 20.5785 5.25946C20.8356 5.718 21 6.21789 21 6.72727V17.2727C21 17.7821 20.8356 18.282 20.5785 18.7405C20.3213 19.1991 19.9808 19.6039 19.5686 19.9425C19.1564 20.2811 18.6798 20.5456 18.1572 20.7262C17.6346 20.9068 17.0747 21 16.5 21H7.5C6.92535 21 6.36544 20.9068 5.84284 20.7262C5.32024 20.5456 4.84361 20.2811 4.43141 19.9425C4.01921 19.6039 3.67873 19.1991 3.42157 18.7405C3.16442 18.282 3 17.7821 3 17.2727V6.72727C3 6.21789 3.16442 5.718 3.42157 5.25946C3.67873 4.80092 4.01921 4.39612 4.43141 4.05752C4.84361 3.71892 5.32024 3.45445 5.84284 3.27385C6.36544 3.09325 6.92535 3 7.5 3H16.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="18" r="1" fill="currentColor"/>
                </svg>
              </div>
              <div className="device-info">
                <span className="device-name">{device.name}</span>
                <span className="device-model">{device.model}</span>
                <span className="connection-status">
                  {device.connected ? 'Connected' : 'Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="device-section">
        <h3>Android Devices</h3>
        <div className="devices">
          {devices.filter(device => device.type === 'android').map(device => (
            <div 
              key={device.id} 
              className={`device-card ${device.connected ? 'connected' : ''}`}
              onClick={() => handleDeviceSelect(device.id)}
            >
              <div className="device-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 16V8C5 7.45 5.196 6.979 5.588 6.587C5.98 6.195 6.451 5.999 7 6H17C17.55 6 18.021 6.196 18.413 6.588C18.805 6.98 19.001 7.451 19 8V16C19 16.55 18.804 17.021 18.412 17.413C18.02 17.805 17.549 18.001 17 18H7C6.45 18 5.979 17.804 5.587 17.412C5.195 17.02 4.999 16.549 5 16ZM7 8V16H17V8H7ZM2 20V4H22V20H2Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="device-info">
                <span className="device-name">{device.name}</span>
                <span className="device-model">{device.model}</span>
                <span className="connection-status">
                  {device.connected ? 'Connected' : 'Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPermissions = () => {
    const device = devices.find(d => d.id === selectedDevice);
    if (!device) return null;

    return (
      <div className="permissions-overlay">
        <div className="permissions-content">
          <h3>Connect to {device.name}</h3>
          <p>Allow the following permissions to enable full functionality:</p>
          
          <div className="permissions-list">
            <label className="permission-item">
              <input
                type="checkbox"
                checked={device.permissions.bluetooth}
                onChange={() => handlePermissionToggle(device.id, 'bluetooth')}
              />
              <span className="permission-label">Bluetooth</span>
              <span className="permission-desc">Required for device connection</span>
            </label>
            
            <label className="permission-item">
              <input
                type="checkbox"
                checked={device.permissions.contacts}
                onChange={() => handlePermissionToggle(device.id, 'contacts')}
              />
              <span className="permission-label">Contacts</span>
              <span className="permission-desc">Access to phone contacts</span>
            </label>
            
            <label className="permission-item">
              <input
                type="checkbox"
                checked={device.permissions.calls}
                onChange={() => handlePermissionToggle(device.id, 'calls')}
              />
              <span className="permission-label">Phone</span>
              <span className="permission-desc">Make and receive calls</span>
            </label>
            
            <label className="permission-item">
              <input
                type="checkbox"
                checked={device.permissions.messages}
                onChange={() => handlePermissionToggle(device.id, 'messages')}
              />
              <span className="permission-label">Messages</span>
              <span className="permission-desc">Send and receive messages</span>
            </label>
          </div>

          <div className="permission-actions">
            <button 
              className="cancel-btn"
              onClick={() => setShowPermissions(false)}
            >
              Cancel
            </button>
            <button 
              className="connect-btn"
              onClick={() => handleConnect(device.id)}
              disabled={!device.permissions.bluetooth}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRecentCalls = () => (
    <div className="recent-calls">
      <h3>Recent Calls</h3>
      <div className="calls-list">
        {recentCalls.map(call => {
          const device = devices.find(d => d.id === call.deviceId);
          return (
            <div key={call.id} className="call-item">
              <div className="call-icon">
                {call.type === 'incoming' ? '↙' : call.type === 'outgoing' ? '↗' : '✕'}
              </div>
              <div className="call-details">
                <span className="call-name">{call.name}</span>
                <span className="call-number">{call.number}</span>
                <span className="call-time">
                  {call.time} • via {device?.name}
                </span>
              </div>
              <div className="call-actions">
                <button className="call-btn">Call</button>
                <button className="info-btn">i</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="phone-container">
      <div className="phone-header">
        <h2>Phone</h2>
      </div>
      
      {renderDeviceList()}
      {showPermissions && renderPermissions()}
      {renderRecentCalls()}
    </div>
  );
};

export default Phone; 