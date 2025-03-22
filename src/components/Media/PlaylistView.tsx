import React from 'react';
import { Track, Playlist } from './types';

interface PlaylistViewProps {
  playlist: Playlist;
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  onTrackSelect,
  currentTrack,
  isPlaying,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <div className="playlist-cover">
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt={playlist.title} />
          ) : (
            <div className="playlist-cover-placeholder">🎵</div>
          )}
        </div>
        <div className="playlist-info">
          <h1>{playlist.title}</h1>
          <p>{playlist.description}</p>
          <div className="playlist-stats">
            <span>{playlist.tracks.length} tracks</span>
            <span>•</span>
            <span>
              {formatDuration(
                playlist.tracks.reduce((acc, track) => acc + track.duration, 0)
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="tracks-list">
        <div className="track-header">
          <div className="track-number">#</div>
          <div className="track-title">Title</div>
          <div className="track-artist">Artist</div>
          <div className="track-duration">Duration</div>
        </div>

        {playlist.tracks.map((track, index) => (
          <div
            key={track.id}
            className={`track-item ${
              currentTrack?.id === track.id ? 'playing' : ''
            }`}
            onClick={() => onTrackSelect(track)}
          >
            <div className="track-number">
              {currentTrack?.id === track.id && isPlaying ? '▶️' : index + 1}
            </div>
            <div className="track-title">{track.title}</div>
            <div className="track-artist">{track.artist}</div>
            <div className="track-duration">{formatDuration(track.duration)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistView; 