import React, { useState, useEffect } from "react";

// Define the Spotify Player type
interface SpotifyPlayer {
  addListener(event: string, callback: (state: PlaybackState | null) => void): void;
  removeListener(event: string, callback: (state: PlaybackState | null) => void): void;
}

interface Track {
  name: string;
  artist: string;
}

interface Playlist {
  id: string;
  name: string;
}

interface SpotifyPlayerProps {
  player: SpotifyPlayer | null;
  playlists: Playlist[];
  error: string | null;
  onPlayPause: () => void;
}

interface SpotifyPlayer {
  addListener(event: string, callback: (state: PlaybackState | null) => void): void;
  removeListener(event: string, callback: (state: PlaybackState | null) => void): void;
}

interface PlaybackState {
  track_window: {
    current_track: {
      name: string;
      artists: { name: string }[];
    };
  };
  paused: boolean;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ player, playlists, error, onPlayPause }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  useEffect(() => {
    if (!player) return;

    const handleStateChange = (state: PlaybackState | null) => {
      if (state?.track_window?.current_track) {
        setTrack({
          name: state.track_window.current_track.name,
          artist: state.track_window.current_track.artists.map((artist) => artist.name).join(", "),
        });
        setIsPaused(state.paused);
      }
    };

    player.addListener("player_state_changed", handleStateChange);

    return () => {
      player.removeListener("player_state_changed", handleStateChange);
    };
  }, [player]);

  return (
    <div style={{ padding: "20px", background: "#222", color: "#fff" }}>
      <h2>Spotify Player</h2>
      {track ? (
        <>
          <p>Now Playing: {track.name}</p>
          <p>Artist: {track.artist}</p>
          <button onClick={onPlayPause}>{isPaused ? "Play" : "Pause"}</button>
        </>
      ) : (
        <p>Loading player...</p>
      )}

      <hr />

      {/* Display Playlists */}
      <h2>Your Playlists</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading playlists...</p>
      )}
    </div>
  );
};

export default SpotifyPlayer;
