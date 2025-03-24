import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './Media.css';

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => Player;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface Player {
  addListener(event: 'initialization_error', callback: (error: { message: string }) => void): void;
  addListener(event: 'authentication_error', callback: (error: { message: string }) => void): void;
  addListener(event: 'account_error', callback: (error: { message: string }) => void): void;
  addListener(event: 'playback_error', callback: (error: { message: string }) => void): void;
  addListener(event: 'player_state_changed', callback: (state: PlayerState | null) => void): void;
  addListener(event: 'ready', callback: (device: { device_id: string }) => void): void;
  addListener(event: 'not_ready', callback: (device: { device_id: string }) => void): void;
  connect(): Promise<void>;
  disconnect(): void;
  setVolume(volume: number): Promise<void>;
}

interface PlayerState {
  track_window: {
    current_track: SpotifyApi.TrackObjectFull;
  };
  paused: boolean;
}

interface MediaProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi();

const Media: React.FC<MediaProps> = ({ volume, onVolumeChange }) => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'ready_to_pair'>('connecting');
  const [deviceInfo, setDeviceInfo] = useState({
    name: 'Polestar 2',
    type: 'Car Audio',
    volume: volume,
    status: 'Initializing...'
  });
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [recentTracks, setRecentTracks] = useState<SpotifyApi.TrackObjectSimplified[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [isSearchView, setIsSearchView] = useState(false);

  // Initialize the Web Playback SDK
  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
      setError('Please add your Spotify access token to localStorage with key "spotify_token"');
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');
    spotifyApi.setAccessToken(token);

    // Fetch user's playlists
    spotifyApi.getUserPlaylists()
      .then(data => setPlaylists(data.items))
      .catch(err => console.error('Error fetching playlists:', err));

    // Fetch recently played tracks
    spotifyApi.getMyRecentlyPlayedTracks()
      .then(data => setRecentTracks(data.items.map(item => item.track)))
      .catch(err => console.error('Error fetching recent tracks:', err));

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Polestar 2',
        getOAuthToken: cb => cb(token),
        volume: volume / 100
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
        setError(message);
        setConnectionStatus('disconnected');
        setDeviceInfo(prev => ({ ...prev, status: 'Initialization Failed' }));
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
        setError(message);
        setConnectionStatus('disconnected');
        setDeviceInfo(prev => ({ ...prev, status: 'Authentication Failed' }));
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
        setError(message);
        setConnectionStatus('disconnected');
        setDeviceInfo(prev => ({ ...prev, status: 'Account Error' }));
      });

      player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
        setError(message);
        setDeviceInfo(prev => ({ ...prev, status: 'Playback Error' }));
      });

      // Playback status updates
      player.addListener('player_state_changed', state => {
        if (!state) return;
        setError(null);
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
        setDeviceInfo(prev => ({ 
          ...prev, 
          status: state.paused ? 'Paused' : 'Playing',
          volume: Math.round(volume)
        }));
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
        setError(null);
        setConnectionStatus('connected');
        setDeviceInfo(prev => ({ ...prev, status: 'Ready' }));
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID is not ready:', device_id);
        setDeviceInfo(prev => ({ ...prev, status: 'Not Ready' }));
      });

      // Connect to the player
      player.connect().catch(err => {
        console.error('Failed to connect:', err);
        setError('Failed to connect to Spotify player');
        setConnectionStatus('disconnected');
        setDeviceInfo(prev => ({ ...prev, status: 'Connection Failed' }));
      });
      
      setPlayer(player);
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (player) {
      player.setVolume(volume / 100);
    }
  }, [volume, player]);

  const handlePlayTrack = async (uri: string) => {
    if (!deviceId) return;
    
    try {
      await spotifyApi.play({
        device_id: deviceId,
        uris: [uri]
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await spotifyApi.pause();
      } else {
        await spotifyApi.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await spotifyApi.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await spotifyApi.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchView(true);
    try {
      const results = await spotifyApi.searchTracks(searchQuery);
      setSearchResults(results.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const handleBackToHome = () => {
    setIsSearchView(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  if (connectionStatus === 'connecting' || connectionStatus === 'disconnected' || connectionStatus === 'ready_to_pair') {
    return (
      <div className="media-container">
        <div className="connection-status">
          <div className="status-icon">
            {connectionStatus === 'ready_to_pair' ? '🔌' :
             connectionStatus === 'connecting' ? '🔄' : '🔌'}
          </div>
          <h2 className="status-title">
            <span className={`status-indicator ${connectionStatus}`}></span>
            {connectionStatus === 'ready_to_pair' ? 'Ready to Pair' :
             connectionStatus === 'connecting' ? 'Connecting to Spotify' :
             'Ready to Pair'}
          </h2>
          <p className="status-message">
            {connectionStatus === 'ready_to_pair' ? 'Connect your Spotify account to start playing music' :
             connectionStatus === 'connecting' ? 'Initializing playback system...' :
             'Connect your Spotify account to start playing music'}
          </p>
          <div className="device-info">
            <div className="device-info-item">
              <span className="device-info-label">Device Name</span>
              <span className="device-info-value">{deviceInfo.name}</span>
            </div>
            <div className="device-info-item">
              <span className="device-info-label">Type</span>
              <span className="device-info-value">{deviceInfo.type}</span>
            </div>
            <div className="device-info-item">
              <span className="device-info-label">Volume</span>
              <span className="device-info-value">{deviceInfo.volume}%</span>
            </div>
            <div className="device-info-item">
              <span className="device-info-label">Status</span>
              <span className="device-info-value">{deviceInfo.status}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="media-container">
      <div className="media-header">
        <form className="search-section" onSubmit={handleSearch}>
          {isSearchView && (
            <button type="button" className="back-button" onClick={handleBackToHome}>
              ← Back
            </button>
          )}
          <input
            type="text"
            className="search-input"
            placeholder="Search for songs, artists, or albums"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="media-main">
        {isSearchView ? (
          <div className="search-results">
            <h2 className="section-title">Search Results</h2>
            <div className="tracks-grid">
              {searchResults.map(track => (
                <div
                  key={track.id}
                  className="track-card"
                  onClick={() => handlePlayTrack(track.uri)}
                >
                  <img src={track.album.images[0]?.url} alt={track.name} />
                  <div className="track-info">
                    <h3>{track.name}</h3>
                    <p>{track.artists[0].name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {currentTrack && (
              <div className="now-playing">
                <div className="current-track">
                  <img
                    className="album-art"
                    src={currentTrack.album.images[0]?.url}
                    alt={currentTrack.album.name}
                  />
                  <div className="track-info">
                    <h3>{currentTrack.name}</h3>
                    <p>{currentTrack.artists[0].name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="playlists-section">
              <h2 className="section-title">Your Playlists</h2>
              <div className="playlists-grid">
                {playlists.map(playlist => (
                  <div key={playlist.id} className="playlist-card">
                    <img src={playlist.images[0]?.url} alt={playlist.name} />
                    <h3>{playlist.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-tracks-section">
              <h2 className="section-title">Recently Played</h2>
              <div className="tracks-grid">
                {recentTracks.map(track => (
                  <div
                    key={track.id}
                    className="track-card"
                    onClick={() => handlePlayTrack(track.uri)}
                  >
                    <img 
                      src={track.album?.images?.[0]?.url || '/default-album-art.png'} 
                      alt={track.name} 
                    />
                    <div className="track-info">
                      <h3>{track.name}</h3>
                      <p>{track.artists[0].name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {currentTrack && (
        <div className="now-playing-bar">
          <div className="track-info">
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.album.name}
              className="track-image"
            />
            <div className="track-details">
              <span className="track-title">{currentTrack.name}</span>
              <span className="track-artist">{currentTrack.artists[0].name}</span>
            </div>
          </div>

          <div className="playback-controls">
            <div className="control-buttons">
              <button onClick={skipToPrevious} className="control-button">
                <span className="material-icons">skip_previous</span>
              </button>
              <button onClick={togglePlayback} className="control-button play-pause">
                <span className="material-icons">
                  {isPlaying ? 'pause_circle' : 'play_circle'}
                </span>
              </button>
              <button onClick={skipToNext} className="control-button">
                <span className="material-icons">skip_next</span>
              </button>
            </div>
          </div>

          <div className="volume-control">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Media; 