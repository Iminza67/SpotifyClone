import { useEffect, useState } from "react";
import { Spotify } from "spotify-web-playback-sdk";
import SpotifyWebApi, { SpotifyApi } from "spotify-web-api-js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SpotifyPlayer from "./components/SpotifyPlayer";

const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative"
].join("%20");

const CLIENT_ID = "e97ff34d76a84591bad398b97ebe5351";  // Replace with your actual Client ID
const REDIRECT_URI = "http://localhost:5173/home";  // Redirects back to your home page

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPES}`;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Spotify: any; // You might want to type `Spotify` here if you want better support
  }
}

interface Track {
  name: string;
  artist: string;
}


const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [, setDeviceId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem("spotify_token", accessToken);
        window.location.hash = ""; // Clear URL hash
      }
    } else {
      const storedToken = localStorage.getItem("spotify_token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const loadSpotifySDK = () => {
      if (!window.Spotify) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        script.onload = setupPlayer;
        document.body.appendChild(script);
      } else {
        setupPlayer();
      }
    };

    const setupPlayer = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new window.Spotify.Player({
          name: "My Spotify Player",
          getOAuthToken: (cb: (token: string) => void) => cb(token),
          volume: 0.5,
        });

        newPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          transferPlaybackToDevice(device_id);
        });

        newPlayer.addListener("player_state_changed", (state: any) => {
          if (state && state.track_window?.current_track) {
            setTrack({
              name: state.track_window.current_track.name,
              artist: state.track_window.current_track.artists.map((artist: any) => artist.name).join(", "),
            });
          }
        });

        newPlayer.addListener("initialization_error", ({ message }: { message: string }) => setError(message));
        newPlayer.addListener("authentication_error", ({ message }: { message: string }) => setError(message));
        newPlayer.addListener("account_error", ({ message }: { message: string }) => setError(message));

        newPlayer.connect().then((success: boolean) => {
          if (success) {
            setPlayer(newPlayer);
          }
        });
      };
    };

    loadSpotifySDK();

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const transferPlaybackToDevice = async (device_id: string) => {
    if (!token) {
      console.error("No token available"); // Debugging
      return;
    }
  
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [device_id], play: true }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to transfer playback: ${response.statusText}`);
      }
  
      console.log("Playback transferred to Web Player"); // Debugging
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };
  

  useEffect(() => {
    if (!token) return;

    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem("spotify_token");
        if (!token) {
          setError("No access token found. Please log in again.");
          return;
        }
    
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          if (response.status === 401) {
            // Token is expired or invalid
            localStorage.removeItem("spotify_token");
            window.location.href = "/"; // Redirect to login page
            return;
          }
          throw new Error(`Error fetching playlists: ${response.statusText}`);
        }
    
        const data = await response.json();
        setPlaylists(data.items);
      } catch (err: any) {
        console.error("Error fetching playlists:", err.message);
        setError(err.message);
      }
    };

    fetchPlaylists();
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      {token && (
        <SpotifyPlayer player={player} playlists={playlists} error={error} onPlayPause={() => player?.togglePlay()} />
      )}
    </Router>
  );
};

export default App;
