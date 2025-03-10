import { useEffect, useState } from "react";
import { Box, Slider, IconButton, Typography } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const MusicPlayer = () => {
  const [player, setPlayer] = useState<any | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [track, setTrack] = useState<{ name: string; artist: string; albumCover: string } | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
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
          name: "My Music Player",
          getOAuthToken: (cb: (token: string) => void) => cb(token),
          volume: volume,
        });

        newPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
        });

        newPlayer.addListener("player_state_changed", (state: any) => {
          if (!state) return;

          setIsPaused(state.paused);
          setPosition(state.position);
          setDuration(state.duration);
          setTrack({
            name: state.track_window.current_track.name,
            artist: state.track_window.current_track.artists.map((a: any) => a.name).join(", "),
            albumCover: state.track_window.current_track.album.images[0].url,
          });
        });

        newPlayer.addListener("initialization_error", ({ message }: { message: string }) => {
          console.error("Initialization error:", message);
        });

        newPlayer.addListener("authentication_error", ({ message }: { message: string }) => {
          console.error("Authentication error:", message);
        });

        newPlayer.addListener("account_error", ({ message }: { message: string }) => {
          console.error("Account error:", message);
        });

        newPlayer.connect().then((success: boolean) => {
          if (success) {
            console.log("Connected to Spotify Web Playback SDK");
            setPlayer(newPlayer);
          }
        });
      };
    };

    loadSpotifySDK();

    // Cleanup on unmount
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [volume]);

  const handlePlayPause = () => {
    if (player) {
      isPaused ? player.resume() : player.pause();
    }
  };

  const handleNextTrack = () => {
    player?.nextTrack();
  };

  const handlePreviousTrack = () => {
    player?.previousTrack();
  };

  const handleShuffleToggle = () => {
    setShuffle(!shuffle);
    if (player) {
      player.setShuffle(!shuffle);
    }
  };

  const handleRepeatToggle = () => {
    setRepeat(!repeat);
    if (player) {
      player.setRepeat(!repeat ? "track" : "off");
    }
  };

  const handleVolumeChange = (newValue: number | number[]) => {
    if (player) {
      const volumeValue = newValue as number;
      player.setVolume(volumeValue);
      setVolume(volumeValue);
      setIsMuted(volumeValue === 0);
    }
  };

  const handleMuteToggle = () => {
    if (player) {
      const newVolume = isMuted ? volume : 0;
      player.setVolume(newVolume);
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (newValue: number | number[]) => {
    if (player) {
      const seekPosition = (newValue as number) * duration;
      player.seek(seekPosition);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#181818",
        color: "#ffffff",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "2px solid #1DB954",
      }}
    >
      {/* Song Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {track && <img src={track.albumCover} alt="Song Cover" width={50} height={50} />}
        <Box>
          <Typography variant="body1">{track?.name || "No song playing"}</Typography>
          <Typography variant="body2" color="textSecondary">
            {track?.artist || ""}
          </Typography>
        </Box>
      </Box>

      {/* Playback Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={handleShuffleToggle} sx={{ color: shuffle ? "#1DB954" : "#ffffff" }}>
          <ShuffleIcon />
        </IconButton>
        <IconButton onClick={handlePreviousTrack}>
          <SkipPreviousIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton onClick={handlePlayPause}>
          {isPaused ? (
            <PlayCircleFilledIcon sx={{ color: "#ffffff", fontSize: 40 }} />
          ) : (
            <PauseCircleFilledIcon sx={{ color: "#ffffff", fontSize: 40 }} />
          )}
        </IconButton>
        <IconButton onClick={handleNextTrack}>
          <SkipNextIcon sx={{ color: "#ffffff" }} />
        </IconButton>
        <IconButton onClick={handleRepeatToggle} sx={{ color: repeat ? "#1DB954" : "#ffffff" }}>
          <RepeatIcon />
        </IconButton>
      </Box>

      {/* Time & Progress Bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" sx={{ color: "#ffffff" }}>
          {new Date(position).toISOString().substr(14, 5)}
        </Typography>
        <Slider
          value={(position / duration) * 100 || 0}
          onChange={(e, newValue) => handleSeek(newValue)}
          sx={{ width: 200, color: "#1DB954" }}
        />
        <Typography variant="body2" sx={{ color: "#ffffff" }}>
          {new Date(duration).toISOString().substr(14, 5)}
        </Typography>
      </Box>

      {/* Volume Control */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={handleMuteToggle}>
          {isMuted ? <VolumeOffIcon sx={{ color: "#ffffff" }} /> : <VolumeUpIcon sx={{ color: "#ffffff" }} />}
        </IconButton>
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={(e, newValue) => handleVolumeChange(newValue)}
          sx={{ width: 100, color: "#1DB954" }}
        />
      </Box>
    </Box>
  );
};

export default MusicPlayer;