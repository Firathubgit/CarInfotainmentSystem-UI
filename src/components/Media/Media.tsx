import React, { useState, useEffect, useRef } from 'react';
import PlaylistView from './PlaylistView';
import { Track, Playlist } from './types';
import './Media.css';

const Media: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'driving-mix',
      title: 'Driving Mix',
      description: 'Perfect for your journey',
      tracks: [
        {
          id: '1',
          title: 'Highway to Heaven',
          artist: 'Road Warriors',
          duration: 240,
          audioUrl: '/audio/highway.mp3'
        },
        {
          id: '2',
          title: 'Night Drive',
          artist: 'Midnight Cruisers',
          duration: 180,
          audioUrl: '/audio/night-drive.mp3'
        },
        {
          id: '3',
          title: 'City Lights',
          artist: 'Urban Riders',
          duration: 210,
          audioUrl: '/audio/city-lights.mp3'
        }
      ]
    },
    {
      id: 'chill',
      title: 'Chill Vibes',
      description: 'Relaxed driving playlist',
      tracks: [
        {
          id: '4',
          title: 'Sunset Cruise',
          artist: 'Ocean Drive',
          duration: 195,
          audioUrl: '/audio/sunset.mp3'
        },
        {
          id: '5',
          title: 'Mountain Air',
          artist: 'Alpine Drifters',
          duration: 225,
          audioUrl: '/audio/mountain.mp3'
        }
      ]
    },
    {
      id: 'energy',
      title: 'Energy Boost',
      description: 'High energy tracks',
      tracks: [
        {
          id: '6',
          title: 'Speed Demon',
          artist: 'Turbo',
          duration: 180,
          audioUrl: '/audio/speed.mp3'
        },
        {
          id: '7',
          title: 'Race Day',
          artist: 'Track Kings',
          duration: 200,
          audioUrl: '/audio/race.mp3'
        }
      ]
    },
    {
      id: 'classics',
      title: 'Classic Hits',
      description: 'Timeless favorites',
      tracks: [
        {
          id: '8',
          title: 'Route 66',
          artist: 'Highway Legends',
          duration: 240,
          audioUrl: '/audio/route66.mp3'
        },
        {
          id: '9',
          title: 'Cruising',
          artist: 'The Roadsters',
          duration: 210,
          audioUrl: '/audio/cruising.mp3'
        }
      ]
    }
  ]);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    // Set up audio event listeners
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio) {
        const progressValue = (audio.currentTime / audio.duration) * 100;
        setProgress(progressValue);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      // Auto-play next track logic could be added here
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    
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

    return () => {
      if (volumeTimeout.current) {
        clearTimeout(volumeTimeout.current);
      }
    };
  }, [volume]);

  const handlePlayPause = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      handlePlayPause();
      return;
    }

    setCurrentTrack(track);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    handleVolumeChange(delta);
  };

  return (
    <div className="media-container">
      <div className="media-header">
        {selectedPlaylist && (
          <button className="back-button" onClick={handleBackToPlaylists}>
            ←
          </button>
        )}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search songs, artists, or playlists"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="media-content">
        {selectedPlaylist ? (
          <PlaylistView
            playlist={selectedPlaylist}
            onTrackSelect={handleTrackSelect}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        ) : (
          <>
            <h2 className="section-title">Your Playlists</h2>
            <div className="playlists-grid">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <div className="playlist-image">🎵</div>
                  <div className="playlist-title">{playlist.title}</div>
                  <div className="playlist-info">
                    {playlist.tracks.length} tracks • {playlist.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showVolumeIndicator && (
        <div className="volume-indicator">
          <div className="volume-icon">🔊</div>
          <div className="volume-level">{Math.round(volume * 100)}%</div>
        </div>
      )}

      <div className="now-playing-bar">
        <div className="track-info">
          {currentTrack && (
            <>
              <div className="track-image">🎵</div>
              <div className="track-details">
                <div className="track-title">{currentTrack.title}</div>
                <div className="track-artist">{currentTrack.artist}</div>
              </div>
            </>
          )}
        </div>

        <div className="playback-controls">
          <div className="control-buttons">
            <button className="control-btn">⏮️</button>
            <button className="control-btn play-pause" onClick={handlePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="control-btn">⏭️</button>
          </div>
          <div className="progress-bar">
            <span>{currentTrack ? formatTime(audioRef.current?.currentTime || 0) : '0:00'}</span>
            <span>{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media; 