# Car Infotainment System UI

A modern car infotainment system interface with Spotify integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Spotify credentials:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
```

3. Start the development server:
```bash
npm start
```

## Security Notes

- Never commit your `.env` file or any files containing API keys/tokens
- The app uses localStorage for temporary token storage during runtime
- Spotify authentication is handled client-side using the official SDK
- Make sure to use environment variables for any sensitive data

## Development

- The app uses React for the UI
- Spotify Web Playback SDK for music playback
- Material Icons for UI elements

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]
