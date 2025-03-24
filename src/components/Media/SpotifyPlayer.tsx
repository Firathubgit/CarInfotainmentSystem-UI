import React, { useEffect, useCallback } from 'react';
import { useSpotify } from '../../context/SpotifyContext';

interface WebPlaybackState {
  context: {
    uri: string;
    metadata: any;
  };
  track_window: {
    current_track: SpotifyApi.TrackObjectFull;
  };
  paused: boolean;
  position: number;
  duration: number;
}

interface WebPlaybackError {
  message: string;
}

interface WebPlaybackReady {
  device_id: string;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => {
        addListener: (eventName: string, callback: (state: any) => void) => void;
        connect: () => Promise<void>;
        disconnect: () => void;
      };
    };
  }
}

const SpotifyPlayer: React.FC = () => {
  const {
    accessToken,
    setDeviceId,
    setCurrentTrack,
    setIsPlaying,
    setPlayer,
  } = useSpotify();

  const initializePlayer = useCallback(async () => {
    if (!accessToken) return;

    const player = new window.Spotify.Player({
      name: 'Car Infotainment System',
      getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
      volume: 0.5
    });

    // Error handling
    player.addListener('initialization_error', ({ message }: WebPlaybackError) => {
      console.error('Failed to initialize:', message);
    });

    player.addListener('authentication_error', ({ message }: WebPlaybackError) => {
      console.error('Failed to authenticate:', message);
    });

    player.addListener('account_error', ({ message }: WebPlaybackError) => {
      console.error('Failed to validate Spotify account:', message);
    });

    player.addListener('playback_error', ({ message }: WebPlaybackError) => {
      console.error('Failed to perform playback:', message);
    });

    // Playback status updates
    player.addListener('player_state_changed', (state: WebPlaybackState | null) => {
      if (!state) return;

      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
    });

    // Ready
    player.addListener('ready', ({ device_id }: WebPlaybackReady) => {
      console.log('Ready with Device ID', device_id);
      setDeviceId(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }: WebPlaybackReady) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player
    await player.connect();
    setPlayer(player);

  }, [accessToken, setDeviceId, setCurrentTrack, setIsPlaying, setPlayer]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [initializePlayer]);

  return null; // This component doesn't render anything
};

export default SpotifyPlayer; 