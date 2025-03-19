/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SpotifyPlayer from "./components/SpotifyPlayer";
//import Callback from "./pages/Callback";

const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
].join("%20");

const CLIENT_ID = "e97ff34d76a84591bad398b97ebe5351"; // Replace with actual Client ID
const REDIRECT_URI = "http://localhost:5173/callback";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPES}`;

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

interface Track {
  name: string;
  artist: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: { total: number };
}

const App = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("spotify_token"));
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [, setDeviceId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem("spotify_token", accessToken);
        window.location.hash = "";
        navigate("/home");
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new window.Spotify.Player({
          name: "My Spotify Player",
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        newPlayer.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          transferPlaybackToDevice(device_id);
        });

        newPlayer.addListener("player_state_changed", (state) => {
          if (state && state.track_window?.current_track) {
            setTrack({
              name: state.track_window.current_track.name,
              artist: state.track_window.current_track.artists.map((artist) => artist.name).join(", "),
            });
          }
        });

        newPlayer.addListener("initialization_error", ({ message }) => setError(message));
        newPlayer.addListener("authentication_error", ({ message }) => setError(message));
        newPlayer.addListener("account_error", ({ message }) => setError(message));

        newPlayer.connect().then((success) => {
          if (success) {
            setPlayer(newPlayer);
          }
        });
      };
    };
    document.body.appendChild(script);

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token]);

  const transferPlaybackToDevice = async (device_id: string) => {
    if (!token) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [device_id], play: true }),
      });

      if (!response.ok) throw new Error(`Failed to transfer playback: ${response.statusText}`);
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("spotify_token");
            navigate("/");
            return;
          }
          throw new Error(`Error fetching playlists: ${response.statusText}`);
        }

        const data = await response.json();
        setPlaylists(data.items);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchPlaylists();
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login authUrl={AUTH_URL} />} />
        <Route path="/home" element={<Home />} />
      </Routes>

      {token && (
        <SpotifyPlayer
          player={player}
          playlists={playlists}
          error={error}
          track={track}
          onPlayPause={() => player?.togglePlay()}
        />
      )}
    </Router>
  );
};

export default App;
