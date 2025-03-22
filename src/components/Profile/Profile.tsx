import React from 'react';
import './Profile.css';

interface ProfileProps {
  onBack: () => void;
  currentProfile: {
    name: string;
    image: string;
    lastUsed: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ onBack, currentProfile }) => {
  const profileSettings = [
    { icon: '👤', label: 'Edit Profile', description: 'Change name, picture, and preferences' },
    { icon: '🎨', label: 'Customize Home', description: 'Rearrange and customize widgets' },
    { icon: '🔔', label: 'Notifications', description: 'Manage alerts and reminders' },
    { icon: '🔐', label: 'Privacy', description: 'Manage privacy settings and data' },
    { icon: '📱', label: 'Connected Devices', description: 'Manage paired devices and connections' },
    { icon: '⚙️', label: 'System Settings', description: 'Language, units, and system preferences' }
  ];

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
          <span>Back to Home</span>
        </button>
        <h2>Profile Settings</h2>
      </div>

      <div className="current-profile-section">
        <div className="profile-avatar">
          <span className="avatar-image">{currentProfile.image}</span>
          <div className="edit-overlay">
            <span className="edit-icon">✏️</span>
          </div>
        </div>
        <div className="profile-details">
          <h3>{currentProfile.name}</h3>
          <p>Active Profile</p>
        </div>
      </div>

      <div className="profile-settings-grid">
        {profileSettings.map((setting, index) => (
          <div key={index} className="setting-card">
            <div className="setting-icon">{setting.icon}</div>
            <div className="setting-info">
              <h4>{setting.label}</h4>
              <p>{setting.description}</p>
            </div>
            <div className="setting-arrow">→</div>
          </div>
        ))}
      </div>

      <div className="profile-actions">
        <button className="action-button switch-profile">
          <span className="action-icon">🔄</span>
          Switch Profile
        </button>
        <button className="action-button create-profile">
          <span className="action-icon">➕</span>
          Create New Profile
        </button>
      </div>
    </div>
  );
};

export default Profile; 