// src/pages/Login/Login.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { Brightness4, Brightness7 } from '@mui/icons-material'; // Icons for dark/light mode
import '../styles/Login.css'; // Custom CSS for animations and styling

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=e97ff34d76a84591bad398b97ebe5351&redirect_uri=${encodeURIComponent(
  'http://localhost:5173/callback'
)}&response_type=token&scope=user-read-private user-read-email`;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1) // Remove the '#' from the beginning
        .split('&') // Split into key-value pairs
        .find(elem => elem.startsWith('access_token')) // Find the access token
        ?.split('=')[1]; // Extract the token value

      if (token) {
        console.log('Access Token:', token); // Log the token for debugging
        localStorage.setItem('spotify_token', token); // Save the token in localStorage
        window.location.hash = ''; // Clear the hash from the URL
        window.location.href = '/home'; // Redirect to the home page
      } else {
        // Handle errors
        const error = hash
          .substring(1)
          .split('&')
          .find(elem => elem.startsWith('error'))
          ?.split('=')[1];

        if (error) {
          setError('Login failed. Please try again.'); // Set error message
        }
      }
    }
  }, []); // Run this effect only once on component mount

  const handleLogin = () => {
    setIsLoading(true);
    setError(null);

    try {
      // Redirect to Spotify's authorization page
      window.location.href = SPOTIFY_AUTH_URL;
    } catch {
      setError('An error occurred while trying to log in. Please try again.');
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1DB954', // Spotify green
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1E1E1E' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: 'Montserrat, sans-serif', // Use a Spotify-like font
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      {/* Gradient Background */}
         <Box className="gradient-background" />
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >


        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 4,
            backgroundColor: darkMode ? '#1E1E1E' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {/* Dark Mode Toggle */}
          <IconButton
            onClick={toggleDarkMode}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>


          {/* Title */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to My Music Player
          </Typography>

          {/* Description */}
          <Typography variant="body1" sx={{ mb: 4, color: darkMode ? '#b3b3b3' : '#666666' }}>
            Log in with your Spotify account to access your playlists and start listening.
          </Typography>

          {/* Language Selection */}
          <Box sx={{ mb: 3 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as string)}
              sx={{ width: '100%', borderRadius: '20px' }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="it">Italiano</MenuItem>
            </Select>
          </Box>

          {/* Remember Me Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember Me"
            sx={{ mb: 3, color: darkMode ? '#b3b3b3' : '#666666' }}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={isLoading}
            sx={{
              backgroundColor: '#1DB954',
              color: '#fff',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              '&:hover': {
                backgroundColor: '#1ED760',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login with Spotify'}
          </Button>

          {/* Error Message */}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Social Media Links */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton href="https://twitter.com" target="_blank">
              <img src="/Logos/x-logo.png" alt="Twitter" width={24} height={24} />
            </IconButton>
            <IconButton href="https://instagram.com" target="_blank">
              <img src="/Logos/instagram-logo.png" alt="Instagram" width={24} height={24} />
            </IconButton>
          </Box>

          {/* Terms and Conditions */}
          <Typography variant="body2" sx={{ mt: 3, color: darkMode ? '#b3b3b3' : '#666666' }}>
            By logging in, you agree to our{' '}
            <a href="/terms" target="_blank" style={{ color: '#1DB954', textDecoration: 'none' }}>
              Terms and Conditions
            </a>
            .
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;