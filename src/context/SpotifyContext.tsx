import React, { createContext, useContext, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

interface SpotifyContextType {
  accessToken: string | null;
  deviceId: string | null;
  currentTrack: SpotifyApi.TrackObjectFull | null;
  isPlaying: boolean;
  player: Spotify.Player | null;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  setAccessToken: (token: string) => void;
  setDeviceId: (id: string) => void;
  setCurrentTrack: (track: SpotifyApi.TrackObjectFull | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlayer: (player: Spotify.Player | null) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [spotifyApi] = useState(() => new SpotifyWebApi());

  useEffect(() => {
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
    }
  }, [accessToken, spotifyApi]);

  const value = {
    accessToken,
    deviceId,
    currentTrack,
    isPlaying,
    player,
    spotifyApi,
    setAccessToken,
    setDeviceId,
    setCurrentTrack,
    setIsPlaying,
    setPlayer,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export default SpotifyContext; 