/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "playlist-read-private",
  "playlist-read-collaborative",
].join("%20");

const CLIENT_ID = "e97ff34d76a84591bad398b97ebe5351"; // Replace with your Client ID
const REDIRECT_URI = "http://localhost:5173/callback";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPES}`;

const getStoredToken = () => {
  const token = localStorage.getItem("spotify_token");
  const expiry = localStorage.getItem("spotify_token_expiry");

  if (!token || !expiry) return null;

  if (Date.now() > parseInt(expiry)) {
    console.warn("Token expired, redirecting to login");
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_token_expiry");
    return null;
  }

  return token;
};

const App = () => {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const expiresIn = parseInt(params.get("expires_in") || "3600") * 1000;
      const expiryTime = Date.now() + expiresIn;

      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem("spotify_token", accessToken);
        localStorage.setItem("spotify_token_expiry", expiryTime.toString());
        window.location.hash = "";
        navigate("/home");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    // Ensure `onSpotifyWebPlaybackSDKReady` is set **before** loading the script
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify SDK Ready! Initializing player...");
      setupSpotifyPlayer();
    };

    if (!document.getElementById("spotify-player-script")) {
      console.log("Loading Spotify Web Playback SDK...");
      const script = document.createElement("script");
      script.id = "spotify-player-script";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      console.log("Spotify SDK already loaded.");
      if (window.Spotify) {
        setupSpotifyPlayer();
      }
    }

    return () => {
      if (player) {
        console.log("Disconnecting Spotify Player...");
        player.disconnect();
      }
    };
  }, [token, player]);

  const setupSpotifyPlayer = () => {
    if (!window.Spotify || !token) {
      console.error("Spotify SDK not available or token missing.");
      return;
    }

    console.log("Setting up Spotify Player...");
    const newPlayer = new window.Spotify.Player({
      name: "Spotify Web Player",
      getOAuthToken: (cb) => cb(token),
      volume: 0.5,
    });

    newPlayer.addListener("ready", ({ device_id }) => {
      console.log("Spotify Web Playback SDK Ready! Device ID:", device_id);
      transferPlaybackToDevice(device_id);
    });

    newPlayer.addListener("initialization_error", ({ message }) => console.error("Initialization Error:", message));
    newPlayer.addListener("authentication_error", ({ message }) => console.error("Authentication Error:", message));
    newPlayer.addListener("account_error", ({ message }) => console.error("Account Error:", message));
    newPlayer.addListener("playback_error", ({ message }) => console.error("Playback Error:", message));

    newPlayer.connect().then((success) => {
      if (success) {
        console.log("Spotify Player connected successfully.");
        setPlayer(newPlayer);
      } else {
        console.error("Failed to connect Spotify Player.");
      }
    });
  };

  const transferPlaybackToDevice = async (deviceId: string) => {
    if (!token) {
      console.error("No token available.");
      return;
    }

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [deviceId], play: true }),
      });

      if (!response.ok) {
        throw new Error(`Failed to transfer playback: ${response.statusText}`);
      }

      console.log("Playback transferred to Web Player.");
    } catch (error) {
      console.error("Error transferring playback:", error);
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login authUrl={AUTH_URL} />} />
      <Route path="/home" element={<Home player={player} />} />
    </Routes>
  );
};

export default App;