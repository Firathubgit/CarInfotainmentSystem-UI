import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotify } from '../../context/SpotifyContext';

const CLIENT_ID = '1f0725ff52af4d35bbec8b7e154a0df5';
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'user-library-read'
].join(' ');

export const SpotifyAuth: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useSpotify();

  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('scope', SCOPES);

    window.location.href = authUrl.toString();
  };

  return (
    <div className="spotify-login">
      <h2>Connect to Spotify</h2>
      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
};

export const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useSpotify();

  useEffect(() => {
    const getToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('spotify_auth_state');

      if (!code || state !== storedState) {
        navigate('/media');
        return;
      }

      try {
        const response = await fetch('http://localhost:5173/api/spotify/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to get access token');
        }

        const data = await response.json();
        setAccessToken(data.access_token);
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
        navigate('/media');
      } catch (error) {
        console.error('Error getting access token:', error);
        navigate('/media');
      }
    };

    getToken();
  }, [navigate, setAccessToken]);

  return (
    <div className="spotify-callback">
      <h2>Connecting to Spotify...</h2>
    </div>
  );
};

export default SpotifyAuth; 