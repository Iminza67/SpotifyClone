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
import { Brightness4, Brightness7, Instagram, Twitter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // For navigation
import '../styles/Login.css'; // Custom CSS for animations and styling

interface LoginProps {
  authUrl: string;
}

const Login: React.FC<LoginProps> = ({ authUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // Replaces window.location.href

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        ?.split('=')[1];

      if (token) {
        console.log('Access Token:', token);
        localStorage.setItem('spotify_token', token);
        navigate('/home'); // Navigate instead of changing href
      } else {
        const error = hash
          .substring(1)
          .split('&')
          .find(elem => elem.startsWith('error'))
          ?.split('=')[1];

        if (error) {
          setError('Login failed. Please try again.');
        }
      }
    }
  }, [navigate]);

  const handleLogin = () => {
    setIsLoading(true);
    setError(null);

    try {
      window.location.href = authUrl;
    } catch {
      setError('An error occurred while trying to log in. Please try again.');
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode); // Functional state update
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1DB954' },
      background: { default: darkMode ? '#121212' : '#ffffff', paper: darkMode ? '#1E1E1E' : '#f5f5f5' },
    },
    typography: { fontFamily: 'Montserrat, sans-serif' },
  });

  return (
    <ThemeProvider theme={customTheme}>
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
          <IconButton onClick={toggleDarkMode} sx={{ position: 'absolute', top: 16, right: 16 }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to My Music Player
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: darkMode ? '#b3b3b3' : '#666666' }}>
            Log in with your Spotify account to access your playlists and start listening.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value as string)}
              sx={{ width: '100%', borderRadius: '20px' }}
              MenuProps={{ disableScrollLock: true }} // Prevents layout shift
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
              <MenuItem value="it">Italiano</MenuItem>
            </Select>
          </Box>

          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
            label="Remember Me"
            sx={{ mb: 3, color: darkMode ? '#b3b3b3' : '#666666' }}
          />

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
              '&:hover': { backgroundColor: '#1ED760' },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login with Spotify'}
          </Button>

          {error && <Typography variant="body2" color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton href="https://twitter.com" target="_blank">
              <Twitter sx={{ color: '#1DA1F2' }} />
            </IconButton>
            <IconButton href="https://instagram.com" target="_blank">
              <Instagram sx={{ color: '#E1306C' }} />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, color: darkMode ? '#b3b3b3' : '#666666' }}>
            By logging in, you agree to our{' '}
            <a href="/terms" target="_blank" style={{ color: '#1DB954', textDecoration: 'none' }}>
              Terms and Conditions
            </a>.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
